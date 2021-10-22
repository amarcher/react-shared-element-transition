import React, { useState, useCallback, useEffect, useRef } from 'react';
import type {
  MountSharedElementInput,
  SharedElement,
  SharedElementToTransition,
  SharedElementContextType,
} from './types';
import { GHOST_LAYER_STYLE, DEFAULT_ANIMATION_OPTIONS, GHOST_LAYER_CLEAR_TIMEOUT, DEBOUNCE_TIMEOUT } from './constants';
import { getKeyframes as getDefaultKeyframes, getNode as getDefaultNode } from './utils';

type Props = {
  children: React.ReactElement;
  pathname: string;
};

export const SharedElementContext = React.createContext<SharedElementContextType>({
  mountSharedElement() {},
  isTransitioning: false,
  activePathname: undefined,
});

function isSharedElementToTransition(
  sharedElement: SharedElement | SharedElementToTransition
): sharedElement is SharedElementToTransition {
  return !!(
    sharedElement.firstBoundingClientRect &&
    sharedElement.lastBoundingClientRect &&
    sharedElement.node &&
    typeof sharedElement.id !== 'undefined'
  );
}

export default function ShareElementContextProvider({ children, pathname }: Props) {
  // Only require the polyfill on the client. If loaded on the server, a "document is not defined" error is thrown.
  useEffect(() => {
    require('web-animations-js');
  }, []);

  const ghostLayerRef = useRef<HTMLDivElement>(null);
  const prevPathname = useRef<string | undefined>(pathname);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sharedElements, setSharedElements] = useState<Record<string, SharedElement>>({});

  const clearGhostLayer = useCallback(() => {
    if (!ghostLayerRef.current) return;

    while (ghostLayerRef.current.firstChild) {
      ghostLayerRef.current.removeChild(ghostLayerRef.current.firstChild);
    }

    ghostLayerRef.current.style.pointerEvents = 'none';
  }, [ghostLayerRef]);

  const updateSharedElement = useCallback(
    (
      {
        id,
        ref,
        animationOptions: providedAnimationOptions,
        getNode = getDefaultNode,
        getKeyframes = getDefaultKeyframes,
      }: MountSharedElementInput,
      lastSeenAtPathname: string
    ) => {
      const animationOptions = { ...DEFAULT_ANIMATION_OPTIONS, ...providedAnimationOptions };
      setSharedElements((prevSharedElements) => {
        const lastBoundingClientRect = ref.getBoundingClientRect();
        const getNodeInput = {
          firstNode: prevSharedElements[id].node!.cloneNode(true) as HTMLDivElement,
          lastNode: ref.cloneNode(true) as HTMLDivElement,
          firstBoundingClientRect: prevSharedElements[id].firstBoundingClientRect!,
          lastBoundingClientRect,
          animationOptions,
        };
        const node = getNode(getNodeInput);
        const animation = node.animate(
          getKeyframes({
            firstBoundingClientRect: prevSharedElements[id].firstBoundingClientRect!,
            lastBoundingClientRect,
          }),
          animationOptions
        );
        if (ghostLayerRef.current) {
          ghostLayerRef.current.appendChild(node);
          ghostLayerRef.current.style.pointerEvents = 'all';
        }

        const element = {
          ...prevSharedElements[id],
          lastBoundingClientRect,
          node,
          animation,
          lastSeenAtPathname,
        } as SharedElementToTransition;

        return {
          ...prevSharedElements,
          [id]: element,
        };
      });
    },
    []
  );

  const addSharedElement = useCallback(
    ({ id, ref }: MountSharedElementInput, lastSeenAtPathname: string) =>
      setSharedElements((prevSharedElements) => {
        return {
          ...prevSharedElements,
          [id]: {
            lastSeenAtPathname,
            firstBoundingClientRect: ref.getBoundingClientRect(),
            node: ref,
            id,
          },
        };
      }),
    []
  );

  // Recalculate the bounding boxes of all shared elements on resize or scroll
  const onResizeOrScroll = useCallback(() => {
    setSharedElements((prevSharedElements) => {
      return Object.keys(prevSharedElements).reduce((sharedElements, id) => {
        sharedElements[id] = {
          ...prevSharedElements[id],
          firstBoundingClientRect:
            prevSharedElements[id].node?.getBoundingClientRect() || prevSharedElements[id].firstBoundingClientRect,
        };
        return sharedElements;
      }, {} as Record<string, SharedElement>);
    });
  }, []);

  const debouncedOnResizeOrScroll = useCallback(() => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(onResizeOrScroll, DEBOUNCE_TIMEOUT);
  }, [onResizeOrScroll]);

  useEffect(() => {
    window.addEventListener('resize', debouncedOnResizeOrScroll);
    document.addEventListener('scroll', debouncedOnResizeOrScroll);
    return () => {
      window.removeEventListener('resize', debouncedOnResizeOrScroll);
      document.addEventListener('scroll', debouncedOnResizeOrScroll);
    };
  }, [debouncedOnResizeOrScroll]);

  const endTransition = useCallback(() => {
    setSharedElements({});
    setIsTransitioning(false);
    setTimeout(clearGhostLayer, GHOST_LAYER_CLEAR_TIMEOUT);
  }, [clearGhostLayer]);

  const maybeTransition = useCallback(async () => {
    const sharedElementsToTransition = Object.values(sharedElements).filter(isSharedElementToTransition);
    if (sharedElementsToTransition.length) {
      return Promise.all(sharedElementsToTransition.map(({ animation }) => animation.finished)).finally(endTransition);
    }

    setIsTransitioning(false);
    return Promise.resolve().then(() => setIsTransitioning(false));
  }, [endTransition, sharedElements]);

  /*
   * Transition now that the setState stack is clear
   */
  useEffect(() => {
    if (!isTransitioning && pathname !== prevPathname.current) {
      maybeTransition().then(() => {
        prevPathname.current = pathname;
      });
    }
  }, [pathname, isTransitioning, maybeTransition]);

  const mountSharedElement = useCallback(
    (sharedElement: MountSharedElementInput, pathnameOfSharedElement: string) => {
      if (!sharedElements[sharedElement.id]) {
        addSharedElement(sharedElement, pathnameOfSharedElement);
      } else if (sharedElements[sharedElement.id]?.lastSeenAtPathname !== pathnameOfSharedElement) {
        updateSharedElement(sharedElement, pathnameOfSharedElement);
        setIsTransitioning(true);
      }
    },
    [addSharedElement, updateSharedElement, sharedElements]
  );

  return (
    <SharedElementContext.Provider
      value={{
        mountSharedElement,
        isTransitioning,
        activePathname: prevPathname.current,
      }}
    >
      <>
        {children}
        <div className="GhostLayer" style={GHOST_LAYER_STYLE} ref={ghostLayerRef} />
      </>
    </SharedElementContext.Provider>
  );
}

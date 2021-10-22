import React, { useEffect, useRef } from 'react';
import useSharedElementContext from './useSharedElementContext';
import { GetNodeInput, GetKeyframesInput } from './types';

type Props = {
  children: React.ReactElement;
  id: string;
  pathname: string;
  animationOptions?: KeyframeAnimationOptions;
  getNode?: (input: GetNodeInput) => HTMLDivElement;
  getKeyframes?: (input: GetKeyframesInput) => Keyframe[];
};

export default function SharedElement({ children, id, pathname, animationOptions, getNode, getKeyframes }: Props) {
  const { mountSharedElement } = useSharedElementContext();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;

    if (!node) return;

    const sharedElement = {
      animationOptions,
      ref: node,
      id,
      getKeyframes,
      getNode,
    };

    mountSharedElement(sharedElement, pathname);
  }, [id, mountSharedElement, ref, pathname, animationOptions, getNode, getKeyframes]);

  return <div ref={ref}>{children}</div>;
}

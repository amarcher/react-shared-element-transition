export interface GetNodeInput {
  firstNode: HTMLDivElement;
  lastNode: HTMLDivElement;
  firstBoundingClientRect: DOMRect;
  lastBoundingClientRect: DOMRect;
  animationOptions: KeyframeAnimationOptions;
}

export interface GetKeyframesInput {
  firstBoundingClientRect: DOMRect;
  lastBoundingClientRect: DOMRect;
}

export interface MountSharedElementInput {
  id: string;
  ref: HTMLDivElement;
  animationOptions?: KeyframeAnimationOptions;
  getNode?: (input: GetNodeInput) => HTMLDivElement;
  getKeyframes?: (input: GetKeyframesInput) => Keyframe[];
}

export interface SharedElement {
  id: string;
  node?: HTMLDivElement;
  firstBoundingClientRect?: DOMRect;
  lastBoundingClientRect?: DOMRect;
  animation?: Animation;
  lastSeenAtPathname?: string;
}

export interface SharedElementToTransition extends SharedElement {
  node: HTMLDivElement;
  firstBoundingClientRect: DOMRect;
  lastBoundingClientRect: DOMRect;
  animation: Animation;
}

export type SharedElementContextType = {
  mountSharedElement: (sharedElement: MountSharedElementInput, pathname: string) => void;
  activePathname?: string;
  isTransitioning: boolean;
};

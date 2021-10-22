import type { GetNodeInput, GetKeyframesInput } from './types';
export declare function getKeyframes(rects: GetKeyframesInput): Keyframe[];
export declare function getFlipKeyframes(rects: GetKeyframesInput): Keyframe[];
export declare function getNode({ lastNode, lastBoundingClientRect, }: Partial<GetNodeInput> & {
    lastNode: HTMLDivElement;
    lastBoundingClientRect: DOMRect;
}): HTMLDivElement;
export declare function getFlipNode({ firstNode, lastNode: lastFace, firstBoundingClientRect, lastBoundingClientRect, }: GetNodeInput): HTMLDivElement;
export declare function getCrossfadeNode({ firstNode, lastNode, firstBoundingClientRect, lastBoundingClientRect, animationOptions, }: GetNodeInput): HTMLDivElement;

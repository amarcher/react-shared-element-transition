import React from 'react';
declare type Props = {
    children: React.ReactElement;
    pathname: string;
};
export interface MountSharedElementInput {
    id: string;
    ref: HTMLDivElement;
}
export interface SharedElement {
    id: string;
    node?: HTMLDivElement;
    firstBoundingClientRect?: DOMRect;
    lastBoundingClientRect?: DOMRect;
    animation?: Animation;
}
export interface SharedElementToTransition extends SharedElement {
    node: HTMLDivElement;
    firstBoundingClientRect: DOMRect;
    lastBoundingClientRect: DOMRect;
    animation: Animation;
}
export declare type SharedElementContextType = {
    mountSharedElement: (sharedElement: MountSharedElementInput, pathname?: string) => void;
    activePathname?: string;
    isTransitioning: boolean;
};
export declare const SharedElementContext: React.Context<SharedElementContextType>;
export default function ShareElementContextProvider({ children, pathname, }: Props): JSX.Element;
export {};

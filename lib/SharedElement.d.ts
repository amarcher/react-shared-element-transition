import React from 'react';
import { GetNodeInput, GetKeyframesInput } from './types';
declare type Props = {
    children: React.ReactElement;
    id: string;
    pathname: string;
    animationOptions?: KeyframeAnimationOptions;
    getNode?: (input: GetNodeInput) => HTMLDivElement;
    getKeyframes?: (input: GetKeyframesInput) => Keyframe[];
};
export default function SharedElement({ children, id, pathname, animationOptions, getNode, getKeyframes }: Props): JSX.Element;
export {};

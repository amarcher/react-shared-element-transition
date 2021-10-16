import React from 'react';
declare type Props = {
    children: React.ReactElement;
    id: string;
    pathname: string;
    animationOptions?: KeyframeAnimationOptions;
};
export default function SharedElement({ children, id, pathname, animationOptions }: Props): JSX.Element;
export {};

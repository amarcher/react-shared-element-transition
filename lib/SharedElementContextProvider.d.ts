import React from 'react';
import type { SharedElementContextType } from './types';
declare type Props = {
    children: React.ReactElement;
    pathname: string;
};
export declare const SharedElementContext: React.Context<SharedElementContextType>;
export default function ShareElementContextProvider({ children, pathname }: Props): JSX.Element;
export {};

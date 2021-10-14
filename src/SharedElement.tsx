import React, { useEffect, useRef } from 'react';
import useSharedElementContext from './useSharedElementContext';

import './SharedElement.css';

type Props = {
  children: React.ReactElement;
  id: string;
  pathname?: string;
};

export default function SharedElement({ children, id, pathname }: Props) {
  const { mountSharedElement } = useSharedElementContext();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;

    if (!node) return;

    const sharedElement = {
      ref: node,
      id,
    };

    mountSharedElement(sharedElement, pathname);
  }, [id, mountSharedElement, ref, pathname]);

  return <div ref={ref}>{children}</div>;
}

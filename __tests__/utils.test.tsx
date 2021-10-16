/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';

import '@testing-library/jest-dom';

import { getKeyFrames, getNodeForTransition } from '../src/utils';

const initial = {
  x: 0,
  y: 0,
  bottom: 100,
  height: 100,
  left: 0,
  right: 100,
  top: 0,
  width: 100,
} as DOMRect;

const final = {
  x: 100,
  y: 100,
  bottom: 150,
  height: 50,
  left: 50,
  right: 150,
  top: 50,
  width: 50,
} as DOMRect;

describe('getKeyFrames', () => {
  it('returns expected key frames', () => {
    expect(getKeyFrames(initial, final)).toEqual([
      { transform: 'matrix(2, 0, 0, 2, -50, -50)' },
      { transform: 'none' },
    ]);
  });
});

describe('getNodeForTransition', () => {
  let node: HTMLDivElement;

  beforeEach(() => {
    const { getByTestId } = render(<div data-testid="test" />);
    node = getByTestId('test') as HTMLDivElement;
  });

  it('returns a copy of the node and does not mutate the original', () => {
    expect(getNodeForTransition(node, final)).not.toEqual(node);
    expect(node.classList).not.toContain('SharedElement');
  });

  it('returns a node with the SharedElement class name', () => {
    expect(getNodeForTransition(node, final).classList).toContain('SharedElement');
  });

  it('returns a node styled as expected', () => {
    expect(getNodeForTransition(node, final).style).toEqual(
      expect.objectContaining({
        position: 'fixed',
        contain: 'strict',
        willChange: 'transform',
        animationFillMode: 'both',
        top: `${final.top}px`,
        left: `${final.left}px`,
        height: `${final.height}px`,
        width: `${final.width}px`,
        transformOrigin: 'top left',
      })
    );
  });
});

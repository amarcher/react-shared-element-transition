/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';

import '@testing-library/jest-dom';

import { getKeyframes, getNode } from '../src/utils';
import { DEFAULT_ANIMATION_OPTIONS } from '../src/constants';

const firstBoundingClientRect = {
  x: 0,
  y: 0,
  bottom: 100,
  height: 100,
  left: 0,
  right: 100,
  top: 0,
  width: 100,
} as DOMRect;

const lastBoundingClientRect = {
  x: 100,
  y: 100,
  bottom: 150,
  height: 50,
  left: 50,
  right: 150,
  top: 50,
  width: 50,
} as DOMRect;

describe('getKeyframes', () => {
  it('returns expected key frames', () => {
    expect(getKeyframes({ firstBoundingClientRect, lastBoundingClientRect })).toEqual([
      { transform: 'matrix(2, 0, 0, 2, -25, -25)' },
      { transform: 'none' },
    ]);
  });
});

describe('getNode', () => {
  let firstNode: HTMLDivElement;
  let lastNode: HTMLDivElement;

  beforeEach(() => {
    const { getByTestId } = render(
      <>
        <div data-testid="first" />
        <div data-testid="last" />
      </>
    );
    firstNode = getByTestId('first') as HTMLDivElement;
    lastNode = getByTestId('first') as HTMLDivElement;
  });

  it('returns a node with the SharedElement class name', () => {
    expect(
      getNode({
        firstBoundingClientRect,
        firstNode,
        lastBoundingClientRect,
        lastNode,
        animationOptions: DEFAULT_ANIMATION_OPTIONS,
      }).classList
    ).toContain('SharedElement');
  });

  it('returns a node styled as expected', () => {
    expect(
      getNode({
        firstBoundingClientRect,
        firstNode,
        lastBoundingClientRect,
        lastNode,
        animationOptions: DEFAULT_ANIMATION_OPTIONS,
      }).style
    ).toEqual(
      expect.objectContaining({
        position: 'fixed',
        contain: 'strict',
        willChange: 'transform',
        top: `${lastBoundingClientRect.top}px`,
        left: `${lastBoundingClientRect.left}px`,
        height: `${lastBoundingClientRect.height}px`,
        width: `${lastBoundingClientRect.width}px`,
        transformOrigin: 'center center',
      })
    );
  });
});

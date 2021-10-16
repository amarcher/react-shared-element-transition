/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';

import '@testing-library/jest-dom';

import SharedElement from '../src/SharedElement';
import { SharedElementContext } from '../src/SharedElementContextProvider';

describe('SharedElement', () => {
  const mountSharedElement = jest.fn();

  beforeEach(() => {
    mountSharedElement.mockReset();
  });

  it('renders children', () => {
    const { getByTestId } = render(
      <SharedElement id="thing-1" pathname="/">
        <div data-testid="shared-element-1" />
      </SharedElement>
    );

    expect(getByTestId('shared-element-1')).toBeInTheDocument();
  });

  it('calls mountSharedElement with node, id, animationOptions, and pathname', () => {
    const { getByTestId } = render(
      <SharedElementContext.Provider value={{ mountSharedElement, isTransitioning: false }}>
        <SharedElement id="thing-1" pathname="/" animationOptions={{ duration: 1000 }}>
          <div data-testid="shared-element-1" />
        </SharedElement>
      </SharedElementContext.Provider>
    );

    expect(mountSharedElement).toHaveBeenCalledTimes(1);
    expect(mountSharedElement).toHaveBeenCalledWith(
      {
        ref: getByTestId('shared-element-1').parentNode,
        id: 'thing-1',
        animationOptions: { duration: 1000 },
      },
      '/'
    );
  });
});

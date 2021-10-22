## react-shared-element-transition

React Shared Element Transition coordinates the transition of elements that are shared between multiple routes in a single page app. It uses the [Javascript Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) and the [F.L.I.P. technique](https://css-tricks.com/animating-layouts-with-the-flip-technique/) to execute the animations in a transparent layer that is rendered on top of your application using an [approach inspired by Prateek Bhatnagar](https://medium.com/@prateekbh/shared-elements-transitions-for-web-6fa9d31d4d6a). In keeping with the conventions of React, the API is simple and declarative (see usage below).

## Example

As seen on the [NFT website](https://normalfuckingthings.com):

![Sample](https://github.com/amarcher/react-shared-element-transition/blob/master/sample.gif?raw=true)

See [sample usage on the repo](https://github.com/amarcher/nft).

## Installation

Install the package using `yarn` or `npm`:

```bash
yarn add react-shared-element-transition
```

or

```bash
npm install --save react-shared-element-transition
```

## Usage

The API was built to be used with [React Router](https://github.com/remix-run/react-router), but does not depend upon it. It only needs to observe the current location (via a `pathname` attribute you provide it) and it assumes that incoming shared elements are mounted when the location changes.

First wrap your application in the `SharedElementContextProvider` and let it observe current location (through the `pathname` attribute you'll provide it). The `SharedElementContextProvider` will track of all of the mounted shared elements that may need to be transitioned and will transition them in response to a change in the `pathname` attribute if a second element with the same `id` mounts.

File: `App.tsx`

```tsx
import React from 'react';
import { useLocation } from 'react-router';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { SharedElementContextProvider } from 'react-shared-element-transition';

import Things from './Things';
import Main from './Main';
import NotFound from './NotFound';

function Routes() {
  const { pathname } = useLocation();

  return (
    <SharedElementContextProvider pathname={pathname}>
      <Switch>
        <Route exact path="/" component={Things} />
        <Route path="/things" component={Things} />
        <Route path="/thing/:id" component={Main} />
        <Route path="*" component={NotFound} />
      </Switch>
    </SharedElementContextProvider>
  );
}

export default function App() => {
  <BrowserRouter>
    <Routes />
  </BrowserRouter>
}
```

Next, wrap each element that should be transitioned with a `SharedElement` component that has two attributes: an `id` (which will be used to identify the partner element that renders on another page); and the `pathname` for the route the element is rendered on (this will be used to identify route changes). The `SharedElement` component registers the element with the provider as a candidate to be transitioned when the `pathname` changes. You may optionally provide an `animationOptions` attribute. This should be a partial [KeyframeAnimationOptions](https://css-tricks.com/css-animations-vs-web-animations-api/#recreating-an-animista-css-animation-with-waapi) object (note: only the `animationOptions` of the incoming shared element will be used) and they will override the defaults of `duration: 200ms`, `fill: 'forwards'`, `easing: 'ease-out'`).

File: `Things.tsx`

```tsx
<SharedElement id="thing-1" pathname="/things">
  <img height={50} width={50} src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg" />
</SharedElement>
```

Next you'll have your route components consume the `activePathname` and `isTransitioning` attibutes from the parent context using a `useSharedElementContext()` hook, and make them have `opacity: 0` while `isTransitioning` is `true` or while the `activePathname` does not equal the expected pathname. This allows the route to mount and all of its shared elements to be registered without becoming visible to the user.

File: `Main.tsx`

```tsx
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { SharedElement, useSharedElementContext } from 'react-shared-element-transition';

type Props = RouteComponentProps<{ id?: string }>;

export default function Main({ match, location: { pathname } }: RouteComponentProps<{ id?: string }>) {
  const { id } = match.params;
  const { isTransitioning, activePathname } = useSharedElementContext();

  const opacity = isTransitioning || activePathname !== pathname ? 0 : 1;

  return (
    <div style={{ opacity }}>
      <div>
        <SharedElement id={`thing-${id}`} pathname={pathname}>
          <img height={300} width={300} src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg" />
        </SharedElement>
      </div>
    </div>
  );
}
```

Once all of the shared element transitions are complete, the `isTransitioning` property provided by the `useSharedElementContext()` hook will change to `false` and the `activePathname` will be updated to match that of the incoming route. You will use these values in logic to change the `opacity` of the incoming route to `1`. Currently you must do so within `200ms`, because after that time the transitioned elements will be removed from the temporary layer into which they have been mounted

You'll now see the exiting element scale and translate to "become" the entering element when the route changes.

## Advanced Usage

The above transform is great for shared elements with identical appearances (e.g. two images with the same `src`, or two divs with the same `background-color`) that need only be scaled and tranlated into place. You may find that you want to make an element "morph" into another with a dissimilar appearance or take an indirect path before landing in the placement of the entering element.

`react-shared-element-transition` helps you accomplish both of these goals by accepting `getNode` and `getKeyframes` callbacks as attributes on the `SharedElement` component that wraps your entering shared element. If provided, these callbacks will override default logic. The `getNode` function should return a node that has the appearance of the exiting element, but sized and positioned in the place of the entering element. The `getKeyframes` function should to return keyframes that transform the element at `0%` progress into position of the exiting element and remove that transform at `100%` progress (following the [F.L.I.P. technique](https://css-tricks.com/animating-layouts-with-the-flip-technique/)). The callbacks can each expect to receive an object as an argument to help in the calculation.

In the case of `getNode` the object passed to the callback as an argument has the following properties:

```ts
export interface GetNodeInput {
  firstNode: HTMLDivElement;
  lastNode: HTMLDivElement;
  firstBoundingClientRect: DOMRect;
  lastBoundingClientRect: DOMRect;
  animationOptions: KeyframeAnimationOptions;
}
```

In the case of `getKeyframes` the object passed to the callback has the following properties:

```ts
export interface GetKeyframesInput {
  firstBoundingClientRect: DOMRect;
  lastBoundingClientRect: DOMRect;
}
```

For your convenience, `react-shared-element-transition` exports several "built in" functions for `getNode` and `getKeyframes` to achieve some common types of transitions:

### Crossfading

![Sample](https://github.com/amarcher/react-shared-element-transition/blob/master/crossfade.gif?raw=true)

The `getCrossfadeNode` function can be used to ramp the `opacity` of the exiting node from `1` -> `0` and that of the entering node from `0` -> `1`) to give the appearnace that the exiting element "fades" into the entering one.

```tsx
import { SharedElement, getCrossfadeNode } from 'react-shared-element-transition';

<SharedElement id="thing-2" pathname="things" getNode={getCrossfadeNode} animationOptions={{ duration: 600 }}>
  <img height={50} width={50} src="./candle.png" />
</SharedElement>;
```

### Flipping

![Sample](https://github.com/amarcher/react-shared-element-transition/blob/master/flip.gif?raw=true)

The `getFlipNode` and `getFlipKeyframes` functions can be used in combination to adhere the entering node to the back-face of the exiting node and rotate the node around the Y-axis so that the exiting element appears to "flip" to reveal the entering node that was on its opposite side.

```tsx
import { SharedElement, getFlipNode, getFlipKeyframes } from 'react-shared-element-transition';

<SharedElement
  id="thing-2"
  pathname="things"
  getNode={getFlipNode}
  getKeyframes={getFlipKeyframes}
  animationOptions={{ duration: 600 }}
>
  <img height={50} width={50} src="./candle.png" />
</SharedElement>;
```

## Limitations

In the latest version (3.0.0) of this package there are known limitations which may be addressed in future versions:

1. After being transitioned, shared elements will persist on the page for exactly `200ms` before it is removed. You should have your incoming route's `opacity` transition to `1` within `200ms`.

## react-shared-element-transition

React Shared Element Transition coordinates the transition of elements that are shared between multiple routes in a single page app. It uses the [Javascript Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) to execute the animations in a layer that is rendered over the routes in your application using an [approach inspired by Prateek Bhatnagar](https://medium.com/@prateekbh/shared-elements-transitions-for-web-6fa9d31d4d6a). In keeping with the conventions of React, the API is simple and declarative (see usage below).

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

The API is meant to be simple to use with [React Router](https://github.com/remix-run/react-router). First wrap your routes in the `SharedElementContextProvider`. It will keep track of all of the mounted shared elements that will need to be transitioned. It will also transition them in response to a change to the provided `pathname`.

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

Next, wrap each element that should be transitioned with a `SharedElement` component that has two attributes: an `id` (which will be used to identify the partner element that renders on another page); and the `pathname` for the route the element is rendered on (this will be used to identify route changes). The `SharedElement` component registers the element with the provider as a candidate to be transitioned when the `pathname` changes. You may optionally provide an `animationOptions` attribute. This should be a partial [KeyframeAnimationOptions](https://css-tricks.com/css-animations-vs-web-animations-api/#recreating-an-animista-css-animation-with-waapi) object (note: only the `animationOptions` of the incoming shared element will be used) and it will override the defaults of `duration: 200ms`, `fill: 'forwards'`, `easing: 'ease-out'`).

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
          <img height={300} width={300} "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg" />
        </SharedElement>
      </div>
    </div>
  );
}
```

Once all of the shared element transitions are complete, the `isTransitioning` property provided by the `useSharedElementContext()` hook will change to `false` and the `activePathname` will be updated to match that of the incoming route. You will use these values in logic to change the `opacity` of the incoming route to `1`. Currently you must do so within `200ms`, because after that time the transitioned elements will be removed from the temporary layer into which they have been mounted.

That's it! You'll now see the element transition when the route changes.

## Limitations

In the latest version (2.0.0) of this package there are known limitations which may be addressed in future versions:

1. It is assumed that shared elements with the same ids are _identical_ in appearance (e.g. images with same `src` or divs with the same background color). No cross-fading from one element to another is performed. Instead, the incoming element is simply sized and positioned to fit the bounding box of the exiting element, then transitioned to the final position by removing the transform (using the [F.L.I.P. technique](https://css-tricks.com/animating-layouts-with-the-flip-technique/)).
2. After being transitioned, shared elements will persist on the page for exactly `200ms` before it is removed. You should have your incoming route's `opacity` transition to `1` within `200ms`.

## react-shared-element-transition

React Shared Element Transition helps coordinate and execute animations of elements that appear on multiple pages in a single page app.

## Example

As seen on the [NFT website](https://normalfuckingthings.com):

![Sample](https://github.com/amarcher/react-shared-element-transition/blob/master/sample.gif?raw=true)

See [sample usage on repo](https://github.com/amarcher/nft).

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

The API is meant to be simple to use with [React Router](https://github.com/remix-run/react-router). First wrap your routes in the `SharedElementContextProvider`. It will keep track of all of the mounted shared elements that will need to be transitioned. It will also transition them in response to a route change.

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

Next, wrap each element that should be transitioned with a `SharedElement` component that has two attributes: an `id` (which will be used to identify the partner element that renders on another page); and the `pathname` for the route the element is rendered on (this will be used to identify route changes). The `SharedElement` component registers the element with the provider as a candidate to be transitioned when the path changes.

File: `Things.tsx`

```tsx
<SharedElement id="thing-1" pathname={'/things'}>
  <img
    height={50}
    width={50}
    src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg"
  />
</SharedElement>
```

Next you'll have your route components consume the `activePathname` and `isTransitioning` attibutes from the parent context using a `useSharedElementContext()` hook, and make them have `opacity: 0` while `isTransitioning` is true or while the `activePathname` does not equal their pathname. This allows the route to mount and all of its shared elements to be registered without the route becoming visible to the user.

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

That's it! You'll now see the element transition when the route changes.

## Limitations

In the initial version of this package there are a few limitations:

1. Page background is assumed to be white.
2. Transition assumes both elements sharing an id are identical (e.g. images with same `src`) and simply transforms the incoming element to fit the bounding box of the exiting element, then transitions it to the final position by removing the transform (using the [F.L.I.P. technique]()).
3. Duration not customizable (yet) its value is 200ms.

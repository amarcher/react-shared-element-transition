import SharedElement from './src/SharedElement';
import SharedElementContextProvider, {
  SharedElementContext,
} from './src/SharedElementContextProvider';
import type {
  MountSharedElementInput as MountSharedElementInputType,
  SharedElement as SharedElementType,
  SharedElementToTransition as SharedElementToTransitionType,
} from './src/SharedElementContextProvider';
import useSharedElementContext from './src/useSharedElementContext';

export default {
  SharedElement,
  SharedElementContext,
  SharedElementContextProvider,
  useSharedElementContext,
};

export {
  MountSharedElementInputType,
  SharedElementType,
  SharedElementToTransitionType,
};

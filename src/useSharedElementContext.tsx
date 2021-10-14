import { useContext } from 'react';
import { SharedElementContext } from './SharedElementContextProvider';

export default function useSharedElementContext() {
  return useContext(SharedElementContext);
}

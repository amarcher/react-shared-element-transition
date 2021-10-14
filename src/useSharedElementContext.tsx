import { useContext } from 'react';
import { SharedElementContext } from '../components/SharedElementContextProvider';

export default function useSharedElementContext() {
  return useContext(SharedElementContext);
}

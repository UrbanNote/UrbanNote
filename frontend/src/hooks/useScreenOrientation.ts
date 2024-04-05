import { useMediaQuery } from 'react-responsive';

export type Orientation = 'portrait' | 'landscape';

export function useScreenOrientation(orientation: Orientation) {
  return useMediaQuery({ query: `(orientation: ${orientation})` });
}

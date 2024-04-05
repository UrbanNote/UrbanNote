import { useMediaQuery } from 'react-responsive';

export function useIsTouchscreen() {
  return !useMediaQuery({ query: '(hover: none)' });
}

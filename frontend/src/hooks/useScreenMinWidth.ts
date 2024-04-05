import { useMediaQuery } from 'react-responsive';

export const BREAKPOINTS = {
  xs: 400,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

export function useScreenMinWidth(breakpoint: Breakpoint) {
  return useMediaQuery({ query: `(min-width: ${BREAKPOINTS[breakpoint]}px)` });
}

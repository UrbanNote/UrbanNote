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

export function useScreenMinHeight(breakpoint: Breakpoint) {
  return useMediaQuery({ query: `(min-height: ${BREAKPOINTS[breakpoint]}px)` });
}

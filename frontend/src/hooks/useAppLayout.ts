import { useScreenMinWidth } from './useScreenMinWidth';
import { useScreenOrientation } from './useScreenOrientation';

type Layout = 'horizontal' | 'vertical';

export function useAppLayout(layout: Layout) {
  const isAboveMdBreakpoint = useScreenMinWidth('md');
  const isLandscape = useScreenOrientation('landscape');

  if (layout === 'horizontal') {
    return isAboveMdBreakpoint && isLandscape;
  }

  return !isAboveMdBreakpoint || !isLandscape;
}

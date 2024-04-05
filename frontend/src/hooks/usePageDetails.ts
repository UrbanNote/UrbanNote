import { useEffect } from 'react';

import { useAppDispatch } from '$store';
import type { PageState } from '$store/pageStore';
import { setPageDetails } from '$store/pageStore';

export function usePageDetails(state: PageState) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    document.title = state.title ? `${state.title} | UrbanNote` : 'UrbanNote';
    dispatch(setPageDetails(state));
  }, [dispatch, state, state.title]);
}

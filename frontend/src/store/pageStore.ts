import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type PageState = {
  title?: string;
  titleShort?: string;
  background?: string;
  backLink?: string;
};

const initialState: PageState = {
  title: undefined,
  titleShort: undefined,
  background: undefined,
  backLink: undefined,
};

export const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPageDetails: (state, action: PayloadAction<PageState>) => {
      state.title = action.payload.title;
      state.titleShort = action.payload.titleShort;
      state.background = action.payload.background;
      state.backLink = action.payload.backLink;
    },
  },
});

export const { setPageDetails } = pageSlice.actions;

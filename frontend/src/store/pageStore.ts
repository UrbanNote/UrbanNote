import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { TrainingVideos } from '$components/TrainingVideo';

export type PageState = {
  title?: string;
  titleShort?: string;
  background?: string;
  backLink?: string;
  trainingVideo?: TrainingVideos;
};

const initialState: PageState = {
  title: undefined,
  titleShort: undefined,
  background: undefined,
  backLink: undefined,
  trainingVideo: undefined,
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
      state.trainingVideo = action.payload.trainingVideo;
    },
  },
});

export const { setPageDetails } = pageSlice.actions;

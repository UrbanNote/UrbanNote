import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

import { alertSlice } from './alertStore';
import { pageSlice } from './pageStore';
import { userSlice } from './userStore';

export const store = configureStore({
  reducer: {
    alerts: alertSlice.reducer,
    page: pageSlice.reducer,
    user: userSlice.reducer,
  },
  devTools: !import.meta.env.PROD,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

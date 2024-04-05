import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type AlertType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

export type Alert = {
  id: string;
  type: AlertType;
  message: string;
};

export type AlertState = {
  alerts: Alert[];
};

const initialState: AlertState = {
  alerts: [],
};

export const alertSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    addAlert: {
      reducer(state, action: PayloadAction<Alert>) {
        state.alerts.push(action.payload);
      },
      prepare(message: string, type: AlertType) {
        const id: string = nanoid();
        return { payload: { id, type, message } };
      },
    },
    removeAlert(state, action: PayloadAction<string>) {
      state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
    },
  },
});

export const { addAlert, removeAlert } = alertSlice.actions;

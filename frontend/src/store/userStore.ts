import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type UserProfileState = {
  email: string;
  firstName: string;
  lastName: string;
  language: string;
  chosenName?: string;
  pictureId?: string;
};

export type UserRolesState = {
  admin: boolean;
  expenseManagement: boolean;
  resourceManagement: boolean;
  userManagement: boolean;
};

export type AuthUserState = {
  id: string | null;
  email: string | null;
  emailVerified: boolean | null;
};

export type UserState = AuthUserState & {
  profile: UserProfileState | null;
  roles: UserRolesState | null;
};

const initialState: UserState = {
  id: null,
  email: null,
  emailVerified: null,
  profile: null,
  roles: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: () => initialState,
    clearUserProfile: state => {
      return { ...state, profile: null };
    },
    clearUserRoles: state => {
      return { ...state, roles: null };
    },
    setUser: (state, action: PayloadAction<AuthUserState>) => {
      return {
        ...state,
        ...{
          id: action.payload.id,
          email: action.payload.email ?? null,
          emailVerified: action.payload.emailVerified,
        },
      };
    },
    setUserProfile: (state, action: PayloadAction<UserProfileState>) => {
      return { ...state, profile: action.payload };
    },
    setUserRoles: (state, action: PayloadAction<UserRolesState>) => {
      return { ...state, roles: action.payload };
    },
  },
});

export const { clearUser, clearUserProfile, clearUserRoles, setUser, setUserProfile, setUserRoles } = userSlice.actions;

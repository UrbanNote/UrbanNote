import { httpsCallable } from '@firebase/functions';
import { sendSignInLinkToEmail, signInWithEmailLink } from 'firebase/auth';

import { auth, functions } from '$firebase';
import type { UpdateUserDetails } from '$pages/Users/Users';

export type CreateUserData = {
  firstName: string;
  lastName: string;
  email: string;
  emailVerified?: boolean;
  language: string;
  chosenName?: string;
  pictureId?: string;
  disabled: boolean;
  admin: boolean;
  expenseManagement: boolean;
  resourceManagement: boolean;
  userManagement: boolean;
};

export type GetUsersData = {
  ipp: number;
  pageToken?: string;
  disabledFilter?: boolean;
  searchBarFilter?: string;
};

export type GetUsersResponse = {
  users: {
    id: string;
    email: string;
    emailVerified: boolean;
    disabled: boolean;
    profile: {
      firstName: string;
      lastName: string;
      language: string;
      chosenName?: string;
      pictureId?: string;
    } | null;
    roles: {
      admin: boolean;
      expenseManagement: boolean;
      resourceManagement: boolean;
      userManagement: boolean;
    } | null;
  }[];
  pageToken?: string;
};

export type GetAuthUsersResponse = {
  users: AuthUser[];
};

export type AuthUser = {
  uid: string;
  disabled: boolean;
  displayName: string;
  email: string;
  emailVerified: boolean;
};

export type GetUserNamesResponse = {
  id: string;
  name: string;
}[];

export type DisableUserData = {
  id: string;
};

export type EnableUserData = {
  id: string;
};

export async function getUsers(data: GetUsersData): Promise<GetUsersResponse> {
  const request = httpsCallable<GetUsersData, GetUsersResponse>(functions, 'auth-getUsers');
  const response = await request(data);
  return response.data;
}

export async function getUserNames(): Promise<GetUserNamesResponse> {
  const request = httpsCallable<object, GetUserNamesResponse>(functions, 'auth-getUserNames');
  const response = await request({});
  return response.data;
}

export async function getAuthUsers(data: GetUsersData): Promise<GetAuthUsersResponse> {
  const request = httpsCallable<GetUsersData, GetAuthUsersResponse>(functions, 'auth-getAuthUsers');
  const response = await request(data);
  return response.data;
}

export async function createUser(input: CreateUserData) {
  const request = httpsCallable<CreateUserData, Promise<void>>(functions, 'auth-createUser');
  await request(input);
}

export async function updateUser(input: UpdateUserDetails) {
  const request = httpsCallable<UpdateUserDetails, Promise<void>>(functions, 'auth-updateUser');
  await request(input);
}

export async function disableUser(input: DisableUserData) {
  const request = httpsCallable<DisableUserData, Promise<void>>(functions, 'auth-disableUser');
  await request(input);
}

export async function enableUser(input: EnableUserData) {
  const request = httpsCallable<EnableUserData, Promise<void>>(functions, 'auth-enableUser');
  await request(input);
}

export async function sendSignInLink(email: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const url = new URL(import.meta.env.VITE_APP_PUBLIC_URL!);
  url.searchParams.set('email', email);

  await sendSignInLinkToEmail(auth, email, {
    url: url.toString(),
    handleCodeInApp: true,
  });

  localStorage.setItem('emailForSignIn', email);
}

export async function signInWithLink(email: string, url: string) {
  await signInWithEmailLink(auth, email, url);
  localStorage.removeItem('emailForSignIn');
}

export async function signOut() {
  await auth.signOut();
}

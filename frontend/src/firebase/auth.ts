import { httpsCallable } from '@firebase/functions';
import { sendSignInLinkToEmail, signInWithEmailLink } from 'firebase/auth';

import { auth, functions } from '$firebase';

export type CreateUserData = {
  firstName: string;
  lastName: string;
  email: string;
  language: string;
  chosenName?: string;
  pictureId?: string;
  admin?: boolean;
  expenseManagement?: boolean;
  resourceManagement?: boolean;
  userManagement?: boolean;
};

export type GetUsersData = {
  ipp: number;
  pageToken?: string;
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

export async function getUsers(data: GetUsersData): Promise<GetUsersResponse> {
  const request = httpsCallable<GetUsersData, GetUsersResponse>(functions, 'auth-getUsers');
  const response = await request(data);
  return response.data;
}

export async function createUser(input: CreateUserData) {
  const request = httpsCallable<CreateUserData, Promise<void>>(functions, 'auth-createUser');
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
}

export async function signOut() {
  await auth.signOut();
}

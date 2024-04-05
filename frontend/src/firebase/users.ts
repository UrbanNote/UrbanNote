import { httpsCallable } from 'firebase/functions';

import { functions } from '$firebase';

export type CreateUserProfileInput = {
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  language: string; // format fr-CA ou en-CA
  chosenName?: string;
  pictureId?: string;
};

export type CreateUserRolesData = {
  userId?: string;
  admin?: boolean;
  expenseManagement?: boolean;
  resourceManagement?: boolean;
  userManagement?: boolean;
};

export type UpdateUserProfileData = {
  userId?: string;
  firstName: string;
  lastName: string;
  language: string;
  chosenName?: string;
  pictureId?: string;
};

export async function createUserProfile(input: CreateUserProfileInput) {
  const request = httpsCallable<CreateUserProfileInput, Promise<void>>(functions, 'users-createUserProfile');
  await request(input);
}

export async function createUserRoles(input: CreateUserRolesData) {
  const request = httpsCallable<CreateUserRolesData, Promise<void>>(functions, 'users-createUserRoles');
  await request(input);
}

export async function updateUserProfile(input: UpdateUserProfileData) {
  const request = httpsCallable<UpdateUserProfileData, Promise<void>>(functions, 'users-updateUserProfile');
  await request(input);
}

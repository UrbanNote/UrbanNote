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

export async function createUserProfile(input: CreateUserProfileInput) {
  const request = httpsCallable<CreateUserProfileInput, Promise<void>>(functions, 'users-createUserProfile');
  await request(input);
  // si j'avais du data en retour, je pourrais le récupérer ici
  // const result = await request(input);
  // return result.data;
}

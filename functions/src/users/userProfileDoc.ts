import type { BaseEntity } from '../baseEntity';

/** User profile type. Each user should have a profile. The profile id should correspond to the user's id in Firebase Auth. */
export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  chosenName?: string;
  email: string;
  pictureId?: string;
  language: string;
};

/**
 * User profile document type. Each user should have a profile document. The document id should correspond to the user's id in Firebase Auth.
 */
export type UserProfileDoc = BaseEntity & UserProfile;

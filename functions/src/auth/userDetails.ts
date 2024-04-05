import { UserRecord } from 'firebase-admin/auth';
import { UserProfile } from 'src/users/userProfileDoc';
import { UserRoles } from 'src/users/userRolesDoc';

/** Contains all the useful User's details for queried users by user managers.*/
export type UserDetails = Pick<UserRecord, 'disabled' | 'email' | 'emailVerified'> & {
  id: string;
  profile: Omit<UserProfile, 'id' | 'email'> | null;
  roles: Omit<UserRoles, 'id'> | null;
};

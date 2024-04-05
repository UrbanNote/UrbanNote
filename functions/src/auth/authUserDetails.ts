/** Contains all the useful AuthUser's details for queried users by user managers.*/
export type AuthUserDetails = {
  uid: string;
  disabled: boolean;
  displayName?: string;
  email?: string;
  emailVerified: boolean;
};

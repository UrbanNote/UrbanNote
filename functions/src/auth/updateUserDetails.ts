/** Contains all the useful User's details for user update.*/
export type UpdateUserDetails = {
  userId: string;
  auth: {
    disabled: boolean;
    displayName: string;
    email: string;
    emailVerified?: boolean;
  };
  userProfile: {
    firstName: string;
    lastName: string;
    language: string;
    chosenName?: string;
    pictureId?: string;
  };
  userRoles: {
    admin: boolean;
    expenseManagement: boolean;
    resourceManagement: boolean;
    userManagement: boolean;
  };
};

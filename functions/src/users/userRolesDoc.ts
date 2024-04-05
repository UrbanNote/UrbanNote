import { BaseEntity } from '../baseEntity';

/**
 * User roles type. Each user should have a roles document. The document id should correspond to the user's id in Firebase Auth.
 */
export type UserRoles = {
  id: string;
  admin: boolean;
  expenseManagement: boolean;
  resourceManagement: boolean;
  userManagement: boolean;
};

/**
 * User roles document type. Each user should have a roles document. The document id should correspond to the user's id in Firebase Auth.
 */
export type UserRolesDoc = BaseEntity & UserRoles;

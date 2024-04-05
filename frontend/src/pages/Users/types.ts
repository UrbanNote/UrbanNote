export type CreateUserFormData = {
  email: string;
  firstName: string;
  lastName: string;
  language: string;
  chosenName?: string;
  admin: boolean;
  expenseManagement: boolean;
  resourceManagement: boolean;
  userManagement: boolean;
};

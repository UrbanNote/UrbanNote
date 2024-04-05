import type { PropsWithChildren } from 'react';

export type ProtectedRouteProps = PropsWithChildren<{
  admin?: boolean;
  expenseManagement?: boolean;
  resourceManagement?: boolean;
  userManagement?: boolean;
}>;

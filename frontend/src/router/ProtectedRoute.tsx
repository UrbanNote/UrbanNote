import { useEffect } from 'react';

import { useNavigate } from 'react-router';

import { useAppSelector } from '$store';

import type { ProtectedRouteProps } from './types';

function ProtectedRoute({
  children,
  admin,
  expenseManagement,
  resourceManagement,
  userManagement,
}: ProtectedRouteProps) {
  const userRoles = useAppSelector(state => state.user.roles);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userRoles || userRoles.admin) return;

    if (
      admin ||
      (expenseManagement && !userRoles.expenseManagement) ||
      (resourceManagement && !userRoles.resourceManagement) ||
      (userManagement && !userRoles.userManagement)
    )
      return navigate('/');
  }, [
    admin,
    expenseManagement,
    resourceManagement,
    userManagement,
    userRoles?.admin,
    userRoles?.expenseManagement,
    userRoles?.resourceManagement,
    userRoles?.userManagement,
    navigate,
    userRoles,
  ]);

  // Hide component until user roles are fetched
  if (userRoles === null) return null;

  return children;
}

export default ProtectedRoute;

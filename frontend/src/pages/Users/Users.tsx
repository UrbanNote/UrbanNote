import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { TrainingVideos } from '$components/TrainingVideo';
import type { AuthUser, GetAuthUsersResponse } from '$firebase/auth';
import { getAuthUsers } from '$firebase/auth';
import { usePageDetails } from '$hooks';
import './Users.css';

import { CreateOrEditSlideOut } from './CreateOrEdit/CreateOrEditSlideOut';
import { Filters } from './Filters';
import { Header } from './Header';
import { UsersTable } from './UsersTable';

export type UserDetails = {
  id: string;
  email: string;
  emailVerified?: boolean;
  disabled: boolean;
  profile: {
    firstName?: string;
    lastName?: string;
    language?: string;
    chosenName?: string;
    pictureId?: string;
  } | null;
  roles: {
    admin: boolean;
    expenseManagement: boolean;
    resourceManagement: boolean;
    userManagement: boolean;
  } | null;
};

export type AuthUserDetails = {
  uid: string;
  disabled: boolean;
  displayName: string;
  email: string;
  emailVerified?: boolean;
};

export type UpdateUserDetails = {
  userId: string;
  auth: {
    disabled: boolean;
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

export function Users() {
  const { t } = useTranslation('users');
  usePageDetails({ title: t('title'), trainingVideo: TrainingVideos.USERS_MANAGEMENT });
  const [authUsers, setAuthUsers] = useState<GetAuthUsersResponse>({ users: [] });
  const [isUserTableFiltered, setIsUserTableFiltered] = useState<boolean>(false);
  // State pour le slide-out
  const [show, setShow] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<AuthUser>();

  const fetchUsers = async (disabledFilter?: boolean, searchBarFilter?: string) => {
    const newAuthUsers = await getAuthUsers({
      ipp: 10,
      disabledFilter: disabledFilter,
      searchBarFilter: searchBarFilter,
    });
    setAuthUsers(newAuthUsers);
  };

  const updateUser = (userId: string, disabled: boolean, displayName: string) => {
    const user = authUsers.users.find(u => u.uid === userId);
    if (!user) {
      return;
    }

    user.disabled = disabled;
    user.displayName = displayName;
  };

  const handleUserTableFilters = (isFiltered: boolean) => {
    setIsUserTableFiltered(isFiltered);
  };

  useEffect(() => {
    fetchUsers();
  }, [setAuthUsers]);

  return (
    <div className="component">
      <Header setUserToUpdate={setUserToUpdate} setShow={setShow} />

      <CreateOrEditSlideOut
        authUser={userToUpdate}
        showSlideOut={show}
        setShowSlideOut={setShow}
        onCreate={fetchUsers}
        onUpdate={updateUser}
      />

      <Filters
        onApplyFilters={fetchUsers}
        setIsFilterApplied={handleUserTableFilters}
        isFilterApplied={isUserTableFiltered}
      />
      <UsersTable
        authUsers={authUsers}
        isFiltered={isUserTableFiltered}
        setUserToUpdate={setUserToUpdate}
        setShow={setShow}
        onUpdate={fetchUsers}
      />
    </div>
  );
}

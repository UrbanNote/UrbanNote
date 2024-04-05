import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import type { GetUsersResponse } from '$firebase/auth';
import { getAuthUsers, getUsers } from '$firebase/auth';
import { usePageDetails } from '$hooks';
import './Users.css';

import type { GetAuthUsersResponse } from './CreateOrEdit/CreateOrEditSlideOut';
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
    admin?: boolean;
    expenseManagement?: boolean;
    resourceManagement?: boolean;
    userManagement?: boolean;
  } | null;
};

export type AuthUserDetails = {
  uid: string;
  disabled: boolean;
  displayName: string;
  email: string;
  emailVerified?: boolean;
};

export function Users() {
  const { t } = useTranslation('users');
  usePageDetails({ title: t('title') });
  const [users, setUsers] = useState<GetUsersResponse>({ users: [], pageToken: undefined });
  const [authUsers, setAuthUsers] = useState<GetAuthUsersResponse>({ users: [] });
  const [isUserTableFiltered, setIsUserTableFiltered] = useState<boolean>(false);
  // State pour le slide-out
  const [show, setShow] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<UserDetails>();

  const fetchUsers = async (disabledFilter?: boolean, searchBarFilter?: string) => {
    const newUsers = await getUsers({ ipp: 10 });
    const newAuthUsers = await getAuthUsers({
      ipp: 10,
      disabledFilter: disabledFilter,
      searchBarFilter: searchBarFilter,
    });
    setUsers(newUsers);
    setAuthUsers(newAuthUsers);
  };

  const handleUserTableFilters = (isFiltered: boolean) => {
    setIsUserTableFiltered(isFiltered);
  };

  useEffect(() => {
    fetchUsers();
  }, [setUsers, setAuthUsers]);

  return (
    <div className="component">
      <Header setUserToUpdate={setUserToUpdate} setShow={setShow} />

      <CreateOrEditSlideOut
        userRecord={userToUpdate}
        showSlideOut={show}
        setShowSlideOut={setShow}
        onCreate={fetchUsers}
        onUpdate={fetchUsers}
      />

      <Filters
        onApplyFilters={fetchUsers}
        setIsFilterApplied={handleUserTableFilters}
        isFilterApplied={isUserTableFiltered}
      />
      <UsersTable
        authUsers={authUsers}
        isFiltered={isUserTableFiltered}
        users={users}
        setUserToUpdate={setUserToUpdate}
        setShow={setShow}
        onUpdate={fetchUsers}
      />
    </div>
  );
}

import type { PropsWithChildren } from 'react';

import { Dropdown, Spinner, Table } from 'react-bootstrap';
import { ThreeDots, Pencil, ToggleOff, ToggleOn } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';

import { Scrollbar } from '$components';
import type { GetAuthUsersResponse, GetUsersResponse } from '$firebase/auth';
import { disableUser, enableUser } from '$firebase/auth';
import { useAlerts } from '$hooks';

import { Status } from './enum/Status';
import type { AuthUserDetails, UserDetails } from './Users';

export type UsersTableProps = PropsWithChildren<{
  authUsers: GetAuthUsersResponse;
  isFiltered: boolean;
  users: GetUsersResponse;
  setUserToUpdate: (user: UserDetails) => void;
  setShow: (show: boolean) => void;
  onUpdate: () => void;
}>;

export function UsersTable({ authUsers, isFiltered, users, setUserToUpdate, setShow, onUpdate }: UsersTableProps) {
  const { t } = useTranslation('users');
  const alert = useAlerts();

  if (authUsers.users.length === 0 && !isFiltered) {
    return <Spinner />;
  }

  const handleUpdate = (authUserDetails: AuthUserDetails) => {
    for (const user of users.users) {
      if (user.id === authUserDetails.uid) {
        const userToUpdate: UserDetails = {
          id: authUserDetails.uid,
          email: authUserDetails.email,
          emailVerified: authUserDetails.emailVerified,
          disabled: authUserDetails.disabled,
          profile: {
            firstName: user.profile?.firstName,
            lastName: user.profile?.lastName,
            language: user.profile?.language,
            chosenName: user.profile?.chosenName,
            pictureId: user.profile?.pictureId,
          },
          roles: {
            admin: user.roles?.admin,
            expenseManagement: user.roles?.expenseManagement,
            resourceManagement: user.roles?.resourceManagement,
            userManagement: user.roles?.userManagement,
          },
        };
        setUserToUpdate(userToUpdate);
        setShow(true);
        break;
      }
    }
  };

  const handleStatus = async (authUserDetails: AuthUserDetails, status: Status) => {
    if (status === Status.DISABLE) {
      await disableUser({ id: authUserDetails.uid });
    } else {
      await enableUser({ id: authUserDetails.uid });
    }

    alert(t(`editUser.statusChangedSuccess`), 'success');
    onUpdate();
  };

  return (
    <div className="mb-3">
      {authUsers.users.length > 0 && (
        <Scrollbar className="w-100">
          <div className="w-100">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>{t('status.status')}</th>
                  <th className="email-column">{t('profile.email')}</th>
                  <th className="first-name-column">{t('table.displayName')}</th>
                  <th className="three-dots-column"></th>
                </tr>
              </thead>
              <tbody>
                {authUsers.users.map(authUserDetails => (
                  <tr key={authUserDetails.uid}>
                    <td>{authUserDetails.disabled ? `${t('status.disabled')}` : `${t('status.enabled')}`}</td>
                    <td>{authUserDetails.email}</td>
                    <td>{authUserDetails.displayName}</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="transparent" id="dots-dropdown">
                          <ThreeDots tabIndex={0}></ThreeDots>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleUpdate(authUserDetails)}>
                            <Pencil className="dots-dropdown"></Pencil>
                            {t('dots.update')}
                          </Dropdown.Item>
                          <Dropdown.Item
                            hidden={authUserDetails.disabled}
                            onClick={() => handleStatus(authUserDetails, Status.DISABLE)}>
                            <ToggleOff className="dots-dropdown"></ToggleOff>
                            {t('dots.disable')}
                          </Dropdown.Item>
                          <Dropdown.Item
                            hidden={!authUserDetails.disabled}
                            onClick={() => handleStatus(authUserDetails, Status.ENABLE)}>
                            <ToggleOn className="dots-dropdown"></ToggleOn>
                            {t('dots.enable')}
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Scrollbar>
      )}
      {authUsers.users.length === 0 && isFiltered && <p>{t('noUsersFilter')}</p>}
    </div>
  );
}

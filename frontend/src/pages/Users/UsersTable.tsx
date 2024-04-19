import type { PropsWithChildren } from 'react';

import { Dropdown, Spinner, Table } from 'react-bootstrap';
import { ThreeDots, Pencil, ToggleOff, ToggleOn } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';

import { Scrollbar } from '$components';
import type { AuthUser, GetAuthUsersResponse } from '$firebase/auth';
import { disableUser, enableUser } from '$firebase/auth';
import { isFirebaseError } from '$helpers';
import { useAlerts } from '$hooks';

import { Status } from './enum/Status';
import type { AuthUserDetails } from './Users';

export type UsersTableProps = PropsWithChildren<{
  authUsers: GetAuthUsersResponse;
  isFiltered: boolean;
  setUserToUpdate: (user: AuthUser) => void;
  setShow: (show: boolean) => void;
  onUpdate: () => void;
}>;

export function UsersTable({ authUsers, isFiltered, setUserToUpdate, setShow, onUpdate }: UsersTableProps) {
  const { t } = useTranslation('users');
  const alert = useAlerts();

  if (authUsers.users.length === 0 && !isFiltered) {
    return <Spinner />;
  }

  const handleUpdate = (authUserDetails: AuthUserDetails) => {
    for (const user of authUsers.users) {
      if (user.uid === authUserDetails.uid) {
        setUserToUpdate(user);
        setShow(true);
        break;
      }
    }
  };

  const handleStatusChange = async (authUserDetails: AuthUserDetails, status: Status) => {
    try {
      if (status === Status.DISABLE) {
        await disableUser({ id: authUserDetails.uid });
      } else {
        await enableUser({ id: authUserDetails.uid });
      }

      alert(t(`editUser.statusChangedSuccess`), 'success');
      onUpdate();
    } catch (error) {
      if (isFirebaseError(error)) {
        return alert(t(`editUser.errors.${error.message}`), 'danger');
      }

      alert(t(`editUser.errors.unexpected`), 'danger');
    }
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
                            onClick={() => handleStatusChange(authUserDetails, Status.DISABLE)}>
                            <ToggleOff className="dots-dropdown"></ToggleOff>
                            {t('dots.disable')}
                          </Dropdown.Item>
                          <Dropdown.Item
                            hidden={!authUserDetails.disabled}
                            onClick={() => handleStatusChange(authUserDetails, Status.ENABLE)}>
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

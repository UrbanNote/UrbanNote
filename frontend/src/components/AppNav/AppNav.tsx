import classNames from 'classnames';
import { HouseDoor, People, Receipt } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';

import { Scrollbar } from '$components';
import { userHasUserManagement } from '$helpers';
import { useAppLayout } from '$hooks';
import { useAppSelector } from '$store';

import AppNavLink from './AppNavLink';

import './AppNav.scss';

function AppNav() {
  const userRoles = useAppSelector(state => state.user.roles);
  const { t } = useTranslation('common');
  const hasUserManagement = userHasUserManagement(userRoles);

  const isLayoutHorizontal = useAppLayout('horizontal');

  return (
    <Scrollbar
      className={classNames('AppNav d-flex', {
        'bg-white shadow-lg fixed-bottom py-2 px-1 gap-3': !isLayoutHorizontal,
        '--vertical flex-column h-100 px-2 gap-5 flex-shrink-0 py-3 fixed-left': isLayoutHorizontal,
      })}>
      <AppNavLink to="" icon={HouseDoor} text={t('appNav.home')} />
      <AppNavLink to="expenses" icon={Receipt} text={t('appNav.expenses')} />
      {/* <AppNavLink to="notes" icon={VectorPen} text={t('appNav.notes')} />
      <AppNavLink to="resources" icon={FolderSymlink} text={t('appNav.resources')} /> */}
      {hasUserManagement && <AppNavLink to="users" icon={People} text={t('appNav.users')} />}
    </Scrollbar>
  );
}

export default AppNav;

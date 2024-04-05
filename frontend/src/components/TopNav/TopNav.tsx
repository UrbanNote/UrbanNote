import { useState } from 'react';

import classNames from 'classnames';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Navbar from 'react-bootstrap/Navbar';
import Stack from 'react-bootstrap/Stack';
import { ArrowLeft } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Avatar } from '$components';
import SettingsSlideOut from '$components/SettingsSlideOut';
import { signOut } from '$firebase/auth';
import { getUsualName } from '$helpers';
import { useAppLayout } from '$hooks';
import { useAppSelector } from '$store';

import './TopNav.scss';

function TopNav() {
  const page = useAppSelector(state => state.page);
  const profile = useAppSelector(state => state.user.profile);
  const { t } = useTranslation('common');
  const [showSettingsSlideOut, setShowSettingsSlideOut] = useState(false);
  const isLayoutHorizontal = useAppLayout('horizontal');
  const navTitle = page.titleShort || page.title;

  return (
    <Navbar
      fixed={!isLayoutHorizontal ? 'top' : undefined}
      className={classNames('TopNav justify-content-between', {
        'bg-white shadow px-3': !isLayoutHorizontal,
        '--vertical px-4': isLayoutHorizontal,
      })}>
      <Stack className="d-flex align-items-center" direction="horizontal" gap={3}>
        {!isLayoutHorizontal && page.backLink ? (
          <Link to={page.backLink}>
            <ArrowLeft size={24} />
          </Link>
        ) : (
          <Navbar.Brand as={Link} to="/" className="me-0">
            <img src="/logo.svg" alt="Logo" width={isLayoutHorizontal ? '38px' : '28px'} />
          </Navbar.Brand>
        )}
      </Stack>
      {navTitle && !isLayoutHorizontal && (
        <Navbar.Text
          className={classNames('TopNav__Title p-0', {
            'text-primary': !isLayoutHorizontal,
            'text-dark': isLayoutHorizontal,
          })}>
          {navTitle}
        </Navbar.Text>
      )}
      <Stack direction="horizontal" gap={3}>
        <Dropdown className="TopNav__UserMenu">
          <Dropdown.Toggle
            id="user-menu"
            className="TopNav__UserMenu__Toggle p-0"
            variant="quiet"
            as={Avatar}
            profile={profile}
            buttonSize={isLayoutHorizontal ? 38 : undefined}
          />
          <Dropdown.Menu variant="secondary" align="end">
            <Dropdown.Header>{getUsualName(profile)}</Dropdown.Header>
            <Dropdown.Item as={Button} onClick={() => setShowSettingsSlideOut(true)}>
              {t('settings')}
            </Dropdown.Item>
            <Dropdown.Item as={Button} onClick={signOut}>
              {t('signOut')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Stack>
      <SettingsSlideOut show={showSettingsSlideOut} setShow={setShowSettingsSlideOut} />
    </Navbar>
  );
}

export default TopNav;

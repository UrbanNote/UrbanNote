import { useState } from 'react';

import classNames from 'classnames';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Navbar from 'react-bootstrap/Navbar';
import Stack from 'react-bootstrap/Stack';
import { ArrowLeft, QuestionCircle } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Avatar, YoutubeVideoModal } from '$components';
import SettingsSlideOut from '$components/SettingsSlideOut';
import { signOut } from '$firebase/auth';
import { getUsualName } from '$helpers';
import { useAppLayout } from '$hooks';
import { useAppSelector } from '$store';

import './TopNav.scss';

const DOCUMENTATION_URL_EN = import.meta.env.VITE_DOCUMENTATION_URL_EN;
const DOCUMENTATION_URL_FR = import.meta.env.VITE_DOCUMENTATION_URL_FR;

function TopNav() {
  const page = useAppSelector(state => state.page);
  const profile = useAppSelector(state => state.user.profile);
  const { t, i18n } = useTranslation('common');
  const { t: tHelp } = useTranslation('help');
  const [showSettingsSlideOut, setShowSettingsSlideOut] = useState(false);
  const [showTrainingVideosPlaylist, setShowTrainingVideosPlaylist] = useState(false);
  const isLayoutHorizontal = useAppLayout('horizontal');

  const navTitle = page.titleShort || page.title;
  const documentationUrl = i18n.language === 'fr' ? DOCUMENTATION_URL_FR : DOCUMENTATION_URL_EN;

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
        <Dropdown className="TopNav__HelpMenu">
          <Dropdown.Toggle id="help-menu" className="TopNav__HelpMenu__Toggle p-1 text-dark" variant="quiet">
            <QuestionCircle size={24} />
          </Dropdown.Toggle>
          <Dropdown.Menu variant="secondary" align="end">
            <Dropdown.Header>{t('helpCenter')}</Dropdown.Header>
            {documentationUrl && (
              <Dropdown.Item as="a" href={documentationUrl} target="_blank">
                {t('documentation')}
              </Dropdown.Item>
            )}
            <Dropdown.Item onClick={() => setShowTrainingVideosPlaylist(true)}>{t('trainingVideos')}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
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
      <YoutubeVideoModal
        show={showTrainingVideosPlaylist}
        onHide={() => setShowTrainingVideosPlaylist(false)}
        src={tHelp('trainingVideos.playlist.src')}
        title={tHelp('trainingVideos.playlist.title')}
      />
    </Navbar>
  );
}

export default TopNav;

import type { PropsWithChildren } from 'react';

import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import type { AuthUser } from '$firebase/auth';

export type HeaderUsersProps = PropsWithChildren<{
  setUserToUpdate: (user?: AuthUser) => void;
  setShow: (show: boolean) => void;
}>;

export function Header({ setUserToUpdate, setShow }: HeaderUsersProps) {
  const { t } = useTranslation('users');

  return (
    <div className="users-header">
      <h1 className="title">{t('title')}</h1>
      <Button
        variant="secondary"
        onClick={() => {
          setUserToUpdate(undefined);
          setShow(true);
        }}>
        {t('create')}
      </Button>
    </div>
  );
}

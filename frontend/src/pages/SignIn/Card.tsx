import type { ChangeEvent, PropsWithChildren } from 'react';

import { motion } from 'framer-motion';
import Button from 'react-bootstrap/Button';
import BootstrapCard from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import { ArrowLeft } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';

import { slideIn } from '$animations';

export type CardProps = PropsWithChildren<{
  onClickBackLink?: () => void;
}>;

function Card({ children, onClickBackLink }: CardProps) {
  const { t, i18n } = useTranslation('common');

  const handleChangeLanguage = (event: ChangeEvent<HTMLSelectElement>) => {
    localStorage.setItem('i18nextLng', event.target.value);
    i18n.changeLanguage(event.target.value);
  };

  return (
    <BootstrapCard
      className="z-1 p-4 rounded-5 border-0 shadow-lg"
      as={motion.div}
      {...slideIn}
      style={{ maxWidth: 400, margin: 'auto' }}>
      <Stack
        direction="horizontal"
        className="w-100 mb-3 flex-row-reverse justify-content-between align-items-center"
        gap={3}>
        <Form.Select size="sm" style={{ width: 120 }} value={i18n.language} onChange={handleChangeLanguage}>
          <option value="en">{t('en')}</option>
          <option value="fr">{t('fr')}</option>
        </Form.Select>
        {onClickBackLink && (
          <Button className="w-fit" variant="link" onClick={onClickBackLink}>
            <ArrowLeft size={24} />
          </Button>
        )}
      </Stack>
      {children}
    </BootstrapCard>
  );
}

export default Card;

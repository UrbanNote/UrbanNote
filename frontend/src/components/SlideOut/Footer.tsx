import { useContext } from 'react';
import type { ComponentProps } from 'react';

import classNames from 'classnames';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';

import SlideOutContext from './context';

export type FooterProps = {
  cancelLabel?: string | JSX.Element;
  cancelProps?: Omit<ComponentProps<typeof Button>, 'children'>;
  confirmLabel?: string | JSX.Element;
  confirmProps?: Omit<ComponentProps<typeof Button>, 'children'>;
  /** @deprecated use confirmProps instead */
  confirmVariant?: ComponentProps<typeof Button>['variant'];
  /** @deprecated Use SlideOut's onCancel instead. */
  onCancel?: () => void;
  /** @deprecated Use confirmProps instead */
  onConfirm?: () => void;
};

function Footer({
  cancelLabel,
  cancelProps,
  confirmLabel,
  confirmProps,
  confirmVariant = 'secondary',
  onConfirm,
  onCancel,
}: FooterProps) {
  const { t } = useTranslation('common');
  const { placement, handleClose } = useContext(SlideOutContext);

  const handleCancel = () => {
    handleClose();
    onCancel?.();
    cancelProps?.onClick?.();
  };

  const cancelBtnProps = {
    variant: 'outline-primary',
    ...cancelProps,
    className: classNames('w-100', `${cancelProps?.className}`),
    onClick: handleCancel,
  };

  const confirmBtnProps = {
    variant: confirmVariant,
    onClick: onConfirm,
    ...confirmProps,
    className: classNames('w-100', `${confirmProps?.className}`),
  };

  return (
    <div
      className={classNames(
        'SlideOut__Footer d-flex flex-row justify-content-between align-items-center',
        'p-4 bg-white rounded-bottom-start-5 gap-4',
        {
          'rounded-bottom-end-5': placement === 'end',
        },
      )}>
      <Button {...confirmBtnProps}>{confirmLabel ?? t('confirm')}</Button>
      <Button {...cancelBtnProps}>{cancelLabel ?? t('cancel')}</Button>
    </div>
  );
}

export default Footer;

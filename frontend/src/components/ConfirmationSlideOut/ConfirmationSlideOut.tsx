import type { Icon } from 'react-bootstrap-icons';

import { SlideOut } from '$components';
import type { FooterProps } from '$components/SlideOut/Footer';

export type ConfirmationSlideOutProps = {
  icon: Icon;
  show: boolean;
  title: string;
  message: string;
  variant: 'danger' | 'warning';
  onCancel?: () => void;
  onConfirm: () => void;
  setShow: (show: boolean) => void;
} & Partial<Pick<FooterProps, 'confirmLabel' | 'confirmProps' | 'cancelProps'>>;

function ConfirmationSlideOut({
  icon: Icon,
  show,
  title,
  message,
  variant,
  cancelProps,
  confirmLabel,
  confirmProps,
  onConfirm,
  onCancel,
  setShow,
}: ConfirmationSlideOutProps) {
  const footerProps: FooterProps = {
    confirmLabel,
    confirmProps: {
      ...(confirmProps || {}),
      variant,
      onClick: onConfirm,
    },
    cancelProps,
  };

  return (
    <SlideOut show={show} setShow={setShow} onCancel={onCancel}>
      <SlideOut.Body closeBtn>
        <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center">
          <Icon className={`text-${variant}`} size={64} />
          <h2 className="h4 mt-3">{title}</h2>
          <p className="text-center">{message}</p>
        </div>
      </SlideOut.Body>
      <SlideOut.Footer {...footerProps} />
    </SlideOut>
  );
}

export default ConfirmationSlideOut;

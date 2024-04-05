import { useContext, type PropsWithChildren, useLayoutEffect } from 'react';

import classNames from 'classnames';
import CloseButton from 'react-bootstrap/CloseButton';
import Offcanvas from 'react-bootstrap/Offcanvas';

import SlideOutContext from './context';

export type HeaderProps = PropsWithChildren<{
  title?: string;
  content?: string;
  closeBtn?: boolean;
}>;

function Header({ title, content, children, closeBtn }: HeaderProps) {
  const { placement, handleClose, setHasHeader } = useContext(SlideOutContext);

  useLayoutEffect(() => {
    setHasHeader(true);
  }, [setHasHeader]);

  return (
    <Offcanvas.Header
      className={classNames(
        'SlideOut__Header p-4 bg-primary-100 text-primary-700 flex-column align-items-start gap-4',
        {
          'rounded-start-5': placement === 'end',
          'rounded-top-5': placement === 'bottom',
        },
      )}>
      {(closeBtn || title) && (
        <div className="d-flex flex-row justify-content-between align-items-center w-100">
          {title && <h2 className="mb-0">{title}</h2>}
          {closeBtn && <CloseButton onClick={handleClose} />}
        </div>
      )}
      {content && <p className="mb-0">{content}</p>}
      {children}
    </Offcanvas.Header>
  );
}

export default Header;

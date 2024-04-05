import { useContext, type PropsWithChildren } from 'react';

import CloseButton from 'react-bootstrap/CloseButton';
import OffcanvasBody from 'react-bootstrap/OffcanvasBody';

import SlideOutContext from './context';

export type BodyProps = PropsWithChildren<{
  title?: string;
  closeBtn?: boolean;
}>;

function Body({ children, title, closeBtn }: BodyProps) {
  const { handleClose } = useContext(SlideOutContext);
  return (
    <OffcanvasBody className="SlideOut__Body bg-white rounded-top-5 p-4 d-flex flex-column align-items-start gap-4">
      {(closeBtn || title) && (
        <div className="d-flex flex-row justify-content-between align-items-center w-100">
          {title && <h2 className="mb-0 text-primary-700">{title}</h2>}
          {closeBtn && <CloseButton onClick={handleClose} />}
        </div>
      )}
      {children}
    </OffcanvasBody>
  );
}

export default Body;

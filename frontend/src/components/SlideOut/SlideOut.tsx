import { forwardRef, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';

import classNames from 'classnames';
import Offcanvas from 'react-bootstrap/Offcanvas';

import { useScreenMinWidth, useScreenOrientation } from '$hooks';

import SlideOutContext from './context';

export type SlideOutProps = PropsWithChildren<{
  show: boolean;
  fullSize?: boolean;
  placement?: 'end' | 'bottom';
  onCancel?: () => void;
  setShow: (show: boolean) => void;
}>;

const SlideOut = forwardRef<HTMLDivElement, SlideOutProps>(
  ({ show, fullSize, children, placement: placementProp, onCancel, setShow }, ref) => {
    const [hasHeader, setHasHeader] = useState(false);
    const isAboveMdBreakpoint = useScreenMinWidth('md');
    const isLandscape = useScreenOrientation('landscape');

    const placement = placementProp ?? (isAboveMdBreakpoint && isLandscape ? 'end' : 'bottom');

    const context = useMemo(
      () => ({
        show,
        hasHeader: false,
        placement,
        setHasHeader: (hasHeader: boolean) => setHasHeader(hasHeader),
        handleClose: () => {
          setShow(false);
          if (onCancel) setTimeout(onCancel, 600);
        },
        setShow,
      }),
      [show, placement, setShow, onCancel],
    );

    return (
      <SlideOutContext.Provider value={context}>
        <Offcanvas
          ref={ref}
          className={classNames('SlideOut border-0', {
            'bg-primary-100': hasHeader,
            'rounded-start-5': placement === 'end',
            'rounded-top-5': placement === 'bottom',
            'h-auto': !fullSize && placement === 'bottom',
            'h-100': fullSize && placement === 'bottom',
            'w-100': fullSize && placement === 'end',
          })}
          placement={placement}
          show={show}
          onHide={context.handleClose}>
          {children}
        </Offcanvas>
      </SlideOutContext.Provider>
    );
  },
);

SlideOut.displayName = 'SlideOut';

export default SlideOut;

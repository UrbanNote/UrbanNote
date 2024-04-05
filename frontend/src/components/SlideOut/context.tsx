import { createContext } from 'react';

import type { SlideOutProps } from './SlideOut';

export type SlideOutContextType = Pick<SlideOutProps, 'show' | 'setShow' | 'placement'> & {
  hasHeader: boolean;
  setHasHeader: (hasHeader: boolean) => void;
  handleClose: () => void;
  setShow: (show: boolean) => void;
};

const defaultValue: SlideOutContextType = {
  show: false,
  hasHeader: false,
  placement: 'end',
  setHasHeader: () => {},
  handleClose: () => {},
  setShow: () => {},
};

const SlideOutContext = createContext<SlideOutContextType>(defaultValue);

export default SlideOutContext;

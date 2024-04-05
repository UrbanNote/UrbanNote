import type { ComponentProps, FunctionComponent } from 'react';
import { forwardRef } from 'react';

import classNames from 'classnames';

import './Scrollbar.scss';

export type ScrollbarProps = ComponentProps<'div'> & {
  // allow passing a component
  as?: FunctionComponent;
  trackPaddingTop?: 'lg';
};

/** Wrapper that allows control over the scroll bar's display and style when a container is scrollable. */
const Scrollbar = forwardRef<HTMLDivElement, ScrollbarProps>(
  ({ as, children, className, trackPaddingTop, ...props }, ref) => {
    const classes = classNames('Scrollbar', className, {
      'Scrollbar--track-padding-top-lg': trackPaddingTop === 'lg',
    });
    const Container = as || 'div';

    return (
      <Container ref={ref} className={classes} {...props}>
        {children}
      </Container>
    );
  },
);

Scrollbar.displayName = 'Scrollbar';

export default Scrollbar;

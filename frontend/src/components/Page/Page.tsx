import classNames from 'classnames';

import { Scrollbar, TrainingVideo } from '$components';
import { useAppLayout } from '$hooks';
import { useAppSelector } from '$store';

import type { PageProps } from './types';

import './Page.scss';

function Page({ children, className, ...restProps }: PageProps) {
  const { background, trainingVideo } = useAppSelector(state => state.page);
  const isLayoutHorizontal = useAppLayout('horizontal');

  return (
    <Scrollbar
      trackPaddingTop="lg"
      className={classNames(`Page bg-${background || 'white'}`, className, {
        'p-2': !isLayoutHorizontal,
        '--vertical w-100 rounded-5 rounded-bottom-0 p-4': isLayoutHorizontal,
      })}
      {...restProps}>
      {trainingVideo && <TrainingVideo video={trainingVideo} />}
      {children}
    </Scrollbar>
  );
}

export default Page;

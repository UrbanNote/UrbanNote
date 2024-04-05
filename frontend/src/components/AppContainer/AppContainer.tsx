import classNames from 'classnames';
import { Outlet } from 'react-router-dom';

import { TopNav, AppNav, Page, Scrollbar } from '$components';
import { useAppLayout } from '$hooks';

import './AppContainer.scss';

function AppContainer() {
  const isLayoutHorizontal = useAppLayout('horizontal');

  return (
    <>
      <TopNav />
      <Scrollbar
        className={classNames('AppContainer', {
          '--vertical d-flex py-0 ps-0 pe-4 pb-0 fixed': isLayoutHorizontal,
        })}>
        <AppNav />
        <Page>
          <Outlet />
        </Page>
      </Scrollbar>
    </>
  );
}

export default AppContainer;

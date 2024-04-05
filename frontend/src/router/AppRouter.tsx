import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AppContainer } from '$components';
import Expenses from '$pages/Expenses';
import Home from '$pages/Home';
import Settings from '$pages/Settings';
import SignIn from '$pages/SignIn';
import Users from '$pages/Users';
import { useAppSelector } from '$store';

import { ProtectedRoute } from './ProtectedRoute';

export function AppRouter() {
  const user = useAppSelector(state => state.user);

  return (
    <BrowserRouter>
      <Routes>
        {!user.id ? (
          <Route path="*" element={<SignIn />} />
        ) : (
          <Route path="" element={<AppContainer />}>
            <Route path="/" element={<Home />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="settings" element={<Settings />} />
            <Route
              path="users"
              element={
                <ProtectedRoute userManagement>
                  <Users />
                </ProtectedRoute>
              }></Route>
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

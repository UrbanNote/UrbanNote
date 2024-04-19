import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AppContainer } from '$components';
import Expenses from '$pages/Expenses';
import Home from '$pages/Home';
import Onboarding from '$pages/Onboarding';
import SignIn from '$pages/SignIn';
import Users from '$pages/Users';
import { useAppSelector } from '$store';

import ProtectedRoute from './ProtectedRoute';

function AppRouter() {
  const user = useAppSelector(state => state.user);

  if (!user.id) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    );
  }

  if (!user.profile) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Onboarding />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppContainer />}>
          <Route index element={<Home />} />
          <Route path="expenses" element={<Expenses />} />
          <Route
            path="users"
            element={
              <ProtectedRoute userManagement>
                <Users />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;

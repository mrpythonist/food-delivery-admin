import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import GuestGuard from 'components/GuestGuard';

// jwt auth
const LoginPage = Loadable(lazy(() => import('pages/auth/Login')));
const RegisterPage = Loadable(lazy(() => import('pages/auth/Register')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      children: [
        {
          path: '/login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          )
        },
        {
          path: '/register',
          element: <RegisterPage />
        }
      ]
    }
  ]
};

export default LoginRoutes;

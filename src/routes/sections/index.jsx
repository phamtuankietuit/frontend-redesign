import { lazy, Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { MainLayout } from 'src/layouts/main';

import { SplashScreen } from 'src/components/loading-screen';

import { myAuthRoutes } from './my-auth';
import { myMainRoutes } from './my-main';
import { profileRoutes } from './profile';
import { dashboardRoutes } from './dashboard';

// ----------------------------------------------------------------------

const HomePage = lazy(() => import('src/pages/my-home'));

export function Router() {
  return useRoutes([
    {
      path: '/',
      /**
       * Skip home page
       * element: <Navigate to={CONFIG.auth.redirectPath} replace />,
       */
      element: (
        <Suspense fallback={<SplashScreen />}>
          <MainLayout>
            <HomePage />
          </MainLayout>
        </Suspense>
      ),
    },

    // Dashboard
    ...dashboardRoutes,

    // My Auth
    ...myAuthRoutes,

    // My Main
    ...myMainRoutes,

    // Profile
    ...profileRoutes,

    // No match
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

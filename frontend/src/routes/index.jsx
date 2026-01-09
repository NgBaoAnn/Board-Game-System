import { createBrowserRouter } from 'react-router-dom'
import ClientLayout from '../components/layout/ClientLayout'
import AdminLayout from '../components/layout/AdminLayout'
import HomePage from '../pages/user/HomePage'
import LoginPage from '../pages/common/LoginPage'
import RegisterPage from '../pages/common/RegisterPage'
import SettingPage from '../pages/common/SettingPage'
import NotFoundPage from '../pages/common/NotFoundPage'
import BoardGamePage from '../pages/user/BoardGamePage'
import AdminPage from '../pages/admin/AdminPage'
import AdminUsersPage from '../pages/admin/AdminUsersPage'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import AdminGamesPage from '@/pages/admin/AdminGamesPage'
import RequireAdmin from '@/components/common/RequireAdmin'
import RequireAuth from '@/components/common/RequireAuth'

export const router = createBrowserRouter([
  // Routes with shared ClientLayout (sidebar + header)
  {
    element: <ClientLayout />,
    children: [
      {
        // Home is public - no auth required
        path: '/',
        element: <HomePage />,
      },
      {
        // BoardGame requires authentication
        path: '/boardgame',
        element: (
          <BoardGamePage />
        ),
      },
      {
        // Settings requires authentication
        path: '/settings',
        element: (
          <RequireAuth>
            <SettingPage />
          </RequireAuth>
        ),
      }
    ],
    errorElement: <NotFoundPage />,
  },
  // Auth routes without shared layout
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  // Admin routes
  {
    path: '/admin',
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [
      { index: true, element: <AdminPage /> },
      { path: '/admin/users', element: <AdminUsersPage /> },
      { path: '/admin/dashboard', element: <AdminDashboardPage /> },
      { path: '/admin/games', element: <AdminGamesPage /> },
    ],
  },
])

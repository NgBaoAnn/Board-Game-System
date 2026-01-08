import { createBrowserRouter } from 'react-router-dom'
import ClientLayout from '../components/layout/ClientLayout'
import AdminLayout from '../components/layout/AdminLayout'
import HomePage from '../pages/user/HomePage'
import LoginPage from '../pages/common/LoginPage'
import RegisterPage from '../pages/common/RegisterPage'
import SettingPage from '../pages/common/SettingPage'
import ForgotPasswordPage from '../pages/common/ForgotPasswordPage'
import VerifyOTPPage from '../pages/common/VerifyOTPPage'
import ResetPasswordPage from '../pages/common/ResetPasswordPage'
import NotFoundPage from '../pages/common/NotFoundPage'
import BoardGamePage from '../pages/user/BoardGamePage'
import CommunityPage from '../pages/user/CommunityPage'
import AdminPage from '../pages/admin/AdminPage'
import AdminUsersPage from '../pages/admin/AdminUsersPage'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import AdminGamesPage from '@/pages/admin/AdminGamesPage'
import RequireAdmin from '@/components/common/RequireAdmin'

export const router = createBrowserRouter([
  // Routes with shared ClientLayout (sidebar + header)
  {
    element: <ClientLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/boardgame',
        element: <BoardGamePage />,
      },
      {
        path: '/community',
        element: <CommunityPage />,
      },
      {
        path: '/settings',
        element: <SettingPage />,
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
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/verify-otp',
    element: <VerifyOTPPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
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

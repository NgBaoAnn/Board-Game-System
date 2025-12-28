import { createBrowserRouter } from 'react-router-dom'
import ClientLayout from '../components/layout/ClientLayout'
import AdminLayout from '../components/layout/AdminLayout'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import NotFoundPage from '../pages/NotFoundPage'
import BoardGamePage from '../pages/BoardGamePage'
import AdminPage from '../pages/AdminPage'
import AdminUsersPage from '../pages/AdminUsersPage'
import AdminDashboardPage from '@/pages/AdminDashboardPage'
import AdminGamesPage from '@/pages/AdminGamesPage'
import RequireAdmin from '@/components/common/RequireAdmin'

export const router = createBrowserRouter([
  {
    element: <ClientLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/boardgame', element: <BoardGamePage /> },
    ],
    errorElement: <NotFoundPage />,
  },
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

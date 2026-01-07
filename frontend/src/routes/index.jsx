import { createBrowserRouter } from 'react-router-dom'
import ClientLayout from '../components/layout/ClientLayout'
import AdminLayout from '../components/layout/AdminLayout'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import AdminPage from '../pages/AdminPage'
import NotFoundPage from '../pages/NotFoundPage'
import BoardGamePage from '../pages/BoardGamePage'

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
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminPage />,
      },
    ],
  },
])

import { createBrowserRouter } from 'react-router-dom'
import ClientLayout from '../components/layout/ClientLayout'
import AdminLayout from '../components/layout/AdminLayout'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import AdminPage from '../pages/AdminPage'
import NotFoundPage from '../pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    element: <ClientLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
    errorElement: <NotFoundPage />,
  },
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

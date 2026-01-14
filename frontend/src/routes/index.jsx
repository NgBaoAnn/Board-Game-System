import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import ClientLayout from '../components/layout/ClientLayout'
import AdminLayout from '../components/layout/AdminLayout'
import RequireAdmin from '@/components/common/RequireAdmin'
import RequireAuth from '@/components/common/RequireAuth'

// Lazy load pages for code splitting
const HomePage = lazy(() => import('../pages/user/HomePage'))
const BoardGamePage = lazy(() => import('../pages/user/BoardGamePage'))
const CommunityPage = lazy(() => import('../pages/user/CommunityPage'))
const ProfilePage = lazy(() => import('../pages/user/ProfilePage'))
const FriendProfilePage = lazy(() => import('../pages/user/FriendProfilePage'))
const RankingPage = lazy(() => import('../pages/user/RankingPage'))
const MessagePage = lazy(() => import('../pages/user/MessagePage'))
const GameReviewPage = lazy(() => import('../pages/user/GameReviewPage'))

const LoginPage = lazy(() => import('../pages/common/LoginPage'))
const RegisterPage = lazy(() => import('../pages/common/RegisterPage'))
const SettingPage = lazy(() => import('../pages/common/SettingPage'))
const ForgotPasswordPage = lazy(() => import('../pages/common/ForgotPasswordPage'))
const VerifyOTPPage = lazy(() => import('../pages/common/VerifyOTPPage'))
const ResetPasswordPage = lazy(() => import('../pages/common/ResetPasswordPage'))
const NotFoundPage = lazy(() => import('../pages/common/NotFoundPage'))
const UnauthorizedPage = lazy(() => import('../pages/common/UnauthorizedPage'))
const ForbiddenPage = lazy(() => import('../pages/common/ForbiddenPage'))

const AdminPage = lazy(() => import('../pages/admin/AdminPage'))
const AdminUsersPage = lazy(() => import('../pages/admin/AdminUsersPage'))
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const AdminGamesPage = lazy(() => import('@/pages/admin/AdminGamesPage'))
const AdminAchievementsPage = lazy(() => import('@/pages/admin/AdminAchievementsPage'))

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
      </div>
    </div>
  )
}

// Wrap element with Suspense
const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
)

// Wrap element with RequireAuth and Suspense
const withAuth = (Component) => (
  <RequireAuth>
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  </RequireAuth>
)

export const router = createBrowserRouter([
  {
    element: <ClientLayout />,
    children: [
      {
        path: '/',
        element: withSuspense(HomePage),
      },
      {
        path: '/boardgame',
        element: withAuth(BoardGamePage),
      },
      {
        path: '/community',
        element: withAuth(CommunityPage),
      },
      {
        path: '/profile',
        element: withAuth(ProfilePage),
      },
      {
        path: '/player/:id',
        element: withAuth(FriendProfilePage),
      },
      {
        path: '/rankings',
        element: withAuth(RankingPage),
      },
      {
        path: '/messages',
        element: withAuth(MessagePage),
      },
      {
        path: '/settings',
        element: withAuth(SettingPage),
      },
      {
        path: '/game/:gameId/reviews',
        element: withAuth(GameReviewPage),
      }
    ],
    errorElement: withSuspense(NotFoundPage),
  },
  {
    path: '/login',
    element: withSuspense(LoginPage),
  },
  {
    path: '/register',
    element: withSuspense(RegisterPage),
  },
  {
    path: '/forgot-password',
    element: withSuspense(ForgotPasswordPage),
  },
  {
    path: '/verify-otp',
    element: withSuspense(VerifyOTPPage),
  },
  {
    path: '/reset-password',
    element: withSuspense(ResetPasswordPage),
  },
  {
    path: '/unauthorized',
    element: withSuspense(UnauthorizedPage),
  },
  {
    path: '/forbidden',
    element: withSuspense(ForbiddenPage),
  },
  {
    path: '/admin',
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [
      { index: true, element: withSuspense(AdminPage) },
      { path: '/admin/users', element: withSuspense(AdminUsersPage) },
      { path: '/admin/dashboard', element: withSuspense(AdminDashboardPage) },
      { path: '/admin/games', element: withSuspense(AdminGamesPage) },
      { path: '/admin/achievements', element: withSuspense(AdminAchievementsPage) },
    ],
  },
])

import { Navigate } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import { Spin } from "antd";

/**
 * RedirectIfAuth - Redirect authenticated users away from auth pages
 * Used for login, register, forgot-password pages
 * If user is already logged in, redirect to home page
 */
export default function RedirectIfAuth({ children }) {
    const { authenticated, isAppLoading, user } = useAuth();

    // Debug logging
    console.log('[RedirectIfAuth] State:', { authenticated, isAppLoading, hasUser: !!user });

    // Show loading while checking auth state
    if (isAppLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
                <Spin size="large" />
            </div>
        );
    }

    // If already authenticated, redirect to home
    if (authenticated) {
        console.log('[RedirectIfAuth] User is authenticated, redirecting to home...');
        return <Navigate to="/" replace />;
    }

    // Not authenticated, show the auth page
    return children;
}


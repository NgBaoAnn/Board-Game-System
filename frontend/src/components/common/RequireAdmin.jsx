import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import { Spin } from "antd";

/**
 * RequireAdmin - Protect admin routes
 * - If not authenticated → redirect to /unauthorized (401)
 * - If authenticated but not admin → redirect to /forbidden (403)
 * - If admin → render children
 */
export default function RequireAdmin({ children }) {
    const location = useLocation();
    const { user, authenticated, isAppLoading } = useAuth();

    // Show loading while checking authentication
    if (isAppLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50">
                <Spin size="large" tip="Đang kiểm tra quyền truy cập..." />
            </div>
        );
    }

    // If not authenticated at all → 401 Unauthorized
    if (!authenticated) {
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }

    // Check if user has admin role (role.name === "admin")
    const isAdmin = user?.role?.name === "admin";

    // If authenticated but not admin → 403 Forbidden
    if (!isAdmin) {
        return <Navigate to="/forbidden" state={{ from: location }} replace />;
    }

    // User is admin, allow access
    return children;
}

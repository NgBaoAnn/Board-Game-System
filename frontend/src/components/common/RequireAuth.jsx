import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import { Spin } from "antd";

/**
 * RequireAuth - Protect routes that require authentication
 * Redirects to login page if user is not authenticated
 */
export default function RequireAuth({ children }) {
    const location = useLocation();
    const { authenticated, isAppLoading } = useAuth();

    if (isAppLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50">
                <Spin size="large" tip="Đang kiểm tra đăng nhập..." />
            </div>
        );
    }

    if (!authenticated) {
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }

    return children;
}

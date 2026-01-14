import { LayoutDashboard, UserCog, Dice5, LogOut, Menu, Award } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from '@/store/useAuth'
import authApi from '@/api/api-auth'
import { message } from 'antd'

export default function AdminSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { setUser, setAuthenticated } = useAuth();
    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

    const [drawerVisible, setDrawerVisible] = useState(false);

    const handleLogout = async (e) => {
        e.preventDefault();
        setDrawerVisible(false);
        try {
            await authApi.logout();
            message.success('Logged out successfully');
        } catch (error) {
           console.error('Logout error:', error);
        } finally {
            setUser(null);
            setAuthenticated(false);
            localStorage.removeItem('access_token');
            navigate('/login');
        }
    };

    const navContent = (
        <>
            <div className="h-16 flex items-center px-6 border-b border-border-light dark:border-border-dark">
                <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Admin Page</span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                <Link
                    to="/admin/dashboard"
                    className={
                        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors " +
                        (isActive("/admin/dashboard") ? "bg-primary/10 text-primary dark:text-primary" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700")
                    }
                    onClick={() => setDrawerVisible(false)}
                >
                    <LayoutDashboard className={"w-5 h-5 " + (isActive("/admin/dashboard") ? "text-primary" : "text-gray-400")} />
                    <span className="font-medium">Dashboard</span>
                </Link>

                <Link
                    to="/admin/users"
                    className={
                        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors " +
                        (isActive("/admin/users") ? "bg-primary/10 text-primary dark:text-primary" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700")
                    }
                    onClick={() => setDrawerVisible(false)}
                >
                    <UserCog className={"w-5 h-5 " + (isActive("/admin/users") ? "text-primary" : "text-gray-400")} />
                    <span className={"font-medium"}>User Management</span>
                </Link>

                <Link
                    to="/admin/games"
                    className={
                        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors " +
                        (isActive("/admin/games") ? "bg-primary/10 text-primary dark:text-primary" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700")
                    }
                    onClick={() => setDrawerVisible(false)}
                >
                    <Dice5 className={"w-5 h-5 " + (isActive("/admin/games") ? "text-primary" : "text-gray-400")} />
                    <span className="font-medium">Games</span>
                </Link>

                <Link
                    to="/admin/achievements"
                    className={
                        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors " +
                        (isActive("/admin/achievements") ? "bg-primary/10 text-primary dark:text-primary" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700")
                    }
                    onClick={() => setDrawerVisible(false)}
                >
                    <Award className={"w-5 h-5 " + (isActive("/admin/achievements") ? "text-primary" : "text-gray-400")} />
                    <span className="font-medium">Achievements</span>
                </Link>
            </nav>

            <div className="px-4 py-1 border-t border-border-light dark:border-border-dark">
                <a
                    className="flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                    onClick={handleLogout}
                >
                    <LogOut />
                    <span className="font-medium">Logout</span>
                </a>
            </div>
        </>
    );

    return (
        <>
            
            <button
                className="xl:hidden fixed top-4 left-4 z-50 p-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg"
                onClick={() => setDrawerVisible(true)}
            >
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            
            <aside className="hidden xl:flex flex-col w-64 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark h-screen sticky top-0 overflow-y-auto">
                {navContent}
            </aside>

            
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark transform transition-transform duration-300 z-50 ${
                    drawerVisible ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {navContent}
            </div>

            
            {drawerVisible && <div className="fixed inset-0 bg-stone-600/20 z-40" onClick={() => setDrawerVisible(false)}></div>}
        </>
    );
}

import { LayoutDashboard, UserCog, Dice5, LogOut, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminSidebar() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <aside className="hidden md:flex flex-col w-64 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark h-screen sticky top-0 overflow-y-auto">
            <div className="h-16 flex items-center px-6 border-b border-border-light dark:border-border-dark">
                <div className="w-8 h-8 mr-3 grid grid-cols-3 gap-0.5">
                    <div className="bg-primary rounded-full"></div>
                    <div className="bg-orange-400 rounded-full"></div>
                    <div className="bg-primary rounded-full"></div>
                    <div className="bg-pink-400 rounded-full"></div>
                    <div className="bg-blue-400 rounded-full"></div>
                    <div className="bg-pink-400 rounded-full"></div>
                    <div className="bg-primary rounded-full"></div>
                    <div className="bg-purple-500 rounded-full"></div>
                    <div className="bg-primary rounded-full"></div>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Admin Page</span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                <Link
                    to="/admin/dashboard"
                    className={
                        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors " +
                        (isActive("/admin/dashboard") ? "bg-primary/10 text-primary dark:text-primary" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700")
                    }
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
                >
                    <UserCog className={"w-5 h-5 " + (isActive("/admin/users") ? "text-primary" : "text-gray-400")} />
                    <span className="font-medium">User Management</span>
                </Link>

                <Link
                    to="/admin/games"
                    className={
                        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors " +
                        (isActive("/admin/games") ? "bg-primary/10 text-primary dark:text-primary" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700")
                    }
                >
                    <Dice5 className={"w-5 h-5 " + (isActive("/admin/games") ? "text-primary" : "text-gray-400")} />
                    <span className="font-medium">Games</span>
                </Link>
            </nav>

            <div className="px-4 py-1 border-t border-border-light dark:border-border-dark">
                {/* <a className="flex items-center space-x-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" href="#">
                    <Settings />
                    <span class="font-medium">Settings</span>
                </a> */}
                <a class="flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" href="#">
                    <LogOut />
                    <span class="font-medium">Logout</span>
                </a>
            </div>
        </aside>
    );
}

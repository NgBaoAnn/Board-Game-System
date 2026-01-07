import { Outlet } from "react-router-dom";
import AdminSidebar from "../common/AdminSidebar";
import ThemeToggle from "../common/ThemeToggle";

export default function AdminLayout() {
    return (
        <div>
            <main className="bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-100 transition-colors duration-200 antialiased min-h-screen flex flex-col md:flex-row">
                <AdminSidebar />
                <Outlet />
            </main>
            <ThemeToggle className="fixed bottom-3 right-3 z-50" />
        </div>
    );
}

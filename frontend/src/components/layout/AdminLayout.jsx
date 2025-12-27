import { Outlet } from "react-router-dom";
import AdminSidebar from "../common/AdminSidebar";

export default function AdminLayout() {
    return (
        <main className="bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-100 transition-colors duration-200 antialiased min-h-screen flex flex-col md:flex-row">
            <AdminSidebar />
            <Outlet />
        </main>
    );
}

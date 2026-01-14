import { Card, Row, Col, ConfigProvider, theme } from "antd";
import { Link } from "react-router-dom";
import { LayoutDashboard, Users, Gamepad2, Award } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const adminLinks = [
    {
        title: "Dashboard",
        description: "View statistics and analytics",
        icon: LayoutDashboard,
        path: "/admin/dashboard",
        color: "bg-blue-500",
    },
    {
        title: "Users",
        description: "Manage user accounts",
        icon: Users,
        path: "/admin/users",
        color: "bg-green-500",
    },
    {
        title: "Games",
        description: "Manage games and content",
        icon: Gamepad2,
        path: "/admin/games",
        color: "bg-purple-500",
    },
    {
        title: "Achievements",
        description: "Manage achievements and rewards",
        icon: Award,
        path: "/admin/achievements",
        color: "bg-orange-500",
    },
];

export default function AdminPage() {
    const { isDarkMode } = useTheme();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Admin Panel</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Welcome to the administration area</p>

            <ConfigProvider
                theme={{
                    token: {
                        colorBgContainer: isDarkMode ? "#212f4d" : "#fbfbfb",
                        colorText: isDarkMode ? "#fff" : "#000",
                    },
                    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                }}
            >
                <Row gutter={[24, 24]}>
                    {adminLinks.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <Col key={item.title} xs={24} sm={12} lg={6}>
                                <Link to={item.path}>
                                    <Card
                                        hoverable
                                        className="h-full rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow bg-surface-light dark:bg-surface-dark"
                                    >
                                        <div className="flex flex-col items-center text-center">
                                            <div className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                                                <IconComponent size={28} className="text-white" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                                        </div>
                                    </Card>
                                </Link>
                            </Col>
                        );
                    })}
                </Row>
            </ConfigProvider>
        </div>
    );
}

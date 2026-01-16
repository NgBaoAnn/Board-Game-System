import { Select, ConfigProvider, theme, Spin, message } from "antd";
import { lazy, Suspense } from 'react';
// Lazy load heavy chart components for better bundle size (rule: bundle-dynamic-imports)
const Column = lazy(() => import("@ant-design/plots").then(m => ({ default: m.Column })));
const Pie = lazy(() => import("@ant-design/plots").then(m => ({ default: m.Pie })));
const Line = lazy(() => import("@ant-design/plots").then(m => ({ default: m.Line })));
const Area = lazy(() => import("@ant-design/plots").then(m => ({ default: m.Area })));
// Direct imports for better bundle size (rule: bundle-barrel-imports)
import UserPlus from 'lucide-react/dist/esm/icons/user-plus'
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up'
import TrendingDown from 'lucide-react/dist/esm/icons/trending-down'
import Users from 'lucide-react/dist/esm/icons/users'
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle'
import Activity from 'lucide-react/dist/esm/icons/activity'
import Trophy from 'lucide-react/dist/esm/icons/trophy'
import BarChart3 from 'lucide-react/dist/esm/icons/bar-chart-3'
import PieChart from 'lucide-react/dist/esm/icons/pie-chart'
import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { dashboardApi } from "../../api/dashboard";

export default function AdminDashboardPage() {
    const { isDarkMode } = useTheme();

    const [range, setRange] = useState("30d");
    const [activityData, setActivityData] = useState([]);
    const [dashboardStats, setDashboardStats] = useState({
        totalPlayers: { value: 0, change: 0 },
        newUsers: { value: 0, change: 0 },
        finishedGames: { value: 0, change: 0 },
        activeGames: { value: 0 },
    });
    const [registrationStats, setRegistrationStats] = useState([]);
    const [popularityData, setPopularityData] = useState([]);
    const [achievementData, setAchievementData] = useState([]);

    // Global loading state
    const [isLoading, setIsLoading] = useState(false);

    // Consolidated useEffect - fetch all data in parallel (rule: async-parallel)
    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                // Parallel fetch using Promise.allSettled for resilience
                const [activityRes, statsRes, registrationRes, popularityRes, achievementRes] = await Promise.allSettled([
                    dashboardApi.getActivityChart(range),
                    dashboardApi.getStats(range),
                    dashboardApi.getRegistrationChart(range),
                    dashboardApi.getPopularityChart(range),
                    dashboardApi.getAchievementChart(range)
                ]);

                // Process results
                if (activityRes.status === 'fulfilled' && activityRes.value.success) {
                    setActivityData(activityRes.value.data);
                } else if (activityRes.status === 'rejected') {
                    message.error("Failed to fetch activity chart");
                }

                if (statsRes.status === 'fulfilled' && statsRes.value.success) {
                    setDashboardStats(statsRes.value.data);
                } else if (statsRes.status === 'rejected') {
                    message.error("Failed to fetch dashboard stats");
                }

                if (registrationRes.status === 'fulfilled' && registrationRes.value.success) {
                    setRegistrationStats(registrationRes.value.data);
                } else if (registrationRes.status === 'rejected') {
                    message.error("Failed to fetch registration stats");
                }

                if (popularityRes.status === 'fulfilled' && popularityRes.value.success) {
                    setPopularityData(popularityRes.value.data);
                } else if (popularityRes.status === 'rejected') {
                    message.error("Failed to fetch popularity chart");
                }

                if (achievementRes.status === 'fulfilled' && achievementRes.value.success) {
                    setAchievementData(achievementRes.value.data);
                } else if (achievementRes.status === 'rejected') {
                    message.error("Failed to fetch achievement chart");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, [range]);

    const areaConfig = {
        theme: isDarkMode ? { type: "dark" } : { type: "light" },
        data: achievementData,
        xField: "label",
        yField: "value",
        smooth: true,
        areaStyle: () => {
            return {
                fill: "l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff",
            };
        },
        line: {
            color: "#1890ff",
        },
         tooltip: {
            showMarkers: true,
            title: "label",
            items: ["value"],
        },
    };


    const columnConfig = {
        theme: isDarkMode ? { type: "dark" } : { type: "light" },
        data: activityData,
        xField: "label",
        yField: "value",
        height: 280,
        color: "#3B82F6",
        radius: 4,
        style: {
            radius: 3,
        },
        tooltip: {
            title: "label",
            items: ["value"],
        },
        xAxis: { label: { autoHide: true, autoRotate: false } },
    };

    const pieConfig = {
        theme: isDarkMode ? { type: "dark" } : { type: "light" },
        appendPadding: 10,
        data: popularityData,
        angleField: "value",
        colorField: "type",
        radius: 0.9,
        legend: {
            color: {
                title: false,
                position: "top",
                crossPadding: 30,
            },
        },
        label: {
            text: (d) => `${d.type}\n ${d.value}`,
            position: "outside",
        },
        tooltip: {
            title: "type",
            items: ["value"],
        },
    };

    const lineConfig = {
        theme: isDarkMode ? { type: "dark" } : { type: "light" },
        data: registrationStats,
        xField: "label",
        yField: "value",
        smooth: true,
        point: {
            size: 5,
            shape: "circle",
            style: {
                fill: "white",
                stroke: "#3B82F6",
                lineWidth: 2,
            },
        },
        color: "#3B82F6",
        scale: {
            value: { min: 0 },
        },
        height: 320,
        yAxis: {
            label: {
                formatter: (v) => v,
            },
        },
        tooltip: {
            showMarkers: true,
            title: "label",
            items: ["value"],
        },
        style: {
            lineWidth: 3,
        },
    };

    return (
        <div className="flex-1 pt-20 xl:pt-6 p-6 overflow-y-auto">
            {/* Conditional rendering with ternary (rule: rendering-conditional-render) */}
            {isLoading ? (
                <div className="fixed inset-0 z-50 xl:ml-50 flex items-center justify-center">
                    <Spin size="large" />
                </div>
            ) : null}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of system performance, game metrics, and user growth.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="w-48">
                        <ConfigProvider
                            theme={{
                                token: {
                                    colorBgContainer: isDarkMode ? "#212f4d" : "#fbfbfb",
                                    colorText: isDarkMode ? "#fff" : "#000",
                                },
                                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                            }}
                        >
                            <Select
                                size="middle"
                                value={range}
                                onChange={setRange}
                                options={[
                                    { label: "Last 7 Days", value: "7d" },
                                    { label: "Last 30 Days", value: "30d" },
                                    { label: "Last 6 Months", value: "6m" },
                                ]}
                                className="min-w-full"
                            />
                        </ConfigProvider>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl shadow-sm hover:shadow-md border border-border-light dark:border-border-dark group hover:border-primary/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Players</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{dashboardStats.totalPlayers.value.toLocaleString()}</h3>
                        </div>
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform">
                            <Users />
                        </div>
                    </div>
                    <div className="flex items-center text-sm">
                        <span className={`flex items-center font-medium mr-2 ${dashboardStats.totalPlayers.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                            <span className="text-base mr-0.5">{dashboardStats.totalPlayers.change >= 0 ? <TrendingUp /> : <TrendingDown />}</span>
                            {Math.abs(dashboardStats.totalPlayers.change)}%
                        </span>
                        <span className="text-gray-400 dark:text-gray-500">vs last period</span>
                    </div>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl shadow-sm hover:shadow-md border border-border-light dark:border-border-dark group hover:border-primary/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">New Registrations</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{dashboardStats.newUsers.value.toLocaleString()}</h3>
                        </div>
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-500 dark:text-purple-400 group-hover:scale-110 transition-transform">
                            <UserPlus />
                        </div>
                    </div>
                    <div className="flex items-center text-sm">
                        <span className={`flex items-center font-medium mr-2 ${dashboardStats.newUsers.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                            <span className="text-base mr-0.5">{dashboardStats.newUsers.change >= 0 ? <TrendingUp /> : <TrendingDown />}</span>
                            {Math.abs(dashboardStats.newUsers.change)}%
                        </span>
                        <span className="text-gray-400 dark:text-gray-500">vs last period</span>
                    </div>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl shadow-sm hover:shadow-md border border-border-light dark:border-border-dark group hover:border-primary/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Finished Games</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{dashboardStats.finishedGames.value.toLocaleString()}</h3>
                        </div>
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-500 dark:text-green-400 group-hover:scale-110 transition-transform">
                            <CheckCircle />
                        </div>
                    </div>
                    <div className="flex items-center text-sm">
                        <span className={`flex items-center font-medium mr-2 ${dashboardStats.finishedGames.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                            <span className="text-base mr-0.5">{dashboardStats.finishedGames.change >= 0 ? <TrendingUp /> : <TrendingDown />}</span>
                            {Math.abs(dashboardStats.finishedGames.change)}%
                        </span>
                        <span className="text-gray-400 dark:text-gray-500">vs last period</span>
                    </div>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl shadow-sm hover:shadow-md border border-border-light dark:border-border-dark group hover:border-primary/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Games</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{dashboardStats.activeGames.value.toLocaleString()}</h3>
                        </div>
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-500 dark:text-orange-400 group-hover:scale-110 transition-transform">
                            <Activity />
                        </div>
                    </div>
                    <div className="flex items-center text-sm">
                         <span className="text-green-500 font-medium mr-2">Live Now</span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Game Activity Overview</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Completed game sessions over time</p>
                        </div>
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <div className="flex-1"></div>
                    <div className="h-64">
                        <Suspense fallback={<div className="h-full flex items-center justify-center"><Spin /></div>}>
                            <Column {...columnConfig} />
                        </Suspense>
                    </div>
                    <div className="flex-1"></div>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6">
                     <div className="flex items-center justify-between">
                         <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Game Popularity</h3>
                            <p className="text-sm text-gray-500">Most played games (Sessions)</p>
                         </div>
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <PieChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                    <div className="h-78">
                        <Suspense fallback={<div className="h-full flex items-center justify-center"><Spin /></div>}>
                            <Pie {...pieConfig} />
                        </Suspense>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                             <h3 className="text-lg font-bold text-gray-900 dark:text-white">Player Engagement</h3>
                            <p className="text-sm text-gray-500">Achievements unlocked over time</p>
                        </div>
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                     <div className="h-74">
                        <Suspense fallback={<div className="h-full flex items-center justify-center"><Spin /></div>}>
                            <Area {...areaConfig} />
                        </Suspense>
                    </div>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6">
                     <div className="flex items-center justify-between mb-6">
                         <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">User Registrations</h3>
                            <p className="text-sm text-gray-500">New accounts created over time</p>
                         </div>
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <UserPlus className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <Suspense fallback={<div className="h-full flex items-center justify-center"><Spin /></div>}>
                            <Line {...lineConfig} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Select, ConfigProvider, theme } from "antd";
import { Column, Pie, Line } from "@ant-design/plots";
import { Gamepad2, HardDrive, Timer, UserPlus, TrendingUp, TrendingDown, Users, CheckCircle, Activity } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { userApi } from "../../api/user";
import { dashboardApi } from "../../api/dashboard";
import { li, style } from "framer-motion/client";

export const sampleAdminDashboardData = {
    stats: {
        totalPlays: 128405,
        totalPlaysChangePct: 12.5,
        newRegistrations: 2843,
        newRegistrationsChangePct: 8.2,
        avgSessionTime: "24m 15s",
        avgSessionTimeChangePct: -2.1,
        serverUptime: "99.98%",
        serverUptimeChangePct: -0.02,
    },
    chartData: null,
    pieData: [
        { type: "Player 1 Wins", value: 55 },
        { type: "Player 2 Wins", value: 30 },
        { type: "Draws", value: 15 },
    ],
    popularGames: [
        { id: "go", symbol: "GO", name: "Go / Baduk", activePlayers: 4230, avgDuration: "45m", trend: 12 },
        { id: "chess", symbol: "CH", name: "Chess", activePlayers: 3890, avgDuration: "22m", trend: 5 },
        { id: "xiangqi", symbol: "XI", name: "Xiangqi", activePlayers: 2105, avgDuration: "35m", trend: -2 },
        { id: "shogi", symbol: "SH", name: "Shogi", activePlayers: 1540, avgDuration: "55m", trend: 8 },
        { id: "backgammon", symbol: "BA", name: "Backgammon", activePlayers: 980, avgDuration: "15m", trend: 0 },
    ],
    userRegistrations: [
        { month: "June", value: 1204, percent: 45 },
        { month: "July", value: 1450, percent: 52 },
        { month: "August", value: 1890, percent: 65 },
        { month: "September", value: 1750, percent: 60 },
        { month: "October", value: 2300, percent: 82 },
        { month: "November (Current)", value: 2843, percent: 95 },
    ],
};

export default function AdminDashboardPage({ data } = {}) {
    const { isDarkMode } = useTheme();

    const dashboard = data ?? sampleAdminDashboardData;
    const [range, setRange] = useState("7d");

    const [activityData, setActivityData] = useState([]);

    useEffect(() => {
        const fetchActivityChart = async () => {
            try {
                const res = await dashboardApi.getActivityChart(range);
                if (res.success) {
                    setActivityData(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch activity chart", error);
            }
        };
        fetchActivityChart();
    }, [range]);

    const [dashboardStats, setDashboardStats] = useState({
        totalPlayers: { value: 0, change: 0 },
        newUsers: { value: 0, change: 0 },
        finishedGames: { value: 0, change: 0 },
        activeGames: { value: 0 },
    });

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const res = await dashboardApi.getStats(range);
                if (res.success) {
                    setDashboardStats(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };
        fetchDashboardStats();
    }, [range]);


    const [registrationStats, setRegistrationStats] = useState([]);

    useEffect(() => {
        const fetchRegistrationStats = async () => {
            try {
                const res = await dashboardApi.getRegistrationChart(range);
                if (res.success) {
                    setRegistrationStats(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch registration stats", error);
            }
        };
        fetchRegistrationStats();
    }, [range]);



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

    const pieData =
        dashboard.pieData ??
        useMemo(() => {
            return [
                { type: "Player 1 Wins", value: 55 },
                { type: "Player 2 Wins", value: 30 },
                { type: "Draws", value: 15 },
            ];
        }, []);

    const pieConfig = {
        theme: isDarkMode ? { type: "dark" } : { type: "light" },
        appendPadding: 8,
        data: pieData,
        angleField: "value",
        colorField: "type",
        radius: 1,
        innerRadius: 0.6,
        scale: {
            color: {
                range: ["#ec4899", "#3B82F6", "#F59E0B"],
            },
        },
        height: 220,
        tooltip: {
            title: "type",
            items: ["value"],
        },
    };

    const lineConfig = {
        theme: isDarkMode ? { type: "dark" } : { type: "light" },
        data: registrationStats.length > 0 ? registrationStats : dashboard.userRegistrations,
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
            }
        },
        color: "#3B82F6",
        scale: {
             value: { min: 0 }
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
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Game Activity Overview</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Completed game sessions over time</p>
                    <div className="flex-1"></div>
                    <div className="h-64">
                        <Column {...columnConfig} />
                    </div>
                    <div className="flex-1"></div>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Win/Loss Distribution</h3>
                    <div className="w-full">
                        <Pie {...pieConfig} />
                    </div>

                    <div className="space-y-4">
                        {pieData.map((slice) => {
                            const colorClass = slice.type === "Player 1 Wins" ? "bg-primary" : slice.type === "Player 2 Wins" ? "bg-blue-500" : "bg-yellow-400";
                            return (
                                <div className="flex items-center justify-between text-sm" key={slice.type}>
                                    <div className="flex items-center">
                                        <span className={`w-3 h-3 rounded-full ${colorClass} mr-2`}></span>
                                        <span className="text-gray-600 dark:text-gray-300">{slice.type}</span>
                                    </div>
                                    <span className="font-bold text-gray-900 dark:text-white">{slice.value}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark flex flex-col">
                    <div className="p-6 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Most Popular Games</h3>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="py-3 px-6 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Game Name</th>
                                    <th className="py-3 px-6 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 text-right">Active Players</th>
                                    <th className="py-3 px-6 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 text-right">Avg Duration</th>
                                    <th className="py-3 px-6 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 text-right">Trend</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-light dark:divide-border-dark">
                                {dashboard.popularGames.map((game) => (
                                    <tr key={game.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="py-4 px-6 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                                                {game.symbol}
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{game.name}</span>
                                        </td>
                                        <td className="py-4 px-6 text-right text-sm text-gray-600 dark:text-gray-300">{game.activePlayers.toLocaleString()}</td>
                                        <td className="py-4 px-6 text-right text-sm text-gray-600 dark:text-gray-300">{game.avgDuration}</td>
                                        <td className={`py-4 px-6 text-right text-sm ${game.trend > 0 ? "text-green-500" : game.trend < 0 ? "text-red-500" : "text-gray-500"}`}>
                                            {game.trend > 0 ? `+${game.trend}%` : `${game.trend}%`}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">User Registrations</h3>
                    <p className="text-sm text-gray-500 mb-6">New accounts created over time</p>
                    <div className="h-80 w-full">
                         <Line {...lineConfig} />
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Select, ConfigProvider, theme } from "antd";
import { Column, Pie, Line, Area } from "@ant-design/plots";
import { UserPlus, TrendingUp, TrendingDown, Users, CheckCircle, Activity, Trophy, BarChart3, PieChart } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { dashboardApi } from "../../api/dashboard";

export default function AdminDashboardPage() {
    const { isDarkMode } = useTheme();

    const [range, setRange] = useState("30d");
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
    const [popularityData, setPopularityData] = useState([]);
    const [achievementData, setAchievementData] = useState([]);

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

        const fetchPopularityChart = async () => {
            try {
                const res = await dashboardApi.getPopularityChart(range);
                if (res.success) {
                    setPopularityData(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch popularity chart", error);
            }
        };

        const fetchAchievementChart = async () => {
            try {
                const res = await dashboardApi.getAchievementChart(range);
                if (res.success) {
                    setAchievementData(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch achievement chart", error);
            }
        };

        fetchRegistrationStats();
        fetchPopularityChart();
        fetchAchievementChart();
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
                        <Column {...columnConfig} />
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
                        <Pie {...pieConfig} />
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
                        <Area {...areaConfig} />
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
                         <Line {...lineConfig} />
                    </div>
                </div>
            </div>
        </div>
    );
}

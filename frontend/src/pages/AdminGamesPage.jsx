import { BookmarkCheck, Gamepad2, Wrench, Search } from "lucide-react";
import { ConfigProvider, Input, Select, theme } from "antd";
import { useTheme } from "@/context/ThemeContext";

export default function AdminGamesPage() {
    const { isDarkTheme } = useTheme();
    return (
        <div className="flex-1 p-6 md:p-10 overflow-y-auto h-screen bg-gray-50/50 dark:bg-background-dark">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Game Catalog</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl">Manage your game library, configure rulesets, and control game availability status for players.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:border-primary/30 transition-colors">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Games</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">24</p>
                        <p className="text-xs text-gray-400 mt-1">Currently available to players</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-icons-outlined text-2xl">
                            <Gamepad2 />
                        </span>
                    </div>
                </div>
                <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:border-primary/30 transition-colors">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Maintenance</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">2</p>
                        <p className="text-xs text-orange-500 mt-1">Requires attention</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-icons-outlined text-2xl">
                            <Wrench />
                        </span>
                    </div>
                </div>
                <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:border-primary/30 transition-colors">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sessions</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">1,208</p>
                        <p className="text-xs text-gray-400 mt-1">Across all games today</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-icons-outlined text-2xl">
                            <BookmarkCheck />
                        </span>
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-surface-dark p-1 rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 mb-6 flex flex-col md:flex-row gap-2">
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: "#ec4899",
                            colorBgContainer: isDarkTheme() ? "#212f4d" : "#fbfbfb",
                            colorText: isDarkTheme() ? "#fff" : "#000",
                        },
                        algorithm: isDarkTheme() ? theme.darkAlgorithm : theme.defaultAlgorithm,
                    }}
                >
                    <div className="relative w-full md:w-96">
                        <Input value={""} onChange={(e) => {}} prefix={<Search className="p-1" />} placeholder="Search by name, email, or ID..." />
                    </div>
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
                        <Select
                            value={"all"}
                            onChange={(v) => {}}
                            options={[
                                { value: "all", label: "All Status" },
                                { value: "active", label: "Active" },
                                { value: "inactive", label: "Offline" },
                                { value: "banned", label: "Banned" },
                            ]}
                            style={{ minWidth: "120px" }}
                        />
                    </div>
                </ConfigProvider>
            </div>
            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-soft border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500 w-16 text-center">
                                    <span className="sr-only">Icon</span>
                                </th>
                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text    -gray-500">Game Details</th>
                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Board Config</th>
                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Quick Actions</th>
                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            <tr className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors group">
                                <td className="py-4 px-6">
                                    <div className="relative h-12 w-12 rounded-xl overflow-hidden shadow-sm">
                                        <img
                                            alt="Chess"
                                            className="h-full w-full object-cover"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJUnHpXaLEDiYL0jZ4AKASI5sIxn5heyR4hLm3pDRbNv78nt-vixVJZPnFWlQDixGVs1mdIiTF7p22GzoWXxjkYV5wknKBI1PTa2HT2mAxUTlM6Fud7nvgSP2MJfIC1yqrzRpYDXFLVfqYnA_UnCkA0qmMO0Q-7FS7BJ5gBHDnN5447Wf23WJGPjmDjPqpAzC5dJjn3yjm62Gl00SeReRg2vweO74wRp1gkh3J0RQ-3nLvTT523fMavlyUN_mIQU-StZlZudX3L2o"
                                        />
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">Chess</span>
                                        <span className="text-xs text-gray-500">ID: GM-001 • Classic</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            title="Decrease Size"
                                        >
                                            <span className="material-icons-outlined text-sm">remove</span>
                                        </button>
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono font-medium text-gray-700 dark:text-gray-300">8x8</span>
                                        <button
                                            className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            title="Increase Size"
                                        >
                                            <span className="material-icons-outlined text-sm">add</span>
                                        </button>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input checked="" className="sr-only peer" type="checkbox" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        <span className="ml-3 text-xs font-medium text-gray-900 dark:text-gray-300">Enabled</span>
                                    </label>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                        <button className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs font-medium text-gray-600 dark:text-gray-300">
                                            <span className="material-icons-outlined text-sm text-gray-400">tune</span>
                                            <span>Rules</span>
                                        </button>
                                        <button className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs font-medium text-gray-600 dark:text-gray-300">
                                            <span className="material-icons-outlined text-sm text-gray-400">palette</span>
                                            <span>Theme</span>
                                        </button>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <button className="text-gray-400 hover:text-primary transition-colors p-2 hover:bg-primary/5 rounded-full">
                                        <span className="material-icons-outlined">settings</span>
                                    </button>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors group">
                                <td className="py-4 px-6">
                                    <div className="relative h-12 w-12 rounded-xl overflow-hidden shadow-sm">
                                        <img
                                            alt="Go"
                                            className="h-full w-full object-cover"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJ1Ghm4WNUcB_MTEbMGPareqAxQNuCjdIU3HxvxHoKOJldCSajH8pdHu4cv9nwTuIJt3uUtfNpqeKjjQO6ytPtJbYGZsjuwtJJ8O9cXilawFQIREtm5Yc4GsWVW4dGHNo2t91XON-sM0KAGtlW4f1sDjfPtB3c-7uANnhoKZhYOtB9dE2Cq14tkQXWUZOtd_bsfzTgD1CZxWt9Vh9ioq_htn4nV6jNaXG_mV0nMsIMmh1FFgP3IrgzMZ1YPL-ezCray1FZqfflcKI"
                                        />
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">Go</span>
                                        <span className="text-xs text-gray-500">ID: GM-004 • Strategy</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            title="Decrease Size"
                                        >
                                            <span className="material-icons-outlined text-sm">remove</span>
                                        </button>
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono font-medium text-gray-700 dark:text-gray-300">19x19</span>
                                        <button
                                            className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            title="Increase Size"
                                        >
                                            <span className="material-icons-outlined text-sm">add</span>
                                        </button>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input checked="" className="sr-only peer" type="checkbox" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        <span className="ml-3 text-xs font-medium text-gray-900 dark:text-gray-300">Enabled</span>
                                    </label>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                        <button className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs font-medium text-gray-600 dark:text-gray-300">
                                            <span className="material-icons-outlined text-sm text-gray-400">tune</span>
                                            <span>Rules</span>
                                        </button>
                                        <button className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs font-medium text-gray-600 dark:text-gray-300">
                                            <span className="material-icons-outlined text-sm text-gray-400">palette</span>
                                            <span>Theme</span>
                                        </button>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <button className="text-gray-400 hover:text-primary transition-colors p-2 hover:bg-primary/5 rounded-full">
                                        <span className="material-icons-outlined">settings</span>
                                    </button>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors group">
                                <td className="py-4 px-6">
                                    <div className="relative h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 flex items-center justify-center font-bold text-lg border border-indigo-100 dark:border-indigo-800 shadow-sm">
                                        Ck
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">Checkers</span>
                                        <span className="text-xs text-gray-500">ID: GM-008 • Casual</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            title="Decrease Size"
                                        >
                                            <span className="material-icons-outlined text-sm">remove</span>
                                        </button>
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono font-medium text-gray-700 dark:text-gray-300">10x10</span>
                                        <button
                                            className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            title="Increase Size"
                                        >
                                            <span className="material-icons-outlined text-sm">add</span>
                                        </button>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input checked="" className="sr-only peer" type="checkbox" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        <span className="ml-3 text-xs font-medium text-gray-900 dark:text-gray-300">Enabled</span>
                                    </label>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                        <button className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs font-medium text-gray-600 dark:text-gray-300">
                                            <span className="material-icons-outlined text-sm text-gray-400">tune</span>
                                            <span>Rules</span>
                                        </button>
                                        <button className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs font-medium text-gray-600 dark:text-gray-300">
                                            <span className="material-icons-outlined text-sm text-gray-400">palette</span>
                                            <span>Theme</span>
                                        </button>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <button className="text-gray-400 hover:text-primary transition-colors p-2 hover:bg-primary/5 rounded-full">
                                        <span className="material-icons-outlined">settings</span>
                                    </button>
                                </td>
                            </tr>
                            <tr className="bg-gray-50/50 dark:bg-gray-800/20 hover:bg-gray-100/50 dark:hover:bg-gray-800/40 transition-colors group">
                                <td className="py-4 px-6 opacity-75">
                                    <div className="relative h-12 w-12 rounded-xl overflow-hidden shadow-sm grayscale">
                                        <img
                                            alt="Backgammon"
                                            className="h-full w-full object-cover"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTvxsogupfp4iHLU9QQW_lUgLXm8hs92okMYPCULmqFsVFuQi2MPm0onC3-aiH4Z74ljc-B5kFehJeJ1Sfty56ub4Wq8c_qKzp2iDUIamAYF-5A091GRf9YX2g_z7oscprjoGCM1c8FAxQLMirvT8WTGYCKMrse5HIfUn6TZUj3_wuvX6SaQlUQU1dD9qGx0sGCSvFImqiKHEZjV4GtViZMQXE4HMzzYdzheE9BPU0g0FJteSOeorlrnI-11K-UqfqqT9Je06hPZQ"
                                        />
                                    </div>
                                </td>
                                <td className="py-4 px-6 opacity-75">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Backgammon</span>
                                        <span className="text-xs text-gray-400">ID: GM-012 • Dice</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6 opacity-75">
                                    <div className="flex items-center gap-2">
                                        <button className="p-1 rounded text-gray-300 cursor-not-allowed" disabled="">
                                            <span className="material-icons-outlined text-sm">remove</span>
                                        </button>
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono font-medium text-gray-500">Fixed</span>
                                        <button className="p-1 rounded text-gray-300 cursor-not-allowed" disabled="">
                                            <span className="material-icons-outlined text-sm">add</span>
                                        </button>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input className="sr-only peer" type="checkbox" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        <span className="ml-3 text-xs font-medium text-gray-500">Disabled</span>
                                    </label>
                                </td>
                                <td className="py-4 px-6 opacity-75">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 italic">Maintenance Mode</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <button className="text-gray-400 hover:text-primary transition-colors p-2 hover:bg-primary/5 rounded-full">
                                        <span className="material-icons-outlined">settings</span>
                                    </button>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors group">
                                <td className="py-4 px-6">
                                    <div className="relative h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center font-bold text-lg border border-amber-100 dark:border-amber-800 shadow-sm">
                                        C4
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">Connect 4</span>
                                        <span className="text-xs text-gray-500">ID: GM-003 • Arcade</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            title="Decrease Size"
                                        >
                                            <span className="material-icons-outlined text-sm">remove</span>
                                        </button>
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono font-medium text-gray-700 dark:text-gray-300">7x6</span>
                                        <button
                                            className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            title="Increase Size"
                                        >
                                            <span className="material-icons-outlined text-sm">add</span>
                                        </button>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input checked="" className="sr-only peer" type="checkbox" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        <span className="ml-3 text-xs font-medium text-gray-900 dark:text-gray-300">Enabled</span>
                                    </label>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                        <button className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs font-medium text-gray-600 dark:text-gray-300">
                                            <span className="material-icons-outlined text-sm text-gray-400">tune</span>
                                            <span>Rules</span>
                                        </button>
                                        <button className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs font-medium text-gray-600 dark:text-gray-300">
                                            <span className="material-icons-outlined text-sm text-gray-400">palette</span>
                                            <span>Theme</span>
                                        </button>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <button className="text-gray-400 hover:text-primary transition-colors p-2 hover:bg-primary/5 rounded-full">
                                        <span className="material-icons-outlined">settings</span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-surface-dark">
                    <span className="text-sm text-gray-500">Showing 1-5 of 24 games</span>
                    <div className="flex items-center space-x-2">
                        <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 disabled:opacity-50">
                            <span className="material-icons-outlined text-sm">chevron_left</span>
                        </button>
                        <button className="px-3 py-1 rounded-lg bg-primary text-white text-sm font-medium">1</button>
                        <button className="px-3 py-1 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium">2</button>
                        <button className="px-3 py-1 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium">3</button>
                        <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500">
                            <span className="material-icons-outlined text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

}
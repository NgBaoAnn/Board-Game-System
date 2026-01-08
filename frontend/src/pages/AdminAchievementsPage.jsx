import { Award, Zap, Search, Trophy, Brain, Sword, Plus, PlusSquare, TrendingUp, CheckCircle, Wrench, Edit, Trash, ChevronLeft, ChevronRight } from "lucide-react";

export default function AchievementsPage() {
    return (
        <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">Achievement Management</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Create, edit, and manage achievements for all games.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white hover:bg-primary-hover rounded-lg text-sm font-medium transition-colors shadow-sm shadow-primary/20">
                        <Plus className="text-xl" />
                        <span>Add Achievement</span>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex flex-col justify-between h-28 relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Achievements</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">124</p>
                    </div>
                    <div className="absolute right-3 top-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-500 dark:text-purple-400">
                        <PlusSquare />
                    </div>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex flex-col justify-between h-28 relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">112</p>
                        <p className="text-xs text-green-600 mt-1 flex items-center">
                            <TrendingUp className="text-sm mr-1" /> +3 this week
                        </p>
                    </div>
                    <div className="absolute right-3 top-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-500 dark:text-green-400">
                        <CheckCircle />
                    </div>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex flex-col justify-between h-28 relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total XP Value</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">185k</p>
                    </div>
                    <div className="absolute right-3 top-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-500 dark:text-blue-400">
                        <Zap />
                    </div>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex flex-col justify-between h-28 relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User Unlocks</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">14.2k</p>
                    </div>
                    <div className="absolute right-3 top-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-yellow-500 dark:text-yellow-400">
                        <Award />
                    </div>
                </div>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark mb-6">
                <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-light dark:border-border-dark">
                    <div className="relative w-full md:w-96">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="text-gray-400" />
                        </span>
                        <input
                            className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-shadow"
                            placeholder="Search achievements by name or ID..."
                            type="text"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex bg-gray-50 dark:bg-gray-800 p-1 rounded-lg">
                            <button className="px-4 py-1.5 rounded-md bg-white dark:bg-gray-700 text-sm font-medium text-gray-900 dark:text-white shadow-sm transition-all">All</button>
                            <button className="px-4 py-1.5 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all">Active</button>
                            <button className="px-4 py-1.5 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all">Draft</button>
                        </div>
                        <select className="form-select bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm text-gray-700 dark:text-gray-300 py-2.5 pl-3 pr-8 focus:ring-2 focus:ring-primary/50 cursor-pointer">
                            <option>Game: All Games</option>
                            <option>Game: Chess Master</option>
                            <option>Game: Space Explorer</option>
                        </select>
                    </div>
                </div>
                <div className="p-6 bg-gray-50/50 dark:bg-gray-900/30 min-h-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow group">
                            <div className="p-5 flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                                        <Trophy className="text-2xl" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 uppercase">
                                            Common
                                        </span>
                                        <span className="w-2 h-2 rounded-full bg-green-500" title="Active"></span>
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">First Victory</h3>
                                <p className="text-xs text-gray-400 font-mono mb-2">ID: ACH_001</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">Win your first game in any category. This is the onboarding achievement.</p>
                                <div className="space-y-2 mb-2">
                                    <div className="flex justify-between text-xs border-b border-gray-100 dark:border-gray-700 pb-2">
                                        <span className="text-gray-500">XP Reward</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">100 XP</span>
                                    </div>
                                    <div className="flex justify-between text-xs pb-1">
                                        <span className="text-gray-500">Condition</span>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">WinCount &gt;= 1</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-between items-center">
                                <span className="text-xs text-gray-400">Updated: Oct 12, 2023</span>
                                <div className="flex gap-2">
                                    <button className="p-1.5 text-gray-500 hover:text-primary hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors" title="Edit">
                                        <Edit className="text-lg" />
                                    </button>
                                    <button className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors" title="Delete">
                                        <Trash className="text-lg" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow group">
                            <div className="p-5 flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Brain className="text-2xl" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-100 dark:border-blue-800 uppercase">
                                            Rare
                                        </span>
                                        <span className="w-2 h-2 rounded-full bg-green-500" title="Active"></span>
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Master Strategist</h3>
                                <p className="text-xs text-gray-400 font-mono mb-2">ID: ACH_042</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">Win a game without losing more than 2 units. Requires advanced gameplay validation.</p>
                                <div className="space-y-2 mb-2">
                                    <div className="flex justify-between text-xs border-b border-gray-100 dark:border-gray-700 pb-2">
                                        <span className="text-gray-500">XP Reward</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">500 XP</span>
                                    </div>
                                    <div className="flex justify-between text-xs pb-1">
                                        <span className="text-gray-500">Condition</span>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">UnitLoss &lt;= 2 &amp;&amp; Win</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-between items-center">
                                <span className="text-xs text-gray-400">Updated: Nov 05, 2023</span>
                                <div className="flex gap-2">
                                    <button className="p-1.5 text-gray-500 hover:text-primary hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors" title="Edit">
                                        <Edit className="text-lg" />
                                    </button>
                                    <button className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors" title="Delete">
                                        <Trash className="text-lg" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow group opacity-75">
                            <div className="p-5 flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                        <Wrench className="text-2xl" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-100 dark:border-purple-800 uppercase">
                                            Epic
                                        </span>
                                        <span className="w-2 h-2 rounded-full bg-gray-400" title="Draft / Inactive"></span>
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Peacekeeper (Draft)</h3>
                                <p className="text-xs text-gray-400 font-mono mb-2">ID: ACH_099_DRAFT</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">Win a game through diplomacy victory condition. Currently balancing the XP reward.</p>
                                <div className="space-y-2 mb-2">
                                    <div className="flex justify-between text-xs border-b border-gray-100 dark:border-gray-700 pb-2">
                                        <span className="text-gray-500">XP Reward</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">1000 XP</span>
                                    </div>
                                    <div className="flex justify-between text-xs pb-1">
                                        <span className="text-gray-500">Condition</span>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">VictoryType == 'Diplomacy'</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-between items-center">
                                <span className="text-xs text-gray-400">Created: 2 days ago</span>
                                <div className="flex gap-2">
                                    <button className="p-1.5 text-gray-500 hover:text-primary hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors" title="Edit">
                                        <Edit className="text-lg" />
                                    </button>
                                    <button className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors" title="Delete">
                                        <Trash className="text-lg" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow group">
                            <div className="p-5 flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                        <Sword className="text-2xl" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-50 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300 border border-orange-100 dark:border-orange-800 uppercase">
                                            Legendary
                                        </span>
                                        <span className="w-2 h-2 rounded-full bg-green-500" title="Active"></span>
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Grand Veteran</h3>
                                <p className="text-xs text-gray-400 font-mono mb-2">ID: ACH_100</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">Play 1000 total matches across all game types. The ultimate grinder achievement.</p>
                                <div className="space-y-2 mb-2">
                                    <div className="flex justify-between text-xs border-b border-gray-100 dark:border-gray-700 pb-2">
                                        <span className="text-gray-500">XP Reward</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">5000 XP</span>
                                    </div>
                                    <div className="flex justify-between text-xs pb-1">
                                        <span className="text-gray-500">Condition</span>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">TotalGames &gt;= 1000</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-between items-center">
                                <span className="text-xs text-gray-400">Updated: Dec 15, 2023</span>
                                <div className="flex gap-2">
                                    <button className="p-1.5 text-gray-500 hover:text-primary hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors" title="Edit">
                                        <Edit className="text-lg" />
                                    </button>
                                    <button className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors" title="Delete">
                                        <Trash className="text-lg" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center mt-8">
                        <nav className="flex items-center space-x-2">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800">
                                <ChevronLeft className="text-sm" />
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-medium text-sm">1</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-sm">
                                2
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-sm">
                                3
                            </button>
                            <span className="text-gray-400">...</span>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800">
                                <ChevronRight className="text-sm" />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Share2, Award, PieChart, Zap, Diamond, Search, Trophy, Brain, Users, Book, Clock, Sword, Crown, Handshake } from "lucide-react";

export default function AchievementsPage() {
    return (
        <div className="flex-1 pt-20 xl:pt-6 p-6 overflow-y-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        My Achievements
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Track your progress and showcase your gaming milestones.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex items-center justify-between relative overflow-hidden group hover:border-primary/50 transition-colors">
                    <div className="relative z-10">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Earned</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            42 <span className="text-sm font-normal text-gray-400">/ 85</span>
                        </p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-500 dark:text-purple-400 relative z-10">
                        <Award />
                    </div>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex items-center justify-between relative overflow-hidden group hover:border-primary/50 transition-colors">
                    <div className="relative z-10">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Completion Rate</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">49%</p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-500 dark:text-blue-400 relative z-10">
                        <PieChart />
                    </div>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex items-center justify-between relative overflow-hidden group hover:border-primary/50 transition-colors">
                    <div className="relative z-10">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total XP</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">12.5k</p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-500 dark:text-green-400 relative z-10">
                        <Zap />
                    </div>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex items-center justify-between relative overflow-hidden group hover:border-primary/50 transition-colors">
                    <div className="relative z-10">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rarest Badge</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white mt-1 truncate max-w-[120px]" title="Grand Strategist">
                            Grand Strategist
                        </p>
                    </div>
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-yellow-500 dark:text-yellow-400 relative z-10">
                        <Diamond />
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
                            placeholder="Search achievements..."
                            type="text"
                        />
                    </div>
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
                        <div className="flex bg-gray-50 dark:bg-gray-800 p-1 rounded-lg">
                            <button className="px-4 py-1.5 rounded-md bg-white dark:bg-gray-700 text-sm font-medium text-gray-900 dark:text-white shadow-sm transition-all">All</button>
                            <button className="px-4 py-1.5 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all">Earned</button>
                            <button className="px-4 py-1.5 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all">Locked</button>
                        </div>
                        <select className="form-select bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm text-gray-700 dark:text-gray-300 py-2.5 pl-3 pr-10 focus:ring-2 focus:ring-primary/50 cursor-pointer">
                            <option>Sort by Date</option>
                            <option>Sort by Rarity</option>
                            <option>Sort by Name</option>
                        </select>
                    </div>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <div className="flex flex-col p-5 bg-white dark:bg-gray-800/50 rounded-xl border border-border-light dark:border-border-dark hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white shadow-sm ring-4 ring-yellow-50 dark:ring-yellow-900/20">
                                    <Trophy className="text-2xl" />
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                                    Earned
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">First Victory</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">Win your first game in any category.</p>
                            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs">
                                <span className="text-gray-400">Earned on Oct 12, 2023</span>
                                <span className="font-semibold text-primary">+100 XP</span>
                            </div>
                        </div>
                        <div className="flex flex-col p-5 bg-white dark:bg-gray-800/50 rounded-xl border border-border-light dark:border-border-dark hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white shadow-sm ring-4 ring-blue-50 dark:ring-blue-900/20">
                                    <Brain className="text-2xl" />
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                                    Earned
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Master Strategist</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">Win a game without losing more than 2 units.</p>
                            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs">
                                <span className="text-gray-400">Earned on Nov 05, 2023</span>
                                <span className="font-semibold text-primary">+500 XP</span>
                            </div>
                        </div>
                        <div className="flex flex-col p-5 bg-white dark:bg-gray-800/50 rounded-xl border border-border-light dark:border-border-dark hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white shadow-sm ring-4 ring-pink-50 dark:ring-pink-900/20">
                                    <Users className="text-2xl" />
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                                    Earned
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Social Butterfly</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">Add 10 friends to your friends list.</p>
                            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs">
                                <span className="text-gray-400">Earned on Dec 01, 2023</span>
                                <span className="font-semibold text-primary">+200 XP</span>
                            </div>
                        </div>
                        <div className="flex flex-col p-5 bg-gray-50 dark:bg-gray-800/20 rounded-xl border border-border-light dark:border-border-dark opacity-90 hover:opacity-100 transition-opacity">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                    <Book className="text-2xl" />
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                                    Locked
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-700 dark:text-gray-300 text-lg">Collector</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">Play 50 different board games.</p>
                            <div className="mt-auto">
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    <span>Progress</span>
                                    <span>32 / 50</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full w-[64%]"></div>
                                </div>
                                <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                                    <span className="text-xs font-semibold text-gray-400">+1000 XP</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col p-5 bg-gray-50 dark:bg-gray-800/20 rounded-xl border border-border-light dark:border-border-dark opacity-90 hover:opacity-100 transition-opacity">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                    <Clock className="text-2xl" />
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                                    Locked
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-700 dark:text-gray-300 text-lg">Speedster</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">Finish a game in under 10 minutes.</p>
                            <div className="mt-auto">
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    <span>Best Time</span>
                                    <span>12m 30s / 10m</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full w-[80%]"></div>
                                </div>
                                <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                                    <span className="text-xs font-semibold text-gray-400">+300 XP</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col p-5 bg-gray-50 dark:bg-gray-800/20 rounded-xl border border-border-light dark:border-border-dark opacity-90 hover:opacity-100 transition-opacity">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                    <Sword className="text-2xl" />
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                                    Locked
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-700 dark:text-gray-300 text-lg">Veteran</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">Play 1000 total matches.</p>
                            <div className="mt-auto">
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    <span>Progress</span>
                                    <span>145 / 1000</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full w-[14.5%]"></div>
                                </div>
                                <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                                    <span className="text-xs font-semibold text-gray-400">+5000 XP</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col p-5 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-xl border border-yellow-200 dark:border-yellow-900/30 hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className="absolute -right-6 -top-6 text-yellow-500/10">
                                <Crown className="text-9xl" />
                            </div>
                            <div className="flex items-start justify-between mb-4 relative z-10">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg ring-4 ring-purple-100 dark:ring-purple-900/30">
                                    <Crown className="text-2xl" />
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-sm"> Rare </span>
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg relative z-10">Undefeated</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-4 relative z-10">Win 10 games in a row in Ranked mode.</p>
                            <div className="mt-auto pt-4 border-t border-yellow-200 dark:border-yellow-900/30 flex items-center justify-between text-xs relative z-10">
                                <span className="text-yellow-700 dark:text-yellow-500 font-medium">Earned on Jan 15, 2024</span>
                                <span className="font-bold text-primary">+2000 XP</span>
                            </div>
                        </div>
                        <div className="flex flex-col p-5 bg-gray-50 dark:bg-gray-800/20 rounded-xl border border-border-light dark:border-border-dark opacity-90 hover:opacity-100 transition-opacity">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                    <Handshake className="text-2xl" />
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                                    Locked
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-700 dark:text-gray-300 text-lg">Peacekeeper</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">Win a game through diplomacy victory condition.</p>
                            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs">
                                <span className="text-gray-400">Locked</span>
                                <span className="text-xs font-semibold text-gray-400">+500 XP</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center mt-8">
                        <button className="px-6 py-2.5 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                            Load More Achievements
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

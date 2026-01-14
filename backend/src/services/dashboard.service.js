const userRepo = require("../repositories/user.repo");
const gameRepo = require("../repositories/game.repo");
const achievementRepo = require("../repositories/achievement.repo");

class DashboardService {
    async getStats(filter) {
        const { currentRange, previousRange } = this.calculateRanges(filter);

        const [
            totalPlayersNow,
            totalPlayersPrev,
            newUsersCurrent,
            newUsersPrev,
            finishedGamesCurrent,
            finishedGamesPrev,
            activeGames,
        ] = await Promise.all([
            userRepo.countTotalPlayers(currentRange.end),
            userRepo.countTotalPlayers(previousRange.end),
            userRepo.countNewUsers(currentRange.start, currentRange.end),
            userRepo.countNewUsers(previousRange.start, previousRange.end),
            gameRepo.countFinishedSessions({ startDate: currentRange.start, endDate: currentRange.end }),
            gameRepo.countFinishedSessions({ startDate: previousRange.start, endDate: previousRange.end }),
            gameRepo.countActiveSessions(),
        ]);

        return {
            totalPlayers: {
                value: totalPlayersNow,
                change: this.calculatePercentageChange(totalPlayersNow, totalPlayersPrev),
            },
            newUsers: {
                value: newUsersCurrent,
                change: this.calculatePercentageChange(newUsersCurrent, newUsersPrev),
            },
            finishedGames: {
                value: finishedGamesCurrent,
                change: this.calculatePercentageChange(
                    finishedGamesCurrent,
                    finishedGamesPrev
                ),
            },
            activeGames: {
                value: activeGames,
            },
        };
    }

    calculateRanges(filter) {
        const now = new Date();
        let currentStart = new Date(now);
        let previousStart = new Date(now);

        // "7d", "30d", "6m"
        // Default to 7d
        let days = 7;
        if (filter === "30d") days = 30;
        if (filter === "6m") days = 180; // Approx 6 months

        currentStart.setDate(now.getDate() - days);
        previousStart.setDate(now.getDate() - days * 2);

        return {
            currentRange: {
                start: currentStart,
                end: now,
            },
            previousRange: {
                start: previousStart,
                end: currentStart,
            },
        };
    }

    calculatePercentageChange(current, previous) {
        if (previous === 0) return current > 0 ? 100 : 0;
        const change = ((current - previous) / previous) * 100;
        return parseFloat(change.toFixed(2));
    }

    async getActivityChart(filter) {
        const rawStats = await gameRepo.getGamePlayStats(filter);
        const chartData = [];
        const now = new Date();

        // 7d: Last 7 days (including today)
        if (filter === "7d" || !filter) {
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(now.getDate() - i);
                const day = date.getDate();

                chartData.push({
                    label: date.toLocaleDateString("en-US", { weekday: "short" }),
                    value: rawStats[day.toString()] || 0,
                });
            }
        }
        // 30d: Last 30 days
        else if (filter === "30d") {
            for (let i = 29; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(now.getDate() - i);
                const day = date.getDate();

                chartData.push({
                    label: day.toString(),
                    value: rawStats[day.toString()] || 0,
                });
            }
        }
        // 6m: Last 6 months
        else if (filter === "6m") {
            for (let i = 5; i >= 0; i--) {
                const date = new Date(now);
                date.setMonth(now.getMonth() - i);
                const month = date.getMonth() + 1;

                chartData.push({
                    label: date.toLocaleDateString("en-US", { month: "short" }),
                    value: rawStats[month.toString()] || 0,
                });
            }
        }

        return chartData;
    }

    async getRegistrationChart(filter) {
        const rawStats = await userRepo.getUserRegistrationStats(filter);
        const chartData = [];
        const now = new Date();

        if (filter === "7d" || !filter) {
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(now.getDate() - i);
                const day = date.getDate();

                chartData.push({
                    label: date.toLocaleDateString("en-US", { weekday: "short" }),
                    value: rawStats[day.toString()] || 0,
                });
            }
        } else if (filter === "30d") {
            for (let i = 29; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(now.getDate() - i);
                const day = date.getDate();

                chartData.push({
                    label: day.toString(),
                    value: rawStats[day.toString()] || 0,
                });
            }
        } else if (filter === "6m") {
            for (let i = 5; i >= 0; i--) {
                const date = new Date(now);
                date.setMonth(now.getMonth() - i);
                const month = date.getMonth() + 1;

                chartData.push({
                    label: date.toLocaleDateString("en-US", { month: "short" }),
                    value: rawStats[month.toString()] || 0,
                });
            }
        }

        return chartData;
    }

    async getPopularityChart(filter) {
        const activities = await gameRepo.getGameActivity(filter);
        const topGames = activities.slice(0, 10);
        const chartData = topGames.map(item => ({
            type: item.name,
            value: item.total_sessions
        }));

        // If no data check
        if (chartData.length === 0) {
            return [];
        }

        return chartData;
    }

    async getAchievementChart(filter) {
        const stats = await achievementRepo.getAchievementStats(filter);
        const chartData = [];
        let sortedKeys = [];
        const now = new Date();

        if (filter === "7d") {
            const startDate = new Date(now);
            startDate.setDate(now.getDate() - 6);
            for (let i = 0; i < 7; i++) {
                const d = new Date(startDate);
                d.setDate(startDate.getDate() + i);
                sortedKeys.push(d.getDate().toString());
            }

            sortedKeys.forEach(key => {
                const val = stats[key] || 0;

                // Find the Date object for this key to get Weekday
                let matchedDate = new Date();
                for (let k = 6; k >= 0; k--) {
                    let temp = new Date();
                    temp.setDate(temp.getDate() - k);
                    if (temp.getDate().toString() === key) {
                        matchedDate = temp;
                        break;
                    }
                }

                chartData.push({
                    label: matchedDate.toLocaleDateString("en-US", { weekday: "short" }),
                    value: val
                });
            });

        } else if (filter === "30d") {
            const startDate = new Date(now);
            startDate.setDate(now.getDate() - 29);
            for (let i = 0; i < 30; i++) {
                const d = new Date(startDate);
                d.setDate(startDate.getDate() + i);
                sortedKeys.push(d.getDate().toString());
            }

            sortedKeys.forEach(key => {
                chartData.push({
                    label: key,
                    value: stats[key] || 0
                });
            });
        } else if (filter === "6m") {
            const startDate = new Date(now);
            startDate.setMonth(now.getMonth() - 5);
            for (let i = 0; i < 6; i++) {
                const d = new Date(startDate);
                d.setMonth(startDate.getMonth() + i);
                sortedKeys.push((d.getMonth() + 1).toString());
            }

            sortedKeys.forEach(key => {
                // Reconstruct date for label
                const d = new Date();
                d.setMonth(parseInt(key) - 1);

                chartData.push({
                    label: d.toLocaleDateString("en-US", { month: "short" }),
                    value: stats[key] || 0
                });
            });
        }

        return chartData;
    }
}

module.exports = new DashboardService();

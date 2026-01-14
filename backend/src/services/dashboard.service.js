const userRepo = require("../repositories/user.repo");
const gameRepo = require("../repositories/game.repo");

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
            gameRepo.countFinishedSessions(currentRange),
            gameRepo.countFinishedSessions(previousRange),
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
                    label: date.toLocaleDateString("en-US", { weekday: "long" }),
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
                    label: date.toLocaleDateString("en-US", { month: "long" }),
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
                    label: date.toLocaleDateString("en-US", { weekday: "long" }),
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
                    label: date.toLocaleDateString("en-US", { month: "long" }),
                    value: rawStats[month.toString()] || 0,
                });
            }
        }

        return chartData;
    }
}

module.exports = new DashboardService();

const dashboardService = require("../services/dashboard.service");
const ResponseHandler = require("../utils/response-handler");
const HTTP_STATUS = require("../constants/http-status");

class DashboardController {
    async getStats(req, res, next) {
        try {
            const { filter } = req.query;
            const stats = await dashboardService.getStats(filter);
            return ResponseHandler.success(res, {
                status: HTTP_STATUS.OK,
                message: "Get dashboard stats successfully!",
                data: stats,
            });
        } catch (err) {
            next(err);
        }
    }

    async getActivityChart(req, res, next) {
        try {
            const { filter } = req.query;
            const data = await dashboardService.getActivityChart(filter);
            return ResponseHandler.success(res, {
                status: HTTP_STATUS.OK,
                message: "Get activity chart successfully!",
                data,
            });
        } catch (err) {
            next(err);
        }
    }

    async getRegistrationChart(req, res, next) {
        try {
            const { filter } = req.query;
            const data = await dashboardService.getRegistrationChart(filter);
            return ResponseHandler.success(res, {
                status: HTTP_STATUS.OK,
                message: "Get registration chart successfully!",
                data,
            });
        } catch (err) {
            next(err);
        }
    }

    async getPopularityChart(req, res, next) {
        try {
            const { filter } = req.query;
            const data = await dashboardService.getPopularityChart(filter);
            return ResponseHandler.success(res, {
                status: HTTP_STATUS.OK,
                message: "Get popularity chart successfully!",
                data,
            });
        } catch (err) {
            next(err);
        }
    }

    async getAchievementChart(req, res, next) {
        try {
            const { filter } = req.query;
            const data = await dashboardService.getAchievementChart(filter);
            return ResponseHandler.success(res, {
                status: HTTP_STATUS.OK,
                message: "Get achievement chart successfully!",
                data,
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new DashboardController();

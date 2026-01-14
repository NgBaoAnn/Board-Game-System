const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const ROLE = require("../constants/role");

router.get(
    "/stats",
    authMiddleware.authorize([ROLE.ADMIN]),
    dashboardController.getStats
);

router.get(
    "/activity-chart",
    authMiddleware.authorize([ROLE.ADMIN]),
    dashboardController.getActivityChart
);

router.get(
    "/registration-chart",
    authMiddleware.authorize([ROLE.ADMIN]),
    dashboardController.getRegistrationChart
);

module.exports = router;

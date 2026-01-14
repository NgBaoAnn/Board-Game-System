const express = require("express");
const router = express.Router();
const achievementController = require("../controllers/achievement.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validateMiddleware = require("../middlewares/validate.middleware");
const AchievementValidator = require("../validators/achievement.validator");
const ROLE = require("../constants/role");

// tạo 1 thành tựu mới - admin
router.post(
  "/achievement",
  authMiddleware.authenticate,
  authMiddleware.authorize([ROLE.ADMIN]),
  AchievementValidator.createAchievement(),
  validateMiddleware,
  achievementController.createAchievement
);

// cập nhật thành tựu - admin
router.put(
  "/achievement/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize([ROLE.ADMIN]),
  AchievementValidator.updateAchievement(),
  validateMiddleware,
  achievementController.updateAchievement
);

// xoá thành tựu - admin
router.delete(
  "/achievement/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize([ROLE.ADMIN]),
  AchievementValidator.deleteAchievement(),
  validateMiddleware,
  achievementController.deleteAchievement
);

// Admin: lấy danh sách thành tựu (phân trang, search)
router.get(
  "/achievements",
  authMiddleware.authenticate,
  authMiddleware.authorize([ROLE.ADMIN]),
  achievementController.getAllAchievements
);

// lấy thông tin chi tiết của thành tựu
router.get(
  "/achievement/:id",
  AchievementValidator.getAchievementById(),
  validateMiddleware,
  achievementController.getAchievementById
);

// lấy tất cả thành tựu của game
router.get(
  "/achievements/:game_id",
  AchievementValidator.getAchievementsByGameId(),
  validateMiddleware,
  achievementController.getAchievementsByGameId
);

// lấy tất cả thành tựu của user (không phân biệt game) - PHẢI đặt trước route :game_id/:user_id
router.get(
  "/achievements/user/:user_id",
  achievementController.getAllUserAchievements
);

// lấy tất cả thành tựu của game của user
router.get(
  "/achievements/:game_id/:user_id",
  AchievementValidator.getUserAchievementsByGameId(),
  validateMiddleware,
  achievementController.getUserAchievementsByGameId
);

module.exports = router;

const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const uploadController = require("../controllers/upload.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post(
  "/avatar",
  authMiddleware.authenticate,
  upload.single("image"),
  uploadController.uploadAvatar
);

router.post(
  "/game-image",
  authMiddleware.authenticate,
  upload.single("image"),
  uploadController.uploadGameImage
);

module.exports = router;

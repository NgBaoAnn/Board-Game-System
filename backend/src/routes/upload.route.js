const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const uploadController = require("../controllers/upload.controller");

router.post("/avatar", upload.single("image"), uploadController.uploadAvatar);

router.post(
  "/game-image",
  upload.single("image"),
  uploadController.uploadGameImage
);

module.exports = router;

const express = require("express");
const router = express.Router();

// tạo 1 thành tựu mới - admin
router.post("/achievement");

// cập nhật thành tựu - admin
router.put("/achievement/:id");

// xoá thành tựu - admin
router.delete("/achievement/:id");

// lấy thông tin chi tiết của thành tựu
router.get("/achievement/:id");

// lấy tất cả thành tựu của game
router.get("/achievements/:game_id");

// lấy tất cả thành tựu của game của user
router.get("/achievements/:game_id/:user_id");

module.exports = router;

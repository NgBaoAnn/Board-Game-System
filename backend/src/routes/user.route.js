const express = require("express");
const userController = require("../controllers/user.controller");
const router = express.Router();

router.post("/users", userController.createUser);
router.get("/users/:id", userController.getUser);
router.put("/users/:id", userController.updateUser);
router.get("/users", userController.getAllUsers);
router.delete("/users/:id", userController.deleteUser);

module.exports = router;

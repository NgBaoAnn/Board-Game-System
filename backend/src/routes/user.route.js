const express = require("express");
const router = express.Router();
const userValidator = require("../validators/user.validator");
const authMiddleware = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");
const ROLE = require("../constants/role");

router.post(
  "/users",
  userValidator.create(),
  authMiddleware.authorize([ROLE.ADMIN]),
  userController.createUser
);

router.get(
  "/users/:id",
  userValidator.getById(),
  authMiddleware.authorize([ROLE.ADMIN]),
  userController.getUser
);

router.put(
  "/users/:id",
  userValidator.update(),
  authMiddleware.authorize([ROLE.ADMIN]),
  userController.updateUser
);

router.get(
  "/users",
  authMiddleware.authorize([ROLE.ADMIN]),
  userController.getAllUsers
);

router.delete(
  "/users/:id",
  userValidator.delete(),
  authMiddleware.authorize([ROLE.ADMIN]),
  userController.deleteUser
);

module.exports = router;

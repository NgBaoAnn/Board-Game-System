const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversation.controller");

router.get("/conversations", conversationController.getConversationUser);
router.get("/conversations/:id", conversationController.getDetailConversation);

module.exports = router;

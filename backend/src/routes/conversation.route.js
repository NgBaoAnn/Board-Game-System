const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversation.controller");

router.get("/conversations", conversationController.getConversationUser);

router.post("/conversations", conversationController.getOrCreateConversation);

router.get("/conversations/:id", conversationController.getDetailConversation);

router.get("/conversations/:id/messages", conversationController.getMessages);

router.post("/conversations/:id/messages", conversationController.sendMessage);

// router.delete("/conversations/:id", conversationController.deleteConversation);

module.exports = router;

const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversation.controller");
const upload = require("../middlewares/upload.middleware");

router.get("/conversations", conversationController.getConversationUser);

router.post("/conversations", conversationController.getOrCreateConversation);

router.get("/conversations/:id", conversationController.getDetailConversation);

router.get("/conversations/:id/messages", conversationController.getMessages);

// Send message with optional file attachment
router.post(
  "/conversations/:id/messages",
  upload.single("file"),
  conversationController.sendMessage
);

// React to a message
router.patch("/messages/:messageId/reaction", conversationController.reactToMessage);

// router.delete("/conversations/:id", conversationController.deleteConversation);

module.exports = router;

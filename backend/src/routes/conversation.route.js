const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversation.controller");
const upload = require("../middlewares/upload.middleware");

// Get total unread message count (must be before :id routes)
router.get("/conversations/unread-count", conversationController.getUnreadCount);

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

// Mark conversation messages as read
router.post("/conversations/:id/read", conversationController.markAsRead);

// React to a message
router.patch("/messages/:messageId/reaction", conversationController.reactToMessage);

// router.delete("/conversations/:id", conversationController.deleteConversation);

module.exports = router;

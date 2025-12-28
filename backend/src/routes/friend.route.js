const express = require("express");
const router = express.Router();
const friendController = require("../controllers/friend.controller");

router.post("/friends/request", friendController.sendRequest);
router.get("/friends/requests/received", friendController.getReceivedRequests);
router.get("/friends/requests/sent", friendController.getSentRequests);
router.patch("/friends/requests/:id/accept", friendController.acceptRequest);
router.patch("/friends/requests/:id/decline", friendController.declineRequest);
router.get("/friends", friendController.getFriends);
router.delete("/friends/:friendId", friendController.removeFriend);

module.exports = router;

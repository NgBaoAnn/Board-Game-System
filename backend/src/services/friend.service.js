const DuplicateError = require("../errors/duplicate.exception");
const ForbiddenError = require("../errors/forbidden.exception");
const NotFoundError = require("../errors/notfound.exception");
const friendRepo = require("../repositories/friend.repo");
const userRepo = require("../repositories/user.repo");

class FriendService {
  async sendRequest({ from, to, message }) {
    if (from == to) {
      throw new DuplicateError("Can not send friend request to yourself!");
    }

    const isExisting = await userRepo.findById(to);
    if (!isExisting) {
      throw new NotFoundError("User not found to send friend request!");
    }

    let userA = from.toString();
    let userB = to.toString();

    if (userA > userB) {
      [userA, userB] = [userB, userA];
    }

    const alreadyFriend = await friendRepo.findFriendPair(userA, userB);
    if (alreadyFriend) {
      throw new DuplicateError("You are already friends!");
    }
    const existingRequest = await friendRepo.findExistingRequest(from, to);

    if (existingRequest) {
      if (existingRequest.from === to && existingRequest.to === from) {
        await friendRepo.acceptRequest({
          requestId: existingRequest.id,
          userA,
          userB,
        });

        return {
          message: "Friend request accepted automatically",
        };
      }

      throw new DuplicateError("Friend request already exists!");
    }

    await friendRepo.createRequest({
      from,
      to,
      message,
    });

    return {
      message: "Friend request sent!",
    };
  }

  async getReceivedRequests({ userId, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      friendRepo.getReceivedRequests({ userId, offset, limit }),
      friendRepo.countReceivedRequests(userId),
    ]);

    return {
      data: requests,
      pagination: {
        page,
        limit,
        total: Number(total.total),
      },
    };
  }

  async getSentRequests({ userId, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      friendRepo.getSentRequests({ userId, offset, limit }),
      friendRepo.countSentRequests(userId),
    ]);

    return {
      data: requests,
      pagination: {
        page,
        limit,
        total: Number(total.total),
      },
    };
  }

  async acceptRequest({ userId, requestId }) {
    const request = await friendRepo.findRequestById(requestId);
    if (!request) {
      throw new NotFoundError("Friend request not found!");
    }

    if (request.to !== userId) {
      throw new ForbiddenError("You are not allowed to accept this request!");
    }

    let userA = request.from.toString();
    let userB = request.to.toString();

    if (userA > userB) {
      [userA, userB] = [userB, userA];
    }

    await friendRepo.acceptRequest({
      requestId,
      userA,
      userB,
    });

    return { message: "Friend request accepted" };
  }

  async declineRequest({ userId, requestId }) {
    const request = await friendRepo.findRequestById(requestId);
    if (!request) {
      throw new NotFoundError("Friend request not found!");
    }

    if (request.to !== userId) {
      throw new ForbiddenError("You are not allowed to decline this request!");
    }

    await friendRepo.removeRequest(requestId);

    return { message: "Friend request declined" };
  }

  async getFriends({ userId, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const [friends, total] = await Promise.all([
      friendRepo.getFriends({ userId, offset, limit }),
      friendRepo.countFriends(userId),
    ]);

    return {
      data: friends,
      pagination: {
        page,
        limit,
        total: Number(total.total),
      },
    };
  }

  async removeFriend({ userId, friendId }) {
    let userA = userId.toString();
    let userB = friendId.toString();

    if (userA > userB) {
      [userA, userB] = [userB, userA];
    }

    const existingFriend = await friendRepo.findFriendPair(userA, userB);
    if (!existingFriend) {
      throw new NotFoundError("Friend relationship not found!");
    }

    await friendRepo.removeFriend(userA, userB);

    return { message: "Friend removed successfully" };
  }
}

module.exports = new FriendService();

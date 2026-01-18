/**
 * Seed Admin Friends & Messages
 * Creates friend relationships between admin1 and admin2, admin3, admin4
 * Also creates conversations with sample messages
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const crypto = require("crypto");

const ADMIN_CONVERSATIONS = [
  {
    between: ["admin1@gmail.com", "admin2@gmail.com"],
    messages: [
      { from: 0, content: "Chào admin2! Hệ thống hoạt động ổn không?" },
      { from: 1, content: "Chào admin1! Mọi thứ đều ổn, server chạy tốt 👍" },
      { from: 0, content: "Perfect! Có bao nhiêu user mới hôm nay?" },
      { from: 1, content: "Khoảng 50 user đăng ký mới rồi" },
      { from: 0, content: "Tuyệt vời! Keep up the good work!" },
      { from: 1, content: "Thanks! Btw ranking page mới đẹp lắm 🏆" },
    ],
  },
  {
    between: ["admin1@gmail.com", "admin3@gmail.com"],
    messages: [
      { from: 0, content: "Hey admin3, check lỗi bug #123 giúp mình với" },
      { from: 1, content: "OK, để mình xem ngay" },
      { from: 1, content: "Fixed rồi nè, lỗi do thiếu validation" },
      { from: 0, content: "Nice! Deploy lên staging được chưa?" },
      { from: 1, content: "Deployed rồi, test thử đi" },
      { from: 0, content: "Hoạt động perfect! Thanks nhé 🎉" },
      { from: 1, content: "No problem! Có gì cứ ping mình" },
    ],
  },
  {
    between: ["admin1@gmail.com", "admin4@gmail.com"],
    messages: [
      { from: 1, content: "Admin1 ơi, có user report spam" },
      { from: 0, content: "User nào vậy? Gửi ID mình" },
      { from: 1, content: "User ID: abc123, spam tin nhắn khắp nơi" },
      { from: 0, content: "OK, mình sẽ ban account này" },
      { from: 0, content: "Done! Đã disable account spam" },
      { from: 1, content: "Great! Cảm ơn xử lý nhanh 🙏" },
      { from: 0, content: "Không có gì, báo mình nếu còn case khác nhé" },
      { from: 1, content: "Sẽ báo ngay! Have a good day!" },
    ],
  },
];

exports.seed = async function (knex) {
  try {
    console.log("Starting Seed 12 - Admin Friends & Messages...");

    // Get admin users
    const admins = await knex("users")
      .whereIn("email", [
        "admin1@gmail.com",
        "admin2@gmail.com",
        "admin3@gmail.com",
        "admin4@gmail.com",
      ])
      .select("id", "email");

    if (admins.length < 4) {
      console.log("Not all admin users found. Run 02_seed_admin_users first.");
      return;
    }

    // Create email to ID map
    const emailToId = {};
    const adminIds = [];
    for (const admin of admins) {
      emailToId[admin.email] = admin.id;
      adminIds.push(admin.id);
    }

    // Clean up existing admin friendships and related data
    const admin1Id = emailToId["admin1@gmail.com"];
    await knex("friends")
      .where(function() {
        this.where("user_a", admin1Id).orWhere("user_b", admin1Id);
      })
      .whereIn("user_a", adminIds)
      .whereIn("user_b", adminIds)
      .del();
    
    // Clean up admin conversations
    await knex("messages")
      .whereIn("conversation_id", function() {
        this.select("id").from("conversations")
          .where(function() {
            this.where("user_a", admin1Id).orWhere("user_b", admin1Id);
          })
          .whereIn("user_a", adminIds)
          .whereIn("user_b", adminIds);
      })
      .del();

    await knex("conversations")
      .where(function() {
        this.where("user_a", admin1Id).orWhere("user_b", admin1Id);
      })
      .whereIn("user_a", adminIds)
      .whereIn("user_b", adminIds)
      .del();

    const friends = [];
    const conversations = [];
    const messages = [];
    const now = new Date();

    for (const conv of ADMIN_CONVERSATIONS) {
      const userAEmail = conv.between[0];
      const userBEmail = conv.between[1];
      let userA = emailToId[userAEmail];
      let userB = emailToId[userBEmail];

      // Ensure user_a < user_b for consistency
      if (userA > userB) {
        [userA, userB] = [userB, userA];
      }

      // Create friendship
      const friendshipId = crypto.randomUUID();
      const friendCreatedAt = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

      friends.push({
        id: friendshipId,
        user_a: userA,
        user_b: userB,
        status: "ACCEPTED",
        created_at: friendCreatedAt,
      });

      // Create conversation
      const conversationId = crypto.randomUUID();
      conversations.push({
        id: conversationId,
        user_a: userA,
        user_b: userB,
        created_at: friendCreatedAt,
        updated_at: now,
      });

      // Create messages
      for (let i = 0; i < conv.messages.length; i++) {
        const msg = conv.messages[i];
        const senderId = msg.from === 0 ? emailToId[userAEmail] : emailToId[userBEmail];
        const messageDate = new Date(friendCreatedAt.getTime() + (i + 1) * 30 * 60 * 1000); // 30 min apart

        messages.push({
          id: crypto.randomUUID(),
          sender_id: senderId,
          conversation_id: conversationId,
          content: msg.content,
          created_at: messageDate,
          updated_at: messageDate,
        });
      }
    }

    // Insert data
    if (friends.length > 0) {
      await knex("friends").insert(friends);
    }
    if (conversations.length > 0) {
      await knex("conversations").insert(conversations);
    }
    if (messages.length > 0) {
      await knex("messages").insert(messages);
    }

    console.log(
      `Seed 12 completed: ${friends.length} friendships, ${conversations.length} conversations, ${messages.length} messages created between admins`
    );
  } catch (error) {
    console.error("Seed 12 Error:", error);
    throw error;
  }
};

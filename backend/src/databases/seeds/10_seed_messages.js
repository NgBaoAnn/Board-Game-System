/**
 * Seed Messages & Conversations Data
 * Creates conversations and messages ONLY between friends
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const crypto = require("crypto");

// Sample messages for seeding
const SAMPLE_MESSAGES = [
  "Hey! Chơi game không?",
  "Ê, tao vừa được high score Snake nè!",
  "Caro 5 khó thật 😅",
  "GG! Well played!",
  "Lần sau đấu lại nhé",
  "Match 3 addicting quá 🎮",
  "Bạn online không?",
  "Chơi Tic Tac Toe đi",
  "Memory game cũng hay lắm",
  "Mình mới unlock achievement mới!",
  "Score bạn bao nhiêu?",
  "Tao rank #1 rồi 🏆",
  "Thử Free Draw chưa?",
  "Vẽ đẹp lắm!",
  "Hello 👋",
  "Caro 4 dễ hơn Caro 5 nhiều",
  "Bao giờ online lại?",
  "Thanks for adding me!",
  "Nice profile pic!",
  "Let's play together sometime",
];

exports.seed = async function (knex) {
  try {
    console.log("Starting Seed 10 - Messages...");

    // Clean up existing messages and conversations
    await knex("messages").del();
    await knex("conversations").del();

    // Get all friend pairs
    const friendships = await knex("friends")
      .where("status", "accepted")
      .select("user_a", "user_b", "created_at");

    if (friendships.length === 0) {
      console.log("No friendships found. Run 09_seed_friends first.");
      return;
    }

    const conversations = [];
    const messages = [];
    const conversationMap = new Map(); // Track conversation IDs

    // Create conversation for each friend pair
    for (const friendship of friendships) {
      const conversationId = crypto.randomUUID();
      
      // Ensure user_a < user_b for consistency
      let userA = friendship.user_a;
      let userB = friendship.user_b;
      if (userA > userB) {
        [userA, userB] = [userB, userA];
      }

      conversations.push({
        id: conversationId,
        user_a: userA,
        user_b: userB,
        created_at: friendship.created_at,
        updated_at: new Date(),
      });

      conversationMap.set(`${userA}-${userB}`, {
        id: conversationId,
        userA,
        userB,
        friendshipDate: new Date(friendship.created_at),
      });
    }

    if (conversations.length > 0) {
      await knex("conversations").insert(conversations);
    }

    // Create messages for each conversation
    for (const [, conv] of conversationMap) {
      // Random 3-10 messages per conversation
      const messageCount = Math.floor(Math.random() * 8) + 3;
      const startDate = conv.friendshipDate;

      for (let i = 0; i < messageCount; i++) {
        // Random sender (either userA or userB)
        const senderId = Math.random() > 0.5 ? conv.userA : conv.userB;

        // Random message
        const content =
          SAMPLE_MESSAGES[Math.floor(Math.random() * SAMPLE_MESSAGES.length)];

        // Message time: progressively later after friendship
        const messageDate = new Date(
          startDate.getTime() + (i + 1) * Math.random() * 2 * 60 * 60 * 1000 // Random hours apart
        );

        messages.push({
          id: crypto.randomUUID(),
          sender_id: senderId,
          conversation_id: conv.id,
          content: content,
          created_at: messageDate,
          updated_at: messageDate,
        });
      }
    }

    // Insert messages in batches to avoid issues
    if (messages.length > 0) {
      const batchSize = 100;
      for (let i = 0; i < messages.length; i += batchSize) {
        const batch = messages.slice(i, i + batchSize);
        await knex("messages").insert(batch);
      }
    }

    console.log(
      `Seed 10 completed: ${conversations.length} conversations, ${messages.length} messages created`
    );
  } catch (error) {
    console.error("Seed 10 Error:", error);
    throw error;
  }
};

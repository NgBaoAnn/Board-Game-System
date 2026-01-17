/**
 * Seed Friends Data
 * Creates friend relationships between users
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const crypto = require("crypto");

exports.seed = async function (knex) {
  try {
    console.log("Starting Seed 09 - Friends...");

    // Clean up existing friends (except admin relationships if any)
    await knex("friends").del();

    // Get all player users (not admin)
    const users = await knex("users")
      .whereNot("email", "like", "admin%")
      .orderBy("created_at", "asc")
      .limit(30); // Limit to avoid too many combinations

    if (users.length < 2) {
      console.log("Not enough users to create friendships");
      return;
    }

    const friends = [];
    const friendPairs = new Set(); // Track existing pairs to avoid duplicates

    // Create random friendships
    // Each user will have 2-5 random friends
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const friendCount = Math.floor(Math.random() * 4) + 2; // 2-5 friends

      for (let j = 0; j < friendCount; j++) {
        // Pick a random user that is not self
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * users.length);
        } while (randomIndex === i);

        const friend = users[randomIndex];

        // Ensure user_a < user_b for consistency (as per service logic)
        let userA = user.id;
        let userB = friend.id;
        if (userA > userB) {
          [userA, userB] = [userB, userA];
        }

        const pairKey = `${userA}-${userB}`;
        if (!friendPairs.has(pairKey)) {
          friendPairs.add(pairKey);
          friends.push({
            id: crypto.randomUUID(),
            user_a: userA,
            user_b: userB,
            status: "accepted",
            created_at: new Date(
              Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000 // Random date within last 30 days
            ),
          });
        }
      }
    }

    if (friends.length > 0) {
      await knex("friends").insert(friends);
    }
    console.log(`Seed 09 completed: ${friends.length} friendships created`);
  } catch (error) {
    console.error("Seed 09 Error:", error);
    throw error;
  }
};

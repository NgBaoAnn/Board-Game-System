/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const bcrypt = require("bcryptjs");
const MODULE = require("../../constants/module");

exports.seed = async function (knex) {
    try {
        console.log("Starting Seed 05...");

        // Clean up previous seed data (based on email pattern)
        await knex("users").where("email", "like", "player_%").del();

        // Also clean up by username if distinct
        await knex("users").where("username", "like", "player_%").del();

        const users = [];
        const now = new Date();
        // Hash password once, use bcrypt directly
        const passwordHash = await bcrypt.hash("123456", 10);

        const locations = [
            "Hanoi, Vietnam", "Ho Chi Minh City, Vietnam", "Da Nang, Vietnam",
            "Can Tho, Vietnam", "Hai Phong, Vietnam",
            "New York, USA", "London, UK", "Tokyo, Japan", "Seoul, South Korea",
            "Bangkok, Thailand", "Singapore"
        ];

        const bios = [
            "Board game enthusiast 🎲",
            "Strategy game lover 🧠",
            "Casual player looking for fun",
            "Chuyên trị game hack não",
            "Tìm bạn chơi game cùng",
            "Pro player 😎",
            "Just here for fun",
            "Fan of Catan and Ticket to Ride",
            "Hardcore gamer",
            "Thích playing cards và dice games"
        ];

        // Get User Role ID safely
        const userRole = await knex(MODULE.ROLE).where("name", "user").first();
        const roleId = userRole ? userRole.id : 2; // Default to 2 if not found, but log warning

        if (!userRole) console.log("Warning: 'user' role not found in DB, using ID 2");

        // Generate for last 30 days
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            // Random 0 to 5 users per day
            const count = Math.floor(Math.random() * 8); // 0-5

            for (let j = 0; j < count; j++) {
                // Random time
                const timestamp = new Date(date);
                timestamp.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));

                const uniqueSuffix = Math.random().toString(36).substring(7);
                const randomLocation = locations[Math.floor(Math.random() * locations.length)];
                const randomBio = bios[Math.floor(Math.random() * bios.length)];
                const randomPhone = "09" + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');

                // Format YYYY_MM_DD for tracking
                const yyyy = timestamp.getFullYear();
                const mm = (timestamp.getMonth() + 1).toString().padStart(2, '0');
                const dd = timestamp.getDate().toString().padStart(2, '0');

                users.push({
                    email: `player_${yyyy}_${mm}_${dd}_${j}_${uniqueSuffix}@gmail.com`,
                    username: `player_${uniqueSuffix}`,
                    password: passwordHash,
                    role_id: roleId,
                    active: true,
                    created_at: timestamp,
                    updated_at: timestamp,
                    phone: randomPhone,
                    location: randomLocation,
                    bio: randomBio
                });
            }
        }

        if (users.length > 0) {
            await knex(MODULE.USER).insert(users);
        }
        console.log(`Seed 05 completed: ${users.length} users created`);
    } catch (error) {
        console.error("Seed 05 Error:", error);
        throw error;
    }
};

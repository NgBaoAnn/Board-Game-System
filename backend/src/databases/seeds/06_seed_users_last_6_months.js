const passwordService = require("../../services/password.service");

/**
 * @param {import("knex").Knex} knex
 */
exports.seed = async function (knex) {
    // Clean up previous seed data to avoid duplicates
    await knex("users").where("email", "like", "player_%").del();

    const passwordHashed = await passwordService.hash("123456@");
    const users = [];
    const now = new Date();

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

    // Generate for the last 6 months
    for (let i = 0; i < 6; i++) {
        const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth(); // 0-11

        // Get number of days in the month
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Random count between 10 and 15
        const count = Math.floor(Math.random() * (15 - 10 + 1)) + 10;

        for (let j = 0; j < count; j++) {
            // Random day in month
            const day = Math.floor(Math.random() * daysInMonth) + 1;
            const hour = Math.floor(Math.random() * 24);
            const minute = Math.floor(Math.random() * 60);
            const second = Math.floor(Math.random() * 60);

            const createdAt = new Date(year, month, day, hour, minute, second);

            // Avoid future dates
            if (createdAt > now) {
                createdAt.setTime(now.getTime() - Math.floor(Math.random() * 10000000));
            }

            const uniqueSuffix = Math.random().toString(36).substring(7);

            // Formatting month for strings (1-based)
            const monthStr = (month + 1).toString().padStart(2, '0');

            // Random Profile Data
            const randomLocation = locations[Math.floor(Math.random() * locations.length)];
            const randomBio = bios[Math.floor(Math.random() * bios.length)];
            // Random phone: 09 + 8 digits
            const randomPhone = "09" + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');

            users.push({
                email: `player_${year}_${monthStr}_${j}_${uniqueSuffix}@gmail.com`,
                username: `player_${uniqueSuffix}`,
                password: passwordHashed,
                role_id: 2, // User role
                active: true,
                created_at: createdAt,
                updated_at: createdAt,
                phone: randomPhone,
                location: randomLocation,
                bio: randomBio
            });
        }
    }

    // Insert users
    await knex("users").insert(users);
    console.log(`Seeded ${users.length} users for the last 6 months.`);
};

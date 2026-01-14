/**
 * Seed game reviews with sample data
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Get existing users and games
    const users = await knex("users").select("id", "username"); // Fetch all users (removed limit 5)
    const games = await knex("games").select("id", "code");

    if (users.length === 0 || games.length === 0) {
        console.log("Skipping game_reviews seed: no users or games found");
        return;
    }

    // Sample review comments
    const reviewComments = {
        5: [
            "Trò chơi tuyệt vời! Rất hay và dễ chơi.",
            "Perfect! Giao diện đẹp, gameplay mượt mà.",
            "5 sao xứng đáng! Đây là game yêu thích của tôi.",
            "Xuất sắc! Animation đẹp, cơ chế game thú vị.",
            "Love it! Rất nghiện và muốn chơi mãi.",
        ],
        4: [
            "Game hay, chỉ thiếu vài tính năng nhỏ.",
            "Khá ổn, mong sẽ có thêm chế độ chơi mới.",
            "Thích game này, giao diện đẹp lắm!",
            "Chơi vui, nhưng cần cải thiện hiệu suất.",
        ],
        3: [
            "Bình thường, có thể cải thiện thêm.",
            "OK, chơi được nhưng không quá ấn tượng.",
            "Trung bình, mong team dev cải thiện.",
        ],
        2: [
            "Không ấn tượng lắm, cần nâng cấp nhiều.",
            "Còn nhiều bug, hy vọng sẽ fix sớm.",
        ],
        1: [
            "Cần cải thiện nhiều hơn nữa.",
        ],
    };

    // Generate reviews
    const reviews = [];

    for (const game of games) {
        // Each game gets reviews from random users
        const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
        const numReviews = Math.min(shuffledUsers.length, Math.floor(Math.random() * 11) + 7); // 7 to 17

        for (let i = 0; i < numReviews; i++) {
            const user = shuffledUsers[i];
            // Weight towards higher ratings
            const ratingWeights = [1,2,3,4,4,5,5,5,5,5,5,5,5,5];
            const rating = ratingWeights[Math.floor(Math.random() * ratingWeights.length)];
            const comments = reviewComments[rating];
            const comment = comments[Math.floor(Math.random() * comments.length)];

            reviews.push({
                user_id: user.id,
                game_id: game.id,
                rating,
                comment,
                created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
                updated_at: new Date(),
            });
        }
    }

    // Delete existing reviews and insert new ones
    await knex("game_reviews").del();

    if (reviews.length > 0) {
        await knex("game_reviews").insert(reviews);
        console.log(`Seeded ${reviews.length} game reviews`);
    }
};
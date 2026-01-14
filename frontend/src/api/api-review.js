/**
 * Mock data and API for game reviews
 * Backend can be integrated later
 */

// Mock reviews data
const mockReviews = {
    // Format: gameId -> array of reviews
    'tic_tac_toe': [
        {
            id: 1,
            user_id: 'user1',
            username: 'GameMaster99',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gamemaster',
            rating: 5,
            comment: 'Trò chơi cổ điển tuyệt vời! Giao diện đẹp và dễ chơi.',
            created_at: '2026-01-10T10:30:00Z',
            likes: 12,
        },
        {
            id: 2,
            user_id: 'user2',
            username: 'PlayerOne',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player1',
            rating: 4,
            comment: 'Đơn giản nhưng hay. Thích phần animation khi thắng!',
            created_at: '2026-01-08T15:45:00Z',
            likes: 8,
        },
        {
            id: 3,
            user_id: 'user3',
            username: 'BoardGameFan',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=boardgame',
            rating: 5,
            comment: 'Perfect cho việc giết thời gian. AI khá thông minh!',
            created_at: '2026-01-05T09:20:00Z',
            likes: 15,
        },
    ],
    'caro_4': [
        {
            id: 4,
            user_id: 'user4',
            username: 'StrategicMind',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=strategic',
            rating: 5,
            comment: 'Caro 4 đòi hỏi nhiều suy nghĩ hơn Tic-Tac-Toe. Rất thích!',
            created_at: '2026-01-12T14:00:00Z',
            likes: 20,
        },
        {
            id: 5,
            user_id: 'user5',
            username: 'ChessLover',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chess',
            rating: 4,
            comment: 'Chiến thuật hay, nhưng muốn có thêm nhiều chế độ chơi hơn.',
            created_at: '2026-01-11T18:30:00Z',
            likes: 5,
        },
    ],
    'caro_5': [
        {
            id: 6,
            user_id: 'user6',
            username: 'ProGamer',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=progamer',
            rating: 5,
            comment: 'Bàn cờ lớn hơn cho phép nhiều chiến thuật phức tạp. Love it!',
            created_at: '2026-01-13T11:15:00Z',
            likes: 25,
        },
    ],
    'snake': [
        {
            id: 7,
            user_id: 'user7',
            username: 'RetroGamer',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=retro',
            rating: 5,
            comment: 'Nhớ lại tuổi thơ! Đồ họa đẹp hơn nhiều so với phiên bản cũ.',
            created_at: '2026-01-09T20:00:00Z',
            likes: 30,
        },
        {
            id: 8,
            user_id: 'user8',
            username: 'CasualPlayer',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=casual',
            rating: 4,
            comment: 'Dễ nghiện! Controls mượt mà trên mobile.',
            created_at: '2026-01-07T16:45:00Z',
            likes: 18,
        },
    ],
    'match_3': [
        {
            id: 9,
            user_id: 'user9',
            username: 'PuzzleMaster',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=puzzle',
            rating: 5,
            comment: 'Match 3 kinh điển với twist mới. Animation rất đẹp!',
            created_at: '2026-01-14T08:00:00Z',
            likes: 22,
        },
    ],
    'memory': [
        {
            id: 10,
            user_id: 'user10',
            username: 'MemoryChamp',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=memory',
            rating: 4,
            comment: 'Giúp rèn luyện trí nhớ tốt. Thử thách tăng dần hợp lý.',
            created_at: '2026-01-06T12:30:00Z',
            likes: 10,
        },
    ],
    'free_draw': [
        {
            id: 11,
            user_id: 'user11',
            username: 'ArtistSoul',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=artist',
            rating: 5,
            comment: 'Canvas vẽ tự do rất sáng tạo. Brush tools đa dạng!',
            created_at: '2026-01-04T19:00:00Z',
            likes: 35,
        },
    ],
};

// Default rating per game (mock)
const mockRatings = {
    'tic_tac_toe': { average: 4.7, total: 128 },
    'caro_4': { average: 4.5, total: 89 },
    'caro_5': { average: 4.8, total: 156 },
    'snake': { average: 4.6, total: 234 },
    'match_3': { average: 4.4, total: 67 },
    'memory': { average: 4.2, total: 45 },
    'free_draw': { average: 4.9, total: 78 },
};

const reviewApi = {
    /**
     * Get reviews for a game
     * @param {string} gameCode - Game code (e.g., 'tic_tac_toe')
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     */
    getGameReviews: async (gameCode, page = 1, limit = 10) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const reviews = mockReviews[gameCode] || [];
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedReviews = reviews.slice(start, end);

        return {
            data: {
                data: paginatedReviews,
                pagination: {
                    page,
                    limit,
                    total: reviews.length,
                    totalPages: Math.ceil(reviews.length / limit),
                },
            },
        };
    },

    /**
     * Get average rating for a game
     * @param {string} gameCode - Game code
     */
    getAverageRating: async (gameCode) => {
        await new Promise(resolve => setTimeout(resolve, 100));

        const rating = mockRatings[gameCode] || { average: 4.0, total: 0 };

        return {
            data: rating,
        };
    },

    /**
     * Submit a review for a game
     * @param {string} gameCode - Game code
     * @param {number} rating - Rating (1-5)
     * @param {string} comment - Review comment
     */
    submitReview: async (gameCode, rating, comment) => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const newReview = {
            id: Date.now(),
            user_id: 'current_user',
            username: 'You',
            avatar_url: null,
            rating,
            comment,
            created_at: new Date().toISOString(),
            likes: 0,
        };

        // Add to mock data (in real app, this would be handled by backend)
        if (!mockReviews[gameCode]) {
            mockReviews[gameCode] = [];
        }
        mockReviews[gameCode].unshift(newReview);

        // Update rating (simplified)
        if (mockRatings[gameCode]) {
            const { average, total } = mockRatings[gameCode];
            mockRatings[gameCode] = {
                average: ((average * total) + rating) / (total + 1),
                total: total + 1,
            };
        }

        return {
            data: newReview,
        };
    },

    /**
     * Like a review
     * @param {number} reviewId - Review ID
     */
    likeReview: async (reviewId) => {
        await new Promise(resolve => setTimeout(resolve, 200));

        // Find and increment likes in mock data
        for (const gameCode in mockReviews) {
            const review = mockReviews[gameCode].find(r => r.id === reviewId);
            if (review) {
                review.likes += 1;
                return { data: { likes: review.likes } };
            }
        }

        return { data: { likes: 0 } };
    },
};

export default reviewApi;

/**
 * Tutorial Data for all games
 * Each game has an array of steps with:
 * - target: CSS selector for element to highlight (optional)
 * - title: Step title
 * - description: Step description
 * - position: Tooltip position ('top' | 'bottom' | 'left' | 'right' | 'center')
 */

export const TUTORIALS = {
    tic_tac_toe: [
        {
            title: '🎮 Chào mừng đến Tic Tac Toe!',
            description: 'Trò chơi cờ X-O cổ điển. Bạn sẽ đấu với máy, người nào xếp được 3 quân thành hàng trước sẽ thắng!',
            position: 'center'
        },
        {
            title: '🎯 Chọn độ khó',
            description: 'Đầu tiên, hãy chọn độ khó. "Dễ" để làm quen, "Khó" nếu bạn muốn thử thách!',
            position: 'center'
        },
        {
            title: '✨ Chọn quân cờ',
            description: 'Tiếp theo, chọn X hoặc O. X sẽ đi trước, O đi sau.',
            position: 'center'
        },
        {
            title: '📍 Cách chơi',
            description: 'Click vào ô trống trên bàn cờ để đặt quân. Hoặc dùng phím mũi tên + Enter.',
            position: 'center'
        },
        {
            title: '🏆 Mục tiêu',
            description: 'Xếp 3 quân X hoặc O thành hàng ngang, dọc, hoặc chéo để thắng. Chúc may mắn!',
            position: 'center'
        }
    ],

    caro_4: [
        {
            title: '🎮 Chào mừng đến Caro 4!',
            description: 'Phiên bản nâng cao của Tic Tac Toe. Bạn cần xếp 4 quân thành hàng để thắng!',
            position: 'center'
        },
        {
            title: '🎯 Chọn độ khó',
            description: 'Chọn "Dễ" hoặc "Khó". Máy ở chế độ Khó sẽ chơi thông minh hơn nhiều!',
            position: 'center'
        },
        {
            title: '✨ Chọn quân cờ',
            description: 'Chọn X (đi trước) hoặc O (đi sau) theo chiến thuật bạn thích.',
            position: 'center'
        },
        {
            title: '📍 Bàn cờ lớn hơn',
            description: 'Bàn cờ 7x7. Click ô trống hoặc dùng phím mũi tên + Enter để đánh.',
            position: 'center'
        },
        {
            title: '🏆 Mục tiêu',
            description: 'Xếp 4 quân thành hàng (ngang, dọc, chéo) để thắng. Hãy cản máy!',
            position: 'center'
        }
    ],

    caro_5: [
        {
            title: '🎮 Chào mừng đến Caro 5 - Gomoku!',
            description: 'Trò cờ caro truyền thống! Bạn cần xếp 5 quân thành hàng để chiến thắng.',
            position: 'center'
        },
        {
            title: '🎯 Chọn độ khó',
            description: 'Chọn độ khó phù hợp. "Khó" dành cho những người chơi giỏi!',
            position: 'center'
        },
        {
            title: '✨ Chọn quân cờ',
            description: 'X đi trước, O đi sau. Hãy chọn theo phong cách chơi của bạn.',
            position: 'center'
        },
        {
            title: '📍 Bàn cờ rộng',
            description: 'Bàn cờ 10x10. Di chuyển bằng phím mũi tên, Enter để đặt quân.',
            position: 'center'
        },
        {
            title: '🏆 Chiến thuật',
            description: 'Vừa tấn công vừa phòng thủ! Xếp 5 quân liên tiếp để thắng.',
            position: 'center'
        }
    ],

    memory: [
        {
            title: '🧠 Chào mừng đến Memory Game!',
            description: 'Trò chơi rèn luyện trí nhớ. Tìm các cặp thẻ giống nhau!',
            position: 'center'
        },
        {
            title: '👀 Ghi nhớ nhanh',
            description: 'Đầu game, tất cả thẻ sẽ lật mở trong 2 giây. Hãy ghi nhớ vị trí!',
            position: 'center'
        },
        {
            title: '🃏 Cách chơi',
            description: 'Click hoặc Enter để lật thẻ. Mỗi lượt lật 2 thẻ.',
            position: 'center'
        },
        {
            title: '✅ Ghép cặp',
            description: 'Nếu 2 thẻ giống nhau → Điểm! Nếu khác → Úp lại.',
            position: 'center'
        },
        {
            title: '🏆 Mục tiêu',
            description: 'Tìm hết tất cả các cặp với ít lượt lật nhất để được điểm cao!',
            position: 'center'
        }
    ],

    match_3: [
        {
            title: '💎 Chào mừng đến Match 3!',
            description: 'Ghép 3 icon giống nhau để ghi điểm. Càng combo nhiều càng nhiều điểm!',
            position: 'center'
        },
        {
            title: '🎯 Chọn ô',
            description: 'Click hoặc Enter để chọn một ô. Ô được chọn sẽ sáng lên.',
            position: 'center'
        },
        {
            title: '↔️ Đổi chỗ',
            description: 'Chọn ô kề bên để đổi chỗ 2 icon với nhau.',
            position: 'center'
        },
        {
            title: '✨ Combo',
            description: 'Khi 3+ icon giống nhau xếp thành hàng → Nổ! Tạo combo để nhân điểm.',
            position: 'center'
        },
        {
            title: '🏆 Mục tiêu',
            description: 'Ghi càng nhiều điểm càng tốt trước khi hết giờ!',
            position: 'center'
        }
    ],

    snake: [
        {
            title: '🐍 Chào mừng đến Snake Game!',
            description: 'Điều khiển rắn ăn táo để lớn lên. Đừng đâm vào tường hay chính mình!',
            position: 'center'
        },
        {
            title: '🎮 Điều khiển',
            description: 'Dùng phím WASD hoặc mũi tên ↑↓←→ để di chuyển.',
            position: 'center'
        },
        {
            title: '🍎 Ăn táo',
            description: 'Di chuyển đầu rắn vào quả táo đỏ để ăn. Mỗi táo +10 điểm.',
            position: 'center'
        },
        {
            title: '⚠️ Cẩn thận',
            description: 'Tránh đâm vào tường (viền) và thân rắn. Game over nếu va chạm!',
            position: 'center'
        },
        {
            title: '🏆 Mục tiêu',
            description: 'Ăn nhiều táo nhất có thể, đạt điểm cao kỷ lục!',
            position: 'center'
        }
    ],

    free_draw: [
        {
            title: '🎨 Chào mừng đến Free Draw!',
            description: 'Vẽ pixel art tự do! Không giới hạn thời gian, chỉ có sáng tạo.',
            position: 'center'
        },
        {
            title: '🖌️ Chọn màu',
            description: 'Nhấn G hoặc click vào bảng màu để chọn màu vẽ.',
            position: 'center'
        },
        {
            title: '✏️ Vẽ',
            description: 'Click ô hoặc dùng Enter để tô màu ô hiện tại.',
            position: 'center'
        },
        {
            title: '🧹 Tẩy & Xóa',
            description: 'Nhấn E để bật/tắt tẩy. Nhấn C để xóa toàn bộ canvas.',
            position: 'center'
        },
        {
            title: '💾 Lưu tác phẩm',
            description: 'Nhấn nút Lưu để giữ lại bức vẽ của bạn. Sáng tạo không giới hạn!',
            position: 'center'
        }
    ]
}

/**
 * Get tutorial for a specific game
 * @param {string} gameCode - The game code (e.g., 'tic_tac_toe')
 * @returns {Array} Tutorial steps array
 */
export function getTutorial(gameCode) {
    return TUTORIALS[gameCode] || null
}

/**
 * Check if user has completed tutorial for a game
 * @param {string} gameCode - The game code
 * @returns {boolean}
 */
export function isTutorialCompleted(gameCode) {
    try {
        return localStorage.getItem(`tutorial_completed_${gameCode}`) === 'true'
    } catch {
        return false
    }
}

/**
 * Mark tutorial as completed for a game
 * @param {string} gameCode - The game code
 */
export function markTutorialCompleted(gameCode) {
    try {
        localStorage.setItem(`tutorial_completed_${gameCode}`, 'true')
    } catch {
        // Ignore localStorage errors
    }
}

/**
 * Reset tutorial completion for a game (for testing)
 * @param {string} gameCode - The game code
 */
export function resetTutorialCompletion(gameCode) {
    try {
        localStorage.removeItem(`tutorial_completed_${gameCode}`)
    } catch {
        // Ignore localStorage errors
    }
}

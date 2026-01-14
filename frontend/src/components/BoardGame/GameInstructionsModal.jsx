import { Modal } from 'antd'
import { HelpCircle, X, Target, Grid3x3, Zap, Brain, Palette, Apple } from 'lucide-react'
import { motion } from 'framer-motion'

// Game instructions data
const GAME_INSTRUCTIONS = {
    tic_tac_toe: {
        title: 'Tic Tac Toe',
        icon: Grid3x3,
        iconColor: 'from-blue-500 to-indigo-600',
        description: 'Classic 3×3 strategy game',
        rules: [
            'Chọn biểu tượng X hoặc O để bắt đầu',
            'Lần lượt đặt quân của bạn vào ô trống',
            'Xếp được 3 quân liên tiếp (ngang, dọc hoặc chéo) để thắng',
            'AI sẽ đi nước tiếp theo sau bạn',
        ],
        tips: [
            'Chiếm ô trung tâm để có lợi thế',
            'Chặn đối thủ khi họ có 2 quân liên tiếp',
        ],
    },
    caro_4: {
        title: 'Caro 4',
        icon: Grid3x3,
        iconColor: 'from-emerald-500 to-teal-600',
        description: 'Connect 4 on a 10×10 board',
        rules: [
            'Chọn biểu tượng X hoặc O để bắt đầu',
            'Lần lượt đặt quân vào ô trống trên bàn 10×10',
            'Xếp được 4 quân liên tiếp (ngang, dọc hoặc chéo) để thắng',
            'Cẩn thận với nước đi của AI!',
        ],
        tips: [
            'Tạo các đường có nhiều điểm mở',
            'Kết hợp tấn công và phòng thủ',
        ],
    },
    caro_5: {
        title: 'Caro 5 (Gomoku)',
        icon: Grid3x3,
        iconColor: 'from-purple-500 to-pink-600',
        description: 'Classic Gomoku on 15×15 board',
        rules: [
            'Chọn biểu tượng X hoặc O để bắt đầu',
            'Lần lượt đặt quân vào ô trống trên bàn 15×15',
            'Xếp được đúng 5 quân liên tiếp (ngang, dọc hoặc chéo) để thắng',
            'Đây là phiên bản cổ điển của Gomoku',
        ],
        tips: [
            'Tập trung vào vùng trung tâm bàn cờ',
            'Tạo các đường tấn công kép (double threat)',
        ],
    },
    snake: {
        title: 'Snake Game',
        icon: Apple,
        iconColor: 'from-green-500 to-lime-600',
        description: 'Classic Snake arcade game',
        rules: [
            'Dùng phím mũi tên hoặc WASD để điều khiển rắn',
            'Ăn táo để tăng điểm và dài thêm',
            'Tránh đâm vào tường hoặc cắn vào thân mình',
            'Chơi càng lâu, điểm càng cao!',
        ],
        tips: [
            'Đừng di chuyển quá nhanh khi rắn dài',
            'Lên kế hoạch đường đi trước khi ăn táo',
        ],
    },
    match_3: {
        title: 'Match 3',
        icon: Zap,
        iconColor: 'from-amber-500 to-orange-600',
        description: 'Puzzle matching game',
        rules: [
            'Hoán đổi 2 viên kề nhau để tạo hàng 3+ viên cùng màu',
            'Hàng sẽ biến mất và bạn được điểm',
            'Combo liên tiếp sẽ nhân điểm',
            'Hết thời gian hoặc không còn nước đi → Game Over',
        ],
        tips: [
            'Nhìn tổng thể bàn trước khi di chuyển',
            'Ưu tiên tạo combo từ dưới lên',
        ],
    },
    memory: {
        title: 'Memory Game',
        icon: Brain,
        iconColor: 'from-cyan-500 to-blue-600',
        description: 'Card matching memory game',
        rules: [
            'Lật 2 thẻ mỗi lượt để tìm cặp giống nhau',
            'Nếu trùng khớp, thẻ sẽ biến mất và bạn được điểm',
            'Nếu không khớp, thẻ sẽ úp lại',
            'Tìm hết tất cả các cặp để chiến thắng',
        ],
        tips: [
            'Ghi nhớ vị trí các thẻ đã lật',
            'Bắt đầu từ một góc của bàn cờ',
        ],
    },
    free_draw: {
        title: 'Free Draw',
        icon: Palette,
        iconColor: 'from-pink-500 to-rose-600',
        description: 'Creative drawing canvas',
        rules: [
            'Click và kéo để vẽ trên canvas',
            'Chọn màu sắc và độ dày nét vẽ',
            'Không giới hạn thời gian',
            'Thể hiện sự sáng tạo của bạn!',
        ],
        tips: [
            'Dùng các màu sáng để nổi bật',
            'Lưu lại tác phẩm trước khi rời đi',
        ],
    },
}

// Default instructions for unknown games
const DEFAULT_INSTRUCTIONS = {
    title: 'How to Play',
    icon: HelpCircle,
    iconColor: 'from-slate-500 to-slate-600',
    description: 'Game instructions',
    rules: [
        'Dùng phím mũi tên hoặc WASD để di chuyển',
        'Nhấn Enter hoặc Space để xác nhận',
        'Nhấn ESC hoặc P để tạm dừng',
        'Hoàn thành mục tiêu để giành chiến thắng!',
    ],
    tips: [
        'Đọc kỹ luật chơi trước khi bắt đầu',
    ],
}

export default function GameInstructionsModal({ open, onClose, gameCode }) {
    const instructions = GAME_INSTRUCTIONS[gameCode] || DEFAULT_INSTRUCTIONS
    const IconComponent = instructions.icon

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            width={420}
            closeIcon={null}
            destroyOnHidden
            styles={{
                content: { borderRadius: 24, padding: 0, overflow: 'hidden' },
                mask: { backdropFilter: 'blur(4px)' }
            }}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative bg-white dark:bg-slate-900 overflow-hidden"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-colors duration-200"
                >
                    <X size={16} className="text-white" />
                </button>

                {/* Header with Gradient */}
                <div className={`relative p-6 pb-8 bg-gradient-to-r ${instructions.iconColor}`}>
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                    <div className="relative flex items-center gap-4">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', damping: 12, stiffness: 100 }}
                            className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg"
                        >
                            <IconComponent size={28} className="text-white" />
                        </motion.div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{instructions.title}</h2>
                            <p className="text-white/80 text-sm">{instructions.description}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {/* Rules */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                            <Target size={16} className="text-indigo-500" />
                            Luật chơi
                        </h3>
                        <div className="space-y-2.5">
                            {instructions.rules.map((rule, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                                >
                                    <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                                        {index + 1}
                                    </span>
                                    <span className="text-sm text-slate-700 dark:text-slate-300">{rule}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Tips */}
                    {instructions.tips && instructions.tips.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <Zap size={16} className="text-amber-500" />
                                Mẹo chơi
                            </h3>
                            <div className="space-y-2">
                                {instructions.tips.map((tip, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + index * 0.05 }}
                                        className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                        {tip}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onClose}
                        className={`w-full py-3.5 font-bold rounded-xl text-white shadow-lg transition-all bg-gradient-to-r ${instructions.iconColor} hover:brightness-110`}
                    >
                        Đã hiểu, bắt đầu chơi!
                    </motion.button>
                </div>
            </motion.div>
        </Modal>
    )
}

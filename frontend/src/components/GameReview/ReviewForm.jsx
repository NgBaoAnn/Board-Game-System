import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2 } from 'lucide-react'
import { Input, message } from 'antd'
import StarRating from '../common/StarRating'
import reviewApi from '@/api/api-review'

const { TextArea } = Input

/**
 * ReviewForm component - Form to submit a review
 * @param {number} gameId - Game ID to review
 * @param {Function} onSubmitSuccess - Callback after successful submission
 */
export default function ReviewForm({ gameId, onSubmitSuccess }) {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (rating === 0) {
            message.warning('Vui lòng chọn số sao đánh giá')
            return
        }
        
        if (!comment.trim()) {
            message.warning('Vui lòng nhập nội dung đánh giá')
            return
        }

        setSubmitting(true)
        try {
            const response = await reviewApi.submitReview(gameId, rating, comment.trim())
            message.success('Đã gửi đánh giá thành công!')
            setRating(0)
            setComment('')
            onSubmitSuccess?.(response.data)
        } catch (error) {
            const errorMsg = error.message || 'Không thể gửi đánh giá. Vui lòng thử lại.'
            message.error(errorMsg)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50"
        >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Viết đánh giá của bạn
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Đánh giá của bạn
                    </label>
                    <div className="flex items-center gap-3">
                        <StarRating
                            rating={rating}
                            interactive
                            onRate={setRating}
                            size="lg"
                        />
                        {rating > 0 && (
                            <span className="text-lg font-bold text-yellow-500">
                                {rating}/5
                            </span>
                        )}
                    </div>
                </div>

                {/* Comment textarea */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Nội dung đánh giá
                    </label>
                    <TextArea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm của bạn về game này..."
                        rows={4}
                        maxLength={500}
                        showCount
                        className="!bg-gray-50 dark:!bg-slate-900/50 !border-gray-200 dark:!border-slate-700 !rounded-xl"
                    />
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={submitting || rating === 0 || !comment.trim()}
                    className={`w-full py-3 px-6 mt-8 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 ${
                        submitting || rating === 0 || !comment.trim()
                            ? 'bg-gray-300 dark:bg-slate-700 cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#1d7af2] to-[#6366f1] dark:from-[#00f0ff] dark:to-[#a855f7] hover:shadow-lg hover:shadow-[#1d7af2]/25 dark:hover:shadow-[#00f0ff]/25 hover:-translate-y-0.5'
                    }`}
                >
                    {submitting ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Đang gửi...
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            Gửi đánh giá
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    )
}

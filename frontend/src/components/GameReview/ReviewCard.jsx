import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { Avatar } from 'antd'
import StarRating from '../common/StarRating'

/**
 * ReviewCard component - Display individual review
 * @param {Object} review - Review object
 * @param {number} index - Animation index
 */
export default function ReviewCard({ review, index = 0 }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now - date
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
        
        if (diffDays === 0) {
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
            if (diffHours === 0) {
                const diffMins = Math.floor(diffMs / (1000 * 60))
                return `${diffMins} phút trước`
            }
            return `${diffHours} giờ trước`
        } else if (diffDays === 1) {
            return 'Hôm qua'
        } else if (diffDays < 7) {
            return `${diffDays} ngày trước`
        } else {
            return date.toLocaleDateString('vi-VN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            })
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative p-5 rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 hover:border-[#1d7af2]/30 dark:hover:border-[#00f0ff]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#1d7af2]/5 dark:hover:shadow-[#00f0ff]/5"
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                {review.avatar_url ? (
                    <Avatar
                        src={review.avatar_url}
                        size={48}
                        className="border-2 border-gray-200 dark:border-slate-600"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1d7af2] to-[#6366f1] dark:from-[#00f0ff] dark:to-[#a855f7] flex items-center justify-center text-white font-bold text-lg">
                        {(review.username || 'U').charAt(0).toUpperCase()}
                    </div>
                )}
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                        {review.username}
                    </h4>
                    <div className="flex items-center gap-2">
                        <StarRating rating={review.rating} size="sm" />
                        <span className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1">
                            <Clock size={12} />
                            {formatDate(review.created_at)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Comment */}
            <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                {review.comment}
            </p>
        </motion.div>
    )
}

import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, Users, MessageSquare, TrendingUp, Loader2 } from 'lucide-react'
import { Spin, Progress, Empty } from 'antd'
import { ReviewCard, ReviewForm } from '@/components/GameReview'
import StarRating from '@/components/common/StarRating'
import reviewApi from '@/api/api-review'
import gameApi from '@/api/api-game'

// Game logo mapping
const GAME_LOGOS = {
    'tic_tac_toe': '/tic-tac-toe.png',
    'caro_4': '/caro-4.png',
    'caro_5': '/caro-5.png',
    'snake': '/snake-game.png',
    'match_3': '/match-3.png',
    'memory': '/memory.png',
    'free_draw': '/draw free.png',
}

export default function GameReviewPage() {
    const { gameId } = useParams()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    
    // Get game code from URL params
    const gameCode = searchParams.get('code') || 'tic_tac_toe'
    const gameName = searchParams.get('name') || 'Game'

    const [game, setGame] = useState(null)
    const [reviews, setReviews] = useState([])
    const [averageRating, setAverageRating] = useState({ average: 0, total: 0 })
    const [loading, setLoading] = useState(true)
    const [reviewsLoading, setReviewsLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    // Fetch game details
    useEffect(() => {
        const fetchGame = async () => {
            if (gameId) {
                try {
                    const response = await gameApi.getGameById(gameId)
                    setGame(response.data)
                } catch (error) {
                    console.error('Failed to fetch game:', error)
                }
            }
        }
        fetchGame()
    }, [gameId])

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const [reviewsRes, ratingRes] = await Promise.all([
                    reviewApi.getGameReviews(gameCode, 1, 10),
                    reviewApi.getAverageRating(gameCode),
                ])
                
                setReviews(reviewsRes.data.data)
                setAverageRating(ratingRes.data)
                setHasMore(reviewsRes.data.pagination.page < reviewsRes.data.pagination.totalPages)
            } catch (error) {
                console.error('Failed to fetch reviews:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [gameCode])

    // Load more reviews
    const loadMore = async () => {
        if (reviewsLoading || !hasMore) return
        
        setReviewsLoading(true)
        try {
            const response = await reviewApi.getGameReviews(gameCode, page + 1, 10)
            setReviews(prev => [...prev, ...response.data.data])
            setPage(prev => prev + 1)
            setHasMore(response.data.pagination.page < response.data.pagination.totalPages)
        } catch (error) {
            console.error('Failed to load more reviews:', error)
        } finally {
            setReviewsLoading(false)
        }
    }

    // Handle new review submission
    const handleReviewSubmit = (newReview) => {
        setReviews(prev => [newReview, ...prev])
        // Update average rating (simplified)
        setAverageRating(prev => ({
            average: ((prev.average * prev.total) + newReview.rating) / (prev.total + 1),
            total: prev.total + 1,
        }))
    }

    // Calculate rating distribution (mock)
    const ratingDistribution = [
        { stars: 5, percentage: 65 },
        { stars: 4, percentage: 22 },
        { stars: 3, percentage: 8 },
        { stars: 2, percentage: 3 },
        { stars: 1, percentage: 2 },
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Spin size="large" />
            </div>
        )
    }

    return (
        <div className="min-h-full">
            {/* Back button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 mb-4 text-gray-600 dark:text-slate-400 hover:text-[#1d7af2] dark:hover:text-[#00f0ff] transition-colors font-medium"
            >
                <ArrowLeft size={20} />
                <span>Quay lại</span>
            </motion.button>

            {/* Game Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row gap-6 p-6 mb-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50"
            >
                {/* Game Image */}
                <div className="flex-shrink-0">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600">
                        {GAME_LOGOS[gameCode] ? (
                            <img
                                src={GAME_LOGOS[gameCode]}
                                alt={gameName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">
                                🎮
                            </div>
                        )}
                    </div>
                </div>

                {/* Game Info */}
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2">
                        {gameName}
                    </h1>
                    
                    <div className="flex items-center gap-3 mb-4">
                        <StarRating rating={averageRating.average} showValue size="lg" />
                        <span className="text-gray-500 dark:text-slate-400">
                            ({averageRating.total} đánh giá)
                        </span>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                            <Users size={16} className="text-[#1d7af2] dark:text-[#00f0ff]" />
                            <span>1,234 người chơi</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                            <MessageSquare size={16} className="text-[#1d7af2] dark:text-[#00f0ff]" />
                            <span>{averageRating.total} bình luận</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                            <TrendingUp size={16} className="text-green-500" />
                            <span>Top 10 phổ biến</span>
                        </div>
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="w-full md:w-48 space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
                        Phân bố đánh giá
                    </h4>
                    {ratingDistribution.map(({ stars, percentage }) => (
                        <div key={stars} className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 dark:text-slate-400 w-3">
                                {stars}
                            </span>
                            <Star size={12} className="text-yellow-400 fill-yellow-400" />
                            <Progress
                                percent={percentage}
                                showInfo={false}
                                strokeColor={{
                                    '0%': '#00f0ff',
                                    '100%': '#a855f7',
                                }}
                                trailColor="rgba(148, 163, 184, 0.2)"
                                size="small"
                                className="flex-1"
                            />
                            <span className="text-xs text-gray-500 dark:text-slate-400 w-8">
                                {percentage}%
                            </span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <MessageSquare size={20} className="text-[#1d7af2] dark:text-[#00f0ff]" />
                        Đánh giá ({reviews.length})
                    </h2>

                    {reviews.length > 0 ? (
                        <div className="space-y-4">
                            {reviews.map((review, index) => (
                                <ReviewCard
                                    key={review.id}
                                    review={review}
                                    index={index}
                                />
                            ))}

                            {/* Load more button */}
                            {hasMore && (
                                <button
                                    onClick={loadMore}
                                    disabled={reviewsLoading}
                                    className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-[#1d7af2] dark:hover:border-[#00f0ff] hover:text-[#1d7af2] dark:hover:text-[#00f0ff] transition-all font-medium flex items-center justify-center gap-2"
                                >
                                    {reviewsLoading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Đang tải...
                                        </>
                                    ) : (
                                        'Xem thêm đánh giá'
                                    )}
                                </button>
                            )}
                        </div>
                    ) : (
                        <Empty
                            description="Chưa có đánh giá nào. Hãy là người đầu tiên!"
                            className="py-12"
                        />
                    )}
                </div>

                {/* Review Form */}
                <div className="lg:col-span-1 mt-11">
                    <div className="sticky top-4">
                        <ReviewForm
                            gameCode={gameCode}
                            onSubmitSuccess={handleReviewSubmit}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

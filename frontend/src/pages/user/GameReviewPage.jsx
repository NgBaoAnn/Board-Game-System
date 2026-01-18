import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Spin, Rate, Avatar, Empty, Modal, Input, Button, message, Tabs, Tooltip } from 'antd'
// Direct imports for better bundle size
import ThumbsUp from 'lucide-react/dist/esm/icons/thumbs-up'
import ThumbsDown from 'lucide-react/dist/esm/icons/thumbs-down'
import MessageSquare from 'lucide-react/dist/esm/icons/message-square'
import Clock from 'lucide-react/dist/esm/icons/clock'
import Filter from 'lucide-react/dist/esm/icons/filter'
import PenLine from 'lucide-react/dist/esm/icons/pen-line'
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle'
import XCircle from 'lucide-react/dist/esm/icons/x-circle'
import Award from 'lucide-react/dist/esm/icons/award'
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up'
import Calendar from 'lucide-react/dist/esm/icons/calendar'
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down'
import Gamepad2 from 'lucide-react/dist/esm/icons/gamepad-2'
import reviewApi from '@/api/api-review'
import gameApi from '@/api/api-game'
import { useAuth } from '@/store/useAuth'
import { useTheme } from '@/context/ThemeContext'

const { TextArea } = Input

// Game image mapping
const GAME_IMAGES = {
  'tic_tac_toe': 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=100&h=100&fit=crop',
  'caro_4': 'https://images.unsplash.com/photo-1606503153255-59d8b2e4739e?w=100&h=100&fit=crop',
  'caro_5': 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=100&h=100&fit=crop',
  'snake': 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=100&h=100&fit=crop',
  'match_3': 'https://images.unsplash.com/photo-1555864400-5256f9df4e5e?w=100&h=100&fit=crop',
  'memory': 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=100&h=100&fit=crop',
  'free_draw': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=100&h=100&fit=crop',
}

export default function GameReviewPage() {
  const [searchParams] = useSearchParams()
  const { authenticated } = useAuth()
  const { isDarkMode } = useTheme()

  // State
  const [games, setGames] = useState([])
  const [selectedGame, setSelectedGame] = useState(null)
  const [reviews, setReviews] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [sortBy, setSortBy] = useState('recent')

  // Write review modal
  const [showWriteModal, setShowWriteModal] = useState(false)
  const [showPlayRequiredModal, setShowPlayRequiredModal] = useState(false)
  const [showAlreadyReviewedModal, setShowAlreadyReviewedModal] = useState(false)
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Fetch games on mount
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true)
        const response = await gameApi.getActiveGames()
        const gamesData = response.data || []
        setGames(gamesData)

        // Check if gameId is in URL, if so select that game
        const gameIdFromUrl = searchParams.get('gameId')
        if (gameIdFromUrl && gamesData.length > 0) {
          const targetGame = gamesData.find(g => g.id === parseInt(gameIdFromUrl))
          if (targetGame) {
            setSelectedGame(targetGame)
          } else {
            setSelectedGame(gamesData[0])
          }
        } else if (gamesData.length > 0) {
          setSelectedGame(gamesData[0])
        }
      } catch (err) {
        console.error('Failed to fetch games:', err)
        message.error('Không thể tải danh sách game')
      } finally {
        setLoading(false)
      }
    }
    fetchGames()
  }, [searchParams])

  // Fetch reviews when game changes
  useEffect(() => {
    if (!selectedGame) return

    const fetchReviews = async () => {
      try {
        setReviewsLoading(true)
        const [reviewsRes, summaryRes] = await Promise.allSettled([
          reviewApi.getGameReviews(selectedGame.id, 1, 50),
          reviewApi.getReviewSummary(selectedGame.id)
        ])

        if (reviewsRes.status === 'fulfilled') {
          setReviews(reviewsRes.value.data?.data || [])
        }
        if (summaryRes.status === 'fulfilled') {
          setSummary(summaryRes.value.data || null)
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err)
      } finally {
        setReviewsLoading(false)
      }
    }
    fetchReviews()
  }, [selectedGame])

  // Handle click on write review button - just open the modal
  const handleWriteReviewClick = () => {
    if (!selectedGame || !authenticated) return
    setShowWriteModal(true)
  }

  // Handle submit review
  const handleSubmitReview = async () => {
    if (!selectedGame || !authenticated) return

    try {
      setSubmitting(true)
      await reviewApi.submitReview(selectedGame.id, newRating, newComment)
      message.success('Đánh giá của bạn đã được gửi!')
      setShowWriteModal(false)
      setNewRating(5)
      setNewComment('')

      // Refresh reviews
      const [reviewsRes, summaryRes] = await Promise.allSettled([
        reviewApi.getGameReviews(selectedGame.id, 1, 50),
        reviewApi.getReviewSummary(selectedGame.id)
      ])
      if (reviewsRes.status === 'fulfilled') {
        setReviews(reviewsRes.value.data?.data || [])
      }
      if (summaryRes.status === 'fulfilled') {
        setSummary(summaryRes.value.data || null)
      }
    } catch (err) {
      console.error('Failed to submit review:', err)
      const errorMessage = err.message || 'Không thể gửi đánh giá'

      // Check if user already reviewed this game (CHECK THIS FIRST because it also contains "chơi")
      if (errorMessage.includes('đã đánh giá') || errorMessage.includes('đánh giá rồi')) {
        setShowWriteModal(false)
        setShowAlreadyReviewedModal(true)
      } else if (errorMessage.includes('chơi') || errorMessage.includes('trận')) {
        // Check if error is "need to play game first"
        setShowWriteModal(false)
        setShowPlayRequiredModal(true)
      } else {
        message.error(errorMessage)
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Time ago helper
  const timeAgo = useCallback((date) => {
    if (!date) return ''
    const d = new Date(date)
    const diff = Math.floor((Date.now() - d.getTime()) / 1000)
    if (diff < 60) return 'Vừa xong'
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`
    if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`
    return d.toLocaleDateString('vi-VN')
  }, [])

  // Calculate stats
  const positiveCount = reviews.filter(r => r.rating >= 4).length
  const negativeCount = reviews.filter(r => r.rating < 4).length
  const positivePercent = reviews.length > 0 ? Math.round((positiveCount / reviews.length) * 100) : 0

  // Get review sentiment label (Steam-style)
  const getSentimentLabel = (percent) => {
    if (percent >= 95) return { label: 'Overwhelmingly Positive', color: 'text-blue-400' }
    if (percent >= 80) return { label: 'Very Positive', color: 'text-blue-400' }
    if (percent >= 70) return { label: 'Mostly Positive', color: 'text-blue-400' }
    if (percent >= 40) return { label: 'Mixed', color: 'text-yellow-500' }
    if (percent >= 20) return { label: 'Mostly Negative', color: 'text-orange-500' }
    return { label: 'Very Negative', color: 'text-red-500' }
  }

  const sentiment = getSentimentLabel(positivePercent)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Game Selector Tabs - Steam Style */}
      <div className={`mb-6 p-1 rounded-lg inline-flex gap-1 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'
        }`}>
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => setSelectedGame(game)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${selectedGame?.id === game.id
              ? isDarkMode
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md'
                : 'bg-white text-slate-900 shadow-md'
              : isDarkMode
                ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-gray-50'
              }`}
          >
            {game.name}
          </button>
        ))}
      </div>

      {/* Overall Summary Card - Steam Style */}
      <div className={`rounded-lg mb-6 overflow-hidden ${isDarkMode ? 'bg-[#1b2838]' : 'bg-white border border-gray-200 shadow-sm'
        }`}>
        <div className={`px-4 py-3 border-b ${isDarkMode ? 'bg-[#1b2838] border-slate-700' : 'bg-gray-50 border-gray-200'
          }`}>
          <h2 className={`text-sm font-bold uppercase tracking-wide ${isDarkMode ? 'text-gray-300' : 'text-slate-700'
            }`}>
            OVERALL REVIEWS
          </h2>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-8">
            {/* Sentiment */}
            <div>
              <div className={`text-2xl font-bold ${sentiment.color}`}>
                {sentiment.label}
              </div>
              <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                {positivePercent}% trong số {reviews.length} đánh giá là tích cực
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'}`}>
                  <ThumbsUp className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {positiveCount}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                    Tích cực
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-red-500/10' : 'bg-red-50'}`}>
                  <ThumbsDown className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {negativeCount}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                    Tiêu cực
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-2 rounded-full overflow-hidden bg-red-500">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all"
              style={{ width: `${positivePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
            Sắp xếp:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer ${isDarkMode
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'bg-white text-slate-900 border border-gray-200'
              }`}
          >
            <option value="recent">Mới nhất</option>
            <option value="helpful">Hữu ích nhất</option>
            <option value="positive">Tích cực</option>
            <option value="negative">Tiêu cực</option>
          </select>
        </div>

        {authenticated && (
          <button
            onClick={handleWriteReviewClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium hover:from-blue-700 hover:to-blue-600 transition-all cursor-pointer"
          >
            <PenLine className="w-4 h-4" />
            Viết đánh giá
          </button>
        )}
      </div>

      {/* Reviews List - Steam Style */}
      {reviewsLoading ? (
        <div className="flex justify-center py-16">
          <Spin size="large" />
        </div>
      ) : reviews.length === 0 ? (
        <div className={`text-center py-16 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'
          }`}>
          <MessageSquare className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
            Chưa có đánh giá nào
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {reviews.map((review, index) => {
              const isPositive = review.rating >= 4
              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`rounded-lg overflow-hidden ${isDarkMode ? 'bg-[#1b2838]' : 'bg-white border border-gray-200'
                    }`}
                >
                  <div className="flex">
                    {/* Left - User Info (Steam style) */}
                    <div className={`w-48 flex-shrink-0 p-4 ${isDarkMode ? 'bg-[#16202d]' : 'bg-gray-50 border-r border-gray-200'
                      }`}>
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar
                          size={40}
                          src={review.avatar_url}
                          style={{
                            background: !review.avatar_url
                              ? 'linear-gradient(135deg, #1a9fff, #0050a0)'
                              : undefined
                          }}
                        >
                          {review.username?.[0]?.toUpperCase() || 'U'}
                        </Avatar>
                        <div className="min-w-0">
                          <p className={`font-medium text-sm truncate ${isDarkMode ? 'text-blue-400' : 'text-blue-600'
                            }`}>
                            {review.username || 'Ẩn danh'}
                          </p>
                        </div>
                      </div>

                      {/* Mock playtime */}
                      <div className={`text-xs space-y-1 ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          <span>{Math.floor(Math.random() * 50 + 5)} giờ chơi</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          <span>{timeAgo(review.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right - Review Content */}
                    <div className="flex-1 p-4">
                      {/* Recommendation Badge */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded ${isPositive
                          ? isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                          : isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                          }`}>
                          {isPositive ? (
                            <>
                              <ThumbsUp className="w-4 h-4" />
                              <span className="text-sm font-medium">Khuyên chơi</span>
                            </>
                          ) : (
                            <>
                              <ThumbsDown className="w-4 h-4" />
                              <span className="text-sm font-medium">Không khuyên</span>
                            </>
                          )}
                        </div>
                        <Rate disabled value={review.rating} className="text-sm" />
                      </div>

                      {/* Review Text */}
                      <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                        {review.comment || 'Người dùng không để lại nhận xét.'}
                      </p>

                      {/* Footer - Helpful */}
                      <div className={`flex items-center gap-4 mt-4 pt-3 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-100'
                        }`}>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                          Đánh giá này có hữu ích?
                        </span>
                        <div className="flex gap-2">
                          <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors cursor-pointer ${isDarkMode
                            ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                            }`}>
                            <ThumbsUp className="w-3.5 h-3.5" />
                            Có
                          </button>
                          <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors cursor-pointer ${isDarkMode
                            ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                            }`}>
                            <ThumbsDown className="w-3.5 h-3.5" />
                            Không
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Write Review Modal - Steam Style */}
      <Modal
        title={null}
        open={showWriteModal}
        onCancel={() => setShowWriteModal(false)}
        footer={null}
        width={560}
        centered
        destroyOnHidden
      >
        <div className="space-y-6">
          <div className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Viết đánh giá cho {selectedGame?.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Chia sẻ trải nghiệm của bạn về game này
            </p>
          </div>

          {/* 5-Star Rating Selection */}
          <div className="text-center py-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Đánh giá của bạn
            </p>
            <Rate
              value={newRating}
              onChange={setNewRating}
              className="text-4xl"
              style={{ fontSize: 36 }}
            />
            <p className="mt-3 text-lg font-medium text-blue-600 dark:text-blue-400">
              {newRating === 5 && 'Tuyệt vời!'}
              {newRating === 4 && 'Rất tốt'}
              {newRating === 3 && 'Bình thường'}
              {newRating === 2 && 'Chưa tốt'}
              {newRating === 1 && 'Rất tệ'}
            </p>
          </div>

          {/* Comment */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nhận xét của bạn
            </p>
            <TextArea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về game này..."
              rows={5}
              maxLength={1000}
              showCount
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => setShowWriteModal(false)}
              className="flex-1 h-11"
            >
              Hủy
            </Button>
            <Button
              type="primary"
              loading={submitting}
              onClick={handleSubmitReview}
              className="flex-1 h-11"
              style={{
                background: 'linear-gradient(135deg, #1a9fff, #0050a0)',
                border: 'none'
              }}
            >
              Đăng đánh giá
            </Button>
          </div>
        </div>
      </Modal>

      {/* Play Required Modal - Beautiful Gaming Theme */}
      <Modal
        title={null}
        open={showPlayRequiredModal}
        onCancel={() => setShowPlayRequiredModal(false)}
        footer={null}
        width={440}
        centered
        destroyOnHidden
      >
        <div className="text-center py-6">
          {/* Animated Icon */}
          <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isDarkMode
            ? 'bg-gradient-to-br from-amber-500/20 to-orange-600/20'
            : 'bg-gradient-to-br from-amber-50 to-orange-100'
            }`}>
            <Gamepad2 className={`w-10 h-10 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'
              }`} />
          </div>

          {/* Title */}
          <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
            Bạn cần chơi game trước!
          </h3>

          {/* Description */}
          <p className={`text-sm mb-6 max-w-xs mx-auto ${isDarkMode ? 'text-gray-400' : 'text-slate-600'
            }`}>
            Để đảm bảo chất lượng đánh giá, bạn cần hoàn thành ít nhất
            <span className={`font-semibold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}> một trận game </span>
            trước khi có thể viết đánh giá cho <span className="font-semibold">{selectedGame?.name}</span>.
          </p>

          {/* Game Card Preview */}
          <div className={`mx-auto max-w-xs p-4 rounded-lg mb-6 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'
            }`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                }`}>
                <Award className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div className="text-left">
                <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {selectedGame?.name}
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                  Chơi ngay để mở khóa đánh giá
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => setShowPlayRequiredModal(false)}
              className="px-6"
            >
              Để sau
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setShowPlayRequiredModal(false)
                window.location.href = '/boardgame'
              }}
              className="px-6"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: 'none'
              }}
            >
              <Gamepad2 className="w-4 h-4 mr-2" />
              Chơi ngay
            </Button>
          </div>
        </div>
      </Modal>

      {/* Already Reviewed Modal */}
      <Modal
        title={null}
        open={showAlreadyReviewedModal}
        onCancel={() => setShowAlreadyReviewedModal(false)}
        footer={null}
        width={440}
        centered
        destroyOnHidden
      >
        <div className="text-center py-6">
          {/* Icon */}
          <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isDarkMode
            ? 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20'
            : 'bg-gradient-to-br from-blue-50 to-indigo-100'
            }`}>
            <CheckCircle className={`w-10 h-10 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
          </div>

          {/* Title */}
          <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
            Bạn đã đánh giá game này rồi!
          </h3>

          {/* Description */}
          <p className={`text-sm mb-6 max-w-xs mx-auto ${isDarkMode ? 'text-gray-400' : 'text-slate-600'
            }`}>
            Mỗi người chơi chỉ có thể đánh giá một lần cho mỗi game.
            Đánh giá của bạn cho <span className="font-semibold">{selectedGame?.name}</span> đã được ghi nhận.
          </p>

          {/* Game Card Preview */}
          <div className={`mx-auto max-w-xs p-4 rounded-lg mb-6 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'
            }`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-green-500/20' : 'bg-green-100'
                }`}>
                <ThumbsUp className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <div className="text-left">
                <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Cảm ơn bạn!
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                  Đánh giá của bạn giúp cộng đồng
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <Button
              type="primary"
              onClick={() => setShowAlreadyReviewedModal(false)}
              className="px-6"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                border: 'none'
              }}
            >
              Đã hiểu
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

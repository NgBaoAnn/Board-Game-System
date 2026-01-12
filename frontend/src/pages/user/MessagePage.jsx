import { useState, useEffect, useCallback, useRef } from 'react'
import { Input, Spin, message as antMessage } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MessageCircle, UserPlus, RefreshCw, AlertCircle, Users } from 'lucide-react'
import { ConversationItem } from '@/components/Message/ConversationItem'
import { MessageBubble } from '@/components/Message/MessageBubble'
import { ChatInput } from '@/components/Message/ChatInput'
import { ChatHeader } from '@/components/Message/ChatHeader'
import { TypingIndicator } from '@/components/Message/TypingIndicator'
import conversationApi from '@/api/api-conversation'
import friendApi from '@/api/api-friend'
import { useAuth } from '@/store/useAuth'
import { useNavigate } from 'react-router-dom'

// Helper to generate initials from username
function getInitials(name) {
  if (!name) return '?'
  const parts = name.split(' ')
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

// Helper to generate consistent gradient from username
function getGradient(name) {
  const gradients = [
    'from-indigo-400 to-purple-500',
    'from-orange-400 to-red-500',
    'from-green-400 to-teal-500',
    'from-blue-400 to-cyan-500',
    'from-pink-400 to-rose-500',
    'from-amber-400 to-orange-500',
  ]
  if (!name) return gradients[0]
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return gradients[hash % gradients.length]
}

// Helper to format time
function formatTime(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}

// Transform friend to conversation format
function transformFriend(friend) {
  return {
    id: null, // Conversation ID - will be set when conversation is created/fetched
    friendId: friend.id, // Keep friend ID for creating conversation
    name: friend.username,
    initials: getInitials(friend.username),
    gradient: getGradient(friend.username),
    avatar: friend.avatar_url,
    status: 'offline', // Can be enhanced with online status later
    time: '', // No recent message time for new conversations
    lastMessage: 'Bắt đầu trò chuyện...', // Placeholder
    unreadCount: 0,
    isTyping: false,
  }
}

// Transform API message to frontend format
function transformMessage(apiMessage, currentUserId) {
  const isOwn = apiMessage.sender_id === currentUserId
  return {
    id: apiMessage.id,
    content: apiMessage.content,
    time: formatTime(apiMessage.created_at),
    isOwn,
    read: true, // Could be enhanced with read receipts
    reaction: apiMessage.reaction || null,
    // File attachment fields
    file_url: apiMessage.file_url,
    file_name: apiMessage.file_name,
    file_type: apiMessage.file_type,
    file_size: apiMessage.file_size,
    // Sender info
    senderAvatar: apiMessage.sender_avatar,
    initials: getInitials(apiMessage.sender_username),
    gradient: getGradient(apiMessage.sender_username),
  }
}

function EmptyState({ type = 'chat', onRetry, onFindFriends }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex flex-col items-center justify-center text-center p-8"
    >
      <div className="text-6xl mb-4">
        {type === 'friends' ? '�' : type === 'error' ? '⚠️' : '🎮'}
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        {type === 'friends' ? 'Chưa có bạn bè' : type === 'error' ? 'Có lỗi xảy ra' : 'Chọn một cuộc trò chuyện'}
      </h3>
      <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 max-w-xs">
        {type === 'friends'
          ? 'Kết bạn với người chơi khác để bắt đầu trò chuyện!'
          : type === 'error'
          ? 'Không thể tải dữ liệu. Vui lòng thử lại.'
          : 'Chọn một người bạn để bắt đầu nhắn tin'}
      </p>
      {type === 'friends' && onFindFriends && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onFindFriends}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00f0ff] to-[#a855f7] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#00f0ff]/30 transition-shadow"
        >
          <UserPlus size={18} />
          Tìm bạn bè
        </motion.button>
      )}
      {type === 'error' && onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1d7af2] to-[#6366f1] text-white font-bold rounded-xl hover:shadow-lg transition-shadow"
        >
          <RefreshCw size={18} />
          Thử lại
        </motion.button>
      )}
    </motion.div>
  )
}

function LoadingState() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Spin size="large" />
    </div>
  )
}

export default function MessagePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  
  // Friends state (displayed as conversations)
  const [friends, setFriends] = useState([])
  const [friendsLoading, setFriendsLoading] = useState(true)
  const [friendsError, setFriendsError] = useState(null)
  
  // Active conversation
  const [activeConversation, setActiveConversation] = useState(null)
  
  // Messages state
  const [messages, setMessages] = useState([])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [messagesError, setMessagesError] = useState(null)
  
  // Sending state
  const [sending, setSending] = useState(false)
  
  // Ref for scrolling to bottom
  const messagesEndRef = useRef(null)

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Navigate to community page to find friends
  const handleFindFriends = useCallback(() => {
    navigate('/community')
  }, [navigate])

  // Fetch friends list and their conversation data
  const fetchFriends = useCallback(async () => {
    try {
      setFriendsLoading(true)
      setFriendsError(null)
      
      // Fetch friends and conversations in parallel
      const [friendsResponse, convsResponse] = await Promise.all([
        friendApi.getFriends(1, 100),
        conversationApi.getConversations(1, 100)
      ])
      
      const friendsData = friendsResponse.data?.data || []
      const convsData = convsResponse.data?.data || []
      
      // Create a map of friend conversations by user_id
      const convMap = new Map()
      convsData.forEach((conv) => {
        convMap.set(conv.user_id, conv)
      })
      
      // Transform friends with conversation data
      const transformed = friendsData.map((friend) => {
        const conv = convMap.get(friend.id)
        
        // Determine last message preview
        let lastMessage = ''
        if (conv) {
          if (conv.last_message_file) {
            lastMessage = '📎 Đã gửi tệp đính kèm'
          } else if (conv.last_message) {
            // Truncate message
            lastMessage = conv.last_message.length > 30 
              ? conv.last_message.substring(0, 30) + '...' 
              : conv.last_message
          }
        }
        
        return {
          id: conv?.conversation_id || null,
          friendId: friend.id,
          name: friend.username,
          initials: getInitials(friend.username),
          gradient: getGradient(friend.username),
          avatar: friend.avatar_url,
          status: 'offline',
          time: conv?.last_message_at ? formatTime(conv.last_message_at) : '',
          lastMessage: lastMessage || '', // Empty if no messages
          unreadCount: conv?.unread_count || 0,
          isTyping: false,
        }
      })
      
      // Sort: unread first, then by time
      transformed.sort((a, b) => {
        if (a.unreadCount > 0 && b.unreadCount === 0) return -1
        if (a.unreadCount === 0 && b.unreadCount > 0) return 1
        return 0
      })
      
      setFriends(transformed)
    } catch (error) {
      console.error('Failed to fetch friends:', error)
      setFriendsError(error.message || 'Không thể tải danh sách bạn bè')
    } finally {
      setFriendsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFriends()
  }, [fetchFriends])

  // Fetch or create conversation and load messages
  const fetchConversationAndMessages = useCallback(async (friend) => {
    if (!friend || !user) return
    
    try {
      setMessagesLoading(true)
      setMessagesError(null)
      setMessages([])
      
      // Get or create conversation with this friend
      const convResponse = await conversationApi.getOrCreateConversation(friend.friendId)
      const conversationData = convResponse.data
      
      // Update active conversation with real conversation ID
      const updatedConversation = {
        ...friend,
        id: conversationData.id,
      }
      setActiveConversation(updatedConversation)
      
      // Now fetch messages for this conversation
      const msgResponse = await conversationApi.getMessages(conversationData.id, 1, 100)
      const messagesData = msgResponse.data?.data || []
      
      // API returns newest first, reverse for display
      const transformed = messagesData.map((msg) => transformMessage(msg, user.id)).reverse()
      setMessages(transformed)
      setTimeout(scrollToBottom, 100)

      // Mark messages as read when conversation is opened
      try {
        await conversationApi.markAsRead(conversationData.id)
      } catch (e) {
        console.error('Failed to mark as read:', e)
      }
    } catch (error) {
      console.error('Failed to fetch conversation/messages:', error)
      setMessagesError(error.message || 'Không thể tải tin nhắn')
    } finally {
      setMessagesLoading(false)
    }
  }, [user, scrollToBottom])

  // Handle friend selection
  const handleSelectFriend = useCallback((friend) => {
    // Set initial active conversation (without conversation ID yet)
    setActiveConversation(friend)
    // Fetch/create conversation and load messages
    fetchConversationAndMessages(friend)
  }, [fetchConversationAndMessages])

  // Send message
  const handleSendMessage = useCallback(async (content) => {
    if (!activeConversation?.id || !content.trim() || sending) return

    try {
      setSending(true)
      const response = await conversationApi.sendMessage(activeConversation.id, content)
      const newMessage = response.data
      
      // Transform and add to messages
      const transformed = transformMessage(newMessage, user.id)
      setMessages((prev) => [...prev, transformed])
      
      // Scroll to bottom
      setTimeout(scrollToBottom, 100)
    } catch (error) {
      console.error('Failed to send message:', error)
      antMessage.error('Không thể gửi tin nhắn')
    } finally {
      setSending(false)
    }
  }, [activeConversation, user, sending, scrollToBottom])

  // Send message with file attachment
  const handleSendFile = useCallback(async (content, file) => {
    if (!activeConversation?.id || sending) return

    try {
      setSending(true)
      const response = await conversationApi.sendMessage(activeConversation.id, content, file)
      const newMessage = response.data
      
      // Transform and add to messages
      const transformed = transformMessage(newMessage, user.id)
      setMessages((prev) => [...prev, transformed])
      
      // Scroll to bottom
      setTimeout(scrollToBottom, 100)
    } catch (error) {
      console.error('Failed to send file:', error)
      antMessage.error('Không thể gửi tệp')
    } finally {
      setSending(false)
    }
  }, [activeConversation, user, sending, scrollToBottom])

  // Handle reaction - call API and update local state
  const handleReaction = useCallback(async (messageId, emoji) => {
    // Optimistic update
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, reaction: emoji } : m))
    )
    
    try {
      await conversationApi.reactToMessage(messageId, emoji)
    } catch (error) {
      console.error('Failed to react to message:', error)
      // Revert on error
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, reaction: null } : m))
      )
      antMessage.error('Không thể thêm reaction')
    }
  }, [])

  // Filter friends by search
  const filteredFriends = friends.filter((f) =>
    f.name.toLowerCase().includes(searchText.toLowerCase())
  )

  return (
    <div className="absolute inset-0 flex overflow-hidden">
      {/* Sidebar - Friends List */}
      <div className="w-full md:w-80 lg:w-96 flex flex-col border-r border-gray-200/50 dark:border-slate-700/30 bg-white/80 dark:bg-slate-800/40 backdrop-blur-md">
        {/* Header */}
        <div className="p-4 border-b border-gray-200/50 dark:border-slate-700/30 flex justify-between items-center">
          <h2 className="font-bold text-lg text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-[#00f0ff] dark:to-[#a855f7] flex items-center gap-2">
            <MessageCircle size={20} className="text-[#1d7af2] dark:text-[#00f0ff]" />
            Tin nhắn
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-full flex items-center gap-1">
              <Users size={12} />
              {friends.length}
            </span>
            <button 
              onClick={fetchFriends}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-[#1d7af2] dark:text-[#00f0ff] transition-colors"
            >
              <RefreshCw size={18} className={friendsLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200/50 dark:border-slate-700/30">
          <Input
            placeholder="Tìm kiếm bạn bè..."
            prefix={<Search className="text-gray-400 dark:text-slate-400" size={16} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="rounded-xl"
          />
        </div>

        {/* Friends List */}
        <div className="flex-1 overflow-y-auto">
          {friendsLoading ? (
            <LoadingState />
          ) : friendsError ? (
            <EmptyState type="error" onRetry={fetchFriends} />
          ) : filteredFriends.length > 0 ? (
            filteredFriends.map((friend, index) => (
              <motion.div
                key={friend.friendId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ConversationItem
                  conversation={friend}
                  isActive={activeConversation?.friendId === friend.friendId}
                  onClick={handleSelectFriend}
                />
              </motion.div>
            ))
          ) : (
            <EmptyState type="friends" onFindFriends={handleFindFriends} />
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="hidden md:flex flex-1 flex-col bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm relative">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <ChatHeader conversation={activeConversation} />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
              {messagesLoading ? (
                <LoadingState />
              ) : messagesError ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <AlertCircle size={48} className="text-red-500 mb-4" />
                  <p className="text-gray-500 dark:text-slate-400 mb-4">Không thể tải tin nhắn</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fetchConversationAndMessages(activeConversation)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1d7af2] text-white rounded-lg"
                  >
                    <RefreshCw size={16} />
                    Thử lại
                  </motion.button>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="text-5xl mb-4">👋</div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Bắt đầu cuộc trò chuyện
                  </h3>
                  <p className="text-gray-500 dark:text-slate-400">
                    Gửi tin nhắn đầu tiên cho {activeConversation.name}!
                  </p>
                </div>
              ) : (
                <>
                  {/* Date separator */}
                  <div className="flex items-center justify-center my-4">
                    <span className="text-xs text-gray-500 dark:text-slate-400 bg-gray-200 dark:bg-slate-800 px-3 py-1 rounded-full">
                      Hôm nay
                    </span>
                  </div>

                  {/* Messages */}
                  <AnimatePresence>
                    {messages.map((message, index) => {
                      const showAvatar = index === 0 || messages[index - 1]?.isOwn !== message.isOwn
                      return (
                        <MessageBubble
                          key={message.id}
                          message={message}
                          isOwn={message.isOwn}
                          showAvatar={showAvatar}
                          recipientAvatar={activeConversation?.avatar}
                          recipientInitials={activeConversation?.initials}
                          recipientGradient={activeConversation?.gradient}
                          onReact={handleReaction}
                        />
                      )
                    })}
                  </AnimatePresence>

                  {/* Typing indicator */}
                  {activeConversation.isTyping && (
                    <TypingIndicator
                      initials={activeConversation.initials}
                      gradient={activeConversation.gradient}
                    />
                  )}
                  
                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Chat Input */}
            <ChatInput 
              onSend={handleSendMessage}
              onSendFile={handleSendFile}
              disabled={sending || !activeConversation.id} 
            />
          </>
        ) : (
          <EmptyState type="chat" />
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Input } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Edit3, MessageCircle, UserPlus } from 'lucide-react'
import { ConversationItem } from '@/components/Message/ConversationItem'
import { MessageBubble } from '@/components/Message/MessageBubble'
import { ChatInput } from '@/components/Message/ChatInput'
import { ChatHeader } from '@/components/Message/ChatHeader'
import { TypingIndicator } from '@/components/Message/TypingIndicator'

// Mock data with game status
const conversationsData = [
  {
    id: 1,
    name: 'Jane Smith',
    initials: 'JS',
    gradient: 'from-indigo-400 to-purple-500',
    status: 'online',
    gameStatus: 'Playing Chess',
    activity: 'Won Chess 2h ago',
    time: '12:30 PM',
    lastMessage: 'Are you up for a game of Catan?',
    unreadCount: 0,
    isTyping: false,
  },
  {
    id: 2,
    name: 'Mike Davis',
    initials: 'MD',
    gradient: 'from-orange-400 to-red-500',
    status: 'online',
    gameStatus: null,
    activity: null,
    time: 'Yesterday',
    lastMessage: 'Good game! That was intense.',
    unreadCount: 0,
    isTyping: true,
  },
  {
    id: 3,
    name: 'Board Gamers Guild',
    initials: 'BG',
    gradient: 'from-green-400 to-teal-500',
    status: 'online',
    gameStatus: null,
    time: 'Tue',
    lastMessage: 'Tournament starts in 1 hour!',
    unreadCount: 2,
    isTyping: false,
  },
  {
    id: 4,
    name: 'Anna K.',
    initials: 'AK',
    gradient: 'from-blue-400 to-cyan-500',
    status: 'offline',
    gameStatus: null,
    time: 'Mon',
    lastMessage: 'Sent you an invite.',
    unreadCount: 0,
    isTyping: false,
  },
]

const messagesData = {
  1: [
    { id: 1, content: 'Hey Jane! Long time no see on the leaderboard.', time: '12:25 PM', isOwn: true, read: true, senderAvatar: 'https://i.pravatar.cc/150?img=11' },
    { id: 2, content: "Absolutely! I've been practicing my resource management strategies.", time: '12:28 PM', isOwn: false, initials: 'JS', gradient: 'from-indigo-400 to-purple-500' },
    { id: 3, content: 'Are you up for a game of Catan?', time: '12:30 PM', isOwn: true, read: true, senderAvatar: 'https://i.pravatar.cc/150?img=11' },
  ],
  2: [
    { id: 1, content: 'That last move was brilliant!', time: '5:00 PM', isOwn: false, initials: 'MD', gradient: 'from-orange-400 to-red-500' },
    { id: 2, content: 'Thanks! I was worried you had me there.', time: '5:02 PM', isOwn: true, read: true, senderAvatar: 'https://i.pravatar.cc/150?img=11' },
    { id: 3, content: 'Good game! That was intense.', time: '5:05 PM', isOwn: false, initials: 'MD', gradient: 'from-orange-400 to-red-500', reaction: '🔥' },
  ],
}

// Empty State Component
function EmptyState({ type = 'chat' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex flex-col items-center justify-center text-center p-8"
    >
      <div className="text-6xl mb-4">
        {type === 'conversations' ? '💬' : '🎮'}
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        {type === 'conversations' ? 'No Conversations Yet' : 'Select a Chat'}
      </h3>
      <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 max-w-xs">
        {type === 'conversations'
          ? 'Start chatting with other players!'
          : 'Choose a conversation to start messaging'}
      </p>
      {type === 'conversations' && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00f0ff] to-[#a855f7] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#00f0ff]/30 transition-shadow"
        >
          <UserPlus size={18} />
          Find Players
        </motion.button>
      )}
    </motion.div>
  )
}

export default function MessagePage() {
  const [searchText, setSearchText] = useState('')
  const [activeConversation, setActiveConversation] = useState(conversationsData[0])
  const [messages, setMessages] = useState(messagesData)

  const filteredConversations = conversationsData.filter((c) =>
    c.name.toLowerCase().includes(searchText.toLowerCase())
  )

  const currentMessages = messages[activeConversation?.id] || []

  const handleSendMessage = (content) => {
    if (!activeConversation) return

    const newMessage = {
      id: Date.now(),
      content,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      isOwn: true,
      read: false,
      senderAvatar: 'https://i.pravatar.cc/150?img=11',
    }

    setMessages((prev) => ({
      ...prev,
      [activeConversation.id]: [...(prev[activeConversation.id] || []), newMessage],
    }))
  }

  const handleReaction = (messageId, emoji) => {
    setMessages((prev) => ({
      ...prev,
      [activeConversation.id]: prev[activeConversation.id].map((m) =>
        m.id === messageId ? { ...m, reaction: emoji } : m
      ),
    }))
  }

  return (
    <div className="absolute inset-0 flex overflow-hidden">
      {/* Conversation List */}
      <div className="w-full md:w-80 lg:w-96 flex flex-col border-r border-gray-200/50 dark:border-slate-700/30 bg-white/80 dark:bg-slate-800/40 backdrop-blur-md">
        {/* Header */}
        <div className="p-4 border-b border-gray-200/50 dark:border-slate-700/30 flex justify-between items-center">
          <h2 className="font-bold text-lg text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-[#00f0ff] dark:to-[#a855f7] flex items-center gap-2">
            <MessageCircle size={20} className="text-[#1d7af2] dark:text-[#00f0ff]" />
            Chats
          </h2>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-[#1d7af2] dark:text-[#00f0ff] transition-colors">
            <Edit3 size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200/50 dark:border-slate-700/30">
          <Input
            placeholder="Search conversations..."
            prefix={<Search className="text-gray-400 dark:text-slate-400" size={16} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="rounded-xl"
          />
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation, index) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ConversationItem
                  conversation={conversation}
                  isActive={activeConversation?.id === conversation.id}
                  onClick={setActiveConversation}
                />
              </motion.div>
            ))
          ) : (
            <EmptyState type="conversations" />
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="hidden md:flex flex-1 flex-col bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm relative">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <ChatHeader conversation={activeConversation} />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
              {/* Date Separator */}
              <div className="flex items-center justify-center my-4">
                <span className="text-xs text-gray-500 dark:text-slate-400 bg-gray-200 dark:bg-slate-800 px-3 py-1 rounded-full">
                  Today
                </span>
              </div>

              {/* Messages */}
              <AnimatePresence>
                {currentMessages.map((message, index) => {
                  const showAvatar = index === 0 || currentMessages[index - 1]?.isOwn !== message.isOwn
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
            </div>

            {/* Input */}
            <ChatInput onSend={handleSendMessage} />
          </>
        ) : (
          <EmptyState type="chat" />
        )}
      </div>
    </div>
  )
}

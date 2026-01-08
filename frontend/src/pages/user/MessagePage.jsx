import { useState } from 'react'
import { Input, Empty } from 'antd'
import { Search, Edit3 } from 'lucide-react'
import { ConversationItem } from '@/components/Message/ConversationItem'
import { MessageBubble } from '@/components/Message/MessageBubble'
import { ChatInput } from '@/components/Message/ChatInput'
import { ChatHeader } from '@/components/Message/ChatHeader'

// Mock data
const conversationsData = [
  { id: 1, name: 'Jane Smith', initials: 'JS', gradient: 'from-indigo-400 to-purple-500', status: 'online', time: '12:30 PM', lastMessage: 'Are you up for a game of Catan?', unreadCount: 0 },
  { id: 2, name: 'Mike Davis', initials: 'MD', gradient: 'from-orange-400 to-red-500', status: 'offline', time: 'Yesterday', lastMessage: 'Good game! That was intense.', unreadCount: 0 },
  { id: 3, name: 'Board Gamers Guild', initials: 'BG', gradient: 'from-green-400 to-teal-500', status: 'online', time: 'Tue', lastMessage: 'Tournament starts in 1 hour!', unreadCount: 2 },
  { id: 4, name: 'Anna K.', initials: 'AK', gradient: 'from-blue-400 to-cyan-500', status: 'offline', time: 'Mon', lastMessage: 'Sent you an invite.', unreadCount: 0 },
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
    { id: 3, content: 'Good game! That was intense.', time: '5:05 PM', isOwn: false, initials: 'MD', gradient: 'from-orange-400 to-red-500' },
  ],
}

export default function MessagePage() {
  const [searchText, setSearchText] = useState('')
  const [activeConversation, setActiveConversation] = useState(conversationsData[0])
  const [messages, setMessages] = useState(messagesData)

  const filteredConversations = conversationsData.filter(c =>
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

    setMessages(prev => ({
      ...prev,
      [activeConversation.id]: [...(prev[activeConversation.id] || []), newMessage],
    }))
  }

  return (
    <div className="h-[calc(100vh-64px)] flex overflow-hidden p-4 lg:p-6 gap-6">
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex overflow-hidden">
        {/* Conversation List */}
        <div className="w-full md:w-80 lg:w-96 flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">Chats</h2>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-[#1d7af2] transition-colors">
              <Edit3 size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <Input
              placeholder="Search conversations..."
              prefix={<Search className="text-gray-400" size={18} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="rounded-lg"
            />
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={activeConversation?.id === conversation.id}
                  onClick={setActiveConversation}
                />
              ))
            ) : (
              <div className="p-8">
                <Empty description="No conversations found" />
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-1 flex-col bg-gray-50 dark:bg-gray-900/30 relative">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <ChatHeader conversation={activeConversation} />

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
                {/* Date Separator */}
                <div className="flex items-center justify-center my-4">
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                    Today
                  </span>
                </div>

                {/* Messages */}
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
                    />
                  )
                })}
              </div>

              {/* Input */}
              <ChatInput onSend={handleSendMessage} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <Empty description="Select a conversation to start chatting" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

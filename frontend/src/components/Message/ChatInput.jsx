import { useState, useRef } from 'react'
import { Popover } from 'antd'
import { Send, Smile, PlusCircle, Image, Paperclip, X, FileText } from 'lucide-react'

const emojis = ['😀', '😂', '😍', '🥰', '😎', '🤔', '👍', '👎', '❤️', '🔥', '🎮', '🎲', '🏆', '⭐', '🎯', '💪', '🙌', '👏', '🤝', '✌️']

// Check if file is an image
const isImageFile = (file) => {
  return file?.type?.startsWith('image/')
}

// Format file size
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export function ChatInput({ onSend, onSendFile, disabled }) {
  const [message, setMessage] = useState('')
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)
  const isSendingRef = useRef(false)

  const handleSend = () => {
    if (isSendingRef.current) return

    // Send with file
    if (selectedFile) {
      isSendingRef.current = true
      const content = message.trim()
      const file = selectedFile
      
      setMessage('')
      setSelectedFile(null)
      setFilePreview(null)
      
      onSendFile?.(content, file)
      
      setTimeout(() => {
        isSendingRef.current = false
        inputRef.current?.focus()
      }, 50)
      return
    }

    // Send text only
    const trimmedMessage = message.trim()
    if (trimmedMessage) {
      isSendingRef.current = true
      setMessage('')
      if (inputRef.current) {
        inputRef.current.value = ''
      }
      onSend?.(trimmedMessage)
      setTimeout(() => {
        isSendingRef.current = false
        inputRef.current?.focus()
      }, 50)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const insertEmoji = (emoji) => {
    setMessage(prev => prev + emoji)
    inputRef.current?.focus()
  }

  const handleFileSelect = (e, type) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File quá lớn. Giới hạn 5MB.')
      return
    }

    setSelectedFile(file)
    setShowAttachMenu(false)

    // Create preview for images
    if (isImageFile(file)) {
      const reader = new FileReader()
      reader.onload = (e) => setFilePreview(e.target.result)
      reader.readAsDataURL(file)
    } else {
      setFilePreview(null)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setFilePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  const emojiContent = (
    <div className="grid grid-cols-5 gap-2 p-2 w-48">
      {emojis.map((emoji, index) => (
        <button
          key={index}
          onClick={() => insertEmoji(emoji)}
          className="text-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 transition-colors"
        >
          {emoji}
        </button>
      ))}
    </div>
  )

  const attachContent = (
    <div className="flex flex-col p-2 min-w-[160px]">
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e, 'image')}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.zip,.rar"
        className="hidden"
        onChange={(e) => handleFileSelect(e, 'file')}
      />
      
      <button 
        onClick={() => imageInputRef.current?.click()}
        className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
      >
        <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
          <Image size={18} />
        </div>
        <span className="text-sm font-medium">Ảnh</span>
      </button>
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
      >
        <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Paperclip size={18} />
        </div>
        <span className="text-sm font-medium">Tệp</span>
      </button>
    </div>
  )

  const canSend = (message.trim() || selectedFile) && !disabled

  return (
    <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-md border-t border-gray-200/50 dark:border-slate-700/30">
      {/* File Preview */}
      {selectedFile && (
        <div className="px-4 pt-3">
          <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
            {filePreview ? (
              <img 
                src={filePreview} 
                alt="Preview" 
                className="w-16 h-16 object-cover rounded-lg"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                <FileText size={24} className="text-gray-500 dark:text-gray-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
            >
              <X size={18} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 flex items-center space-x-2">
        <Popover
          content={attachContent}
          trigger="click"
          placement="topLeft"
          open={showAttachMenu}
          onOpenChange={setShowAttachMenu}
        >
          <button className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#1d7af2] rounded-full transition-colors">
            <PlusCircle size={22} />
          </button>
        </Popover>

        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedFile ? "Thêm chú thích..." : "Nhập tin nhắn..."}
            disabled={disabled}
            className="w-full rounded-full pl-5 pr-12 py-3 bg-gray-100 dark:bg-gray-700 border-none text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1d7af2]/50"
          />
          
          <Popover content={emojiContent} trigger="click" placement="topRight">
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-[#1d7af2] transition-colors p-1">
              <Smile size={20} />
            </button>
          </Popover>
        </div>

        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`p-3 rounded-full shadow-lg transition-all transform flex items-center justify-center ${
            canSend
              ? 'bg-[#1d7af2] hover:bg-blue-600 text-white shadow-blue-500/30 hover:scale-105'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}

export default ChatInput

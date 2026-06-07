import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { messageService, chatService, userService } from '../services/firebaseService';
import { FiSend, FiSmile, FiImage, FiMic, FiMoreVertical } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';

const ChatWindow = ({ chatId, recipientId, recipientData }) => {
  const { user } = useAuth();
  const { bgColor, textColor, cardBg, borderColor } = useTheme();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [recipientTyping, setRecipientTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Load messages
  useEffect(() => {
    if (!chatId || !user) return;

    const unsubscribe = messageService.onMessagesChange(chatId, (newMessages) => {
      setMessages(newMessages);
      scrollToBottom();

      // Mark unseen messages as seen
      const unseenMessages = newMessages
        .filter((msg) => msg.senderId === recipientId && !msg.seen)
        .map((msg) => msg.id);

      if (unseenMessages.length > 0) {
        messageService.markMessagesAsSeen(chatId, unseenMessages, user.uid);
      }
    });

    return unsubscribe;
  }, [chatId, user, recipientId]);

  // Listen for typing indicator
  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = chatService.onTypingChange(chatId, (isTyping) => {
      setRecipientTyping(isTyping);
    });

    return unsubscribe;
  }, [chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = (text) => {
    setInputText(text);

    if (text.length > 0) {
      if (!isTyping) {
        setIsTyping(true);
        chatService.setTypingStatus(chatId, true);
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        chatService.setTypingStatus(chatId, false);
      }, 2000);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      await messageService.sendMessage(chatId, user.uid, inputText);
      await chatService.updateLastMessage(chatId, inputText, user.uid);
      setInputText('');
      setIsTyping(false);
      chatService.setTypingStatus(chatId, false);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setInputText((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleReaction = async (messageId, emoji) => {
    try {
      await messageService.addReaction(chatId, messageId, user.uid, emoji);
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await messageService.deleteMessage(chatId, messageId);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <div className={`flex flex-col h-screen ${bgColor}`}>
      {/* Chat Header */}
      <div className={`${cardBg} border-b ${borderColor} p-4 flex items-center justify-between`}>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center">
            <span className={`${textColor} font-bold`}>
              {recipientData?.displayName?.[0] || '?'}
            </span>
          </div>
          <div>
            <h2 className={`${textColor} font-bold`}>
              {recipientData?.displayName}
            </h2>
            <p className="text-gray-500 text-sm">
              {recipientTyping ? 'typing...' : 'online'}
            </p>
          </div>
        </div>
        <button className={`${textColor} hover:bg-gray-700 p-2 rounded-full transition`}>
          <FiMoreVertical size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === user.uid ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.senderId === user.uid
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-700 text-white'
              } ${message.deleted ? 'italic opacity-50' : ''}`}
            >
              {message.deleted ? (
                <p>This message was deleted</p>
              ) : (
                <>
                  {message.imageUrl && (
                    <img
                      src={message.imageUrl}
                      alt="Message"
                      className="max-w-xs rounded-lg mb-2"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </>
              )}
              <div className="text-xs mt-1 opacity-70">
                {message.timestamp?.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {message.senderId === user.uid && (
                  <span className="ml-2">
                    {message.seen ? '✓✓' : '✓'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`${cardBg} border-t ${borderColor} p-4`}>
        <form onSubmit={handleSendMessage} className="flex gap-2 items-end relative">
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-16 left-0">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`${textColor} hover:bg-gray-700 p-2 rounded-full transition`}
          >
            <FiSmile size={20} />
          </button>

          <button
            type="button"
            className={`${textColor} hover:bg-gray-700 p-2 rounded-full transition`}
          >
            <FiImage size={20} />
          </button>

          <button
            type="button"
            className={`${textColor} hover:bg-gray-700 p-2 rounded-full transition`}
          >
            <FiMic size={20} />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => handleTyping(e.target.value)}
            placeholder="Message..."
            className={`flex-1 px-4 py-2 rounded-full bg-gray-700 ${textColor} border border-gray-600 focus:border-pink-500 focus:outline-none`}
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 transition disabled:opacity-50"
          >
            <FiSend size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;

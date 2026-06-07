// Custom hook for chat management

import { useState, useEffect, useCallback } from 'react';
import { messageService, chatService } from '../services/firebaseService';

export const useChat = (chatId, userId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [recipientTyping, setRecipientTyping] = useState(false);

  // Load messages
  useEffect(() => {
    if (!chatId || !userId) return;

    setLoading(true);
    const unsubscribe = messageService.onMessagesChange(chatId, (newMessages) => {
      setMessages(newMessages);
      setLoading(false);

      // Mark unseen messages as seen
      const unseenMessages = newMessages
        .filter((msg) => msg.senderId !== userId && !msg.seen)
        .map((msg) => msg.id);

      if (unseenMessages.length > 0) {
        messageService.markMessagesAsSeen(chatId, unseenMessages, userId);
      }
    });

    return unsubscribe;
  }, [chatId, userId]);

  // Listen for typing
  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = chatService.onTypingChange(chatId, setRecipientTyping);
    return unsubscribe;
  }, [chatId]);

  // Send message
  const sendMessage = useCallback(
    async (text, mediaUrl = null, mediaType = null) => {
      try {
        setError(null);
        await messageService.sendMessage(chatId, userId, text, mediaUrl, mediaType);
        await chatService.updateLastMessage(chatId, text, userId);
        await chatService.setTypingStatus(chatId, false);
        setIsTyping(false);
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [chatId, userId]
  );

  // Delete message
  const deleteMessage = useCallback(
    async (messageId) => {
      try {
        await messageService.deleteMessage(chatId, messageId);
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [chatId]
  );

  // Add reaction
  const addReaction = useCallback(
    async (messageId, emoji) => {
      try {
        await messageService.addReaction(chatId, messageId, userId, emoji);
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [chatId, userId]
  );

  // Set typing status
  const setTyping = useCallback(
    async (typing) => {
      setIsTyping(typing);
      await chatService.setTypingStatus(chatId, typing);
    },
    [chatId]
  );

  return {
    messages,
    loading,
    error,
    isTyping,
    recipientTyping,
    sendMessage,
    deleteMessage,
    addReaction,
    setTyping,
  };
};

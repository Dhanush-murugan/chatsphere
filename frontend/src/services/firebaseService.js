// Firebase Firestore service for real-time messaging

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const messageService = {
  // Send a message
  async sendMessage(chatId, senderId, text, mediaUrl = null, mediaType = null) {
    try {
      const messageRef = await addDoc(collection(db, `messages/${chatId}/messages`), {
        senderId,
        text: text || '',
        imageUrl: mediaType === 'image' ? mediaUrl : null,
        voiceUrl: mediaType === 'voice' ? mediaUrl : null,
        timestamp: serverTimestamp(),
        seen: false,
        deleted: false,
        disappearing: false,
        reactions: {},
      });
      return messageRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Listen for messages in real-time
  onMessagesChange(chatId, callback) {
    const q = query(
      collection(db, `messages/${chatId}/messages`),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages = [];
      snapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate(),
        });
      });
      callback(messages);
    });
  },

  // Mark messages as seen
  async markMessagesAsSeen(chatId, messageIds, userId) {
    try {
      for (const messageId of messageIds) {
        await updateDoc(doc(db, `messages/${chatId}/messages/${messageId}`), {
          seen: true,
          seenAt: serverTimestamp(),
          seenBy: userId,
        });
      }
    } catch (error) {
      console.error('Error marking messages as seen:', error);
    }
  },

  // Delete message (soft delete)
  async deleteMessage(chatId, messageId) {
    try {
      await updateDoc(doc(db, `messages/${chatId}/messages/${messageId}`), {
        deleted: true,
        deletedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },

  // Add reaction to message
  async addReaction(chatId, messageId, userId, emoji) {
    try {
      const messageRef = doc(db, `messages/${chatId}/messages/${messageId}`);
      await updateDoc(messageRef, {
        [`reactions.${userId}`]: emoji,
      });
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  },

  // Remove reaction from message
  async removeReaction(chatId, messageId, userId) {
    try {
      const messageRef = doc(db, `messages/${chatId}/messages/${messageId}`);
      await updateDoc(messageRef, {
        [`reactions.${userId}`]: null,
      });
    } catch (error) {
      console.error('Error removing reaction:', error);
      throw error;
    }
  },

  // Get message count for a chat
  async getMessageCount(chatId) {
    try {
      const snapshot = await getDocs(
        collection(db, `messages/${chatId}/messages`)
      );
      return snapshot.size;
    } catch (error) {
      console.error('Error getting message count:', error);
      return 0;
    }
  },
};

export const chatService = {
  // Create a new chat
  async createChat(participants) {
    try {
      const chatRef = await addDoc(collection(db, 'chats'), {
        participants,
        createdAt: serverTimestamp(),
        lastMessage: '',
        lastMessageTime: serverTimestamp(),
        lastMessageSenderId: null,
      });
      return chatRef.id;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  },

  // Get chat by participants
  async getChatByParticipants(userId1, userId2) {
    try {
      const q = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', userId1)
      );
      const snapshot = await getDocs(q);
      
      let chatId = null;
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.participants.includes(userId2)) {
          chatId = doc.id;
        }
      });

      if (!chatId) {
        chatId = await this.createChat([userId1, userId2]);
      }
      return chatId;
    } catch (error) {
      console.error('Error getting chat:', error);
      throw error;
    }
  },

  // Listen for typing status
  onTypingChange(chatId, callback) {
    return onSnapshot(doc(db, 'chats', chatId), (doc) => {
      if (doc.exists()) {
        callback(doc.data().typing || false);
      }
    });
  },

  // Set typing status
  async setTypingStatus(chatId, isTyping) {
    try {
      await updateDoc(doc(db, 'chats', chatId), {
        typing: isTyping,
        typingAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  },

  // Update last message
  async updateLastMessage(chatId, lastMessage, senderId) {
    try {
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage,
        lastMessageTime: serverTimestamp(),
        lastMessageSenderId: senderId,
      });
    } catch (error) {
      console.error('Error updating last message:', error);
    }
  },
};

export const userService = {
  // Set user online status
  async setOnlineStatus(userId, isOnline) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        onlineStatus: isOnline ? 'online' : 'offline',
        lastSeen: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating online status:', error);
    }
  },

  // Get user info
  async getUser(userId) {
    try {
      const docSnapshot = await getDocs(
        query(collection(db, 'users'), where('uid', '==', userId))
      );
      if (!docSnapshot.empty) {
        return docSnapshot.docs[0].data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  // Listen for user status
  onUserStatusChange(userId, callback) {
    return onSnapshot(doc(db, 'users', userId), (doc) => {
      if (doc.exists()) {
        callback({
          onlineStatus: doc.data().onlineStatus,
          lastSeen: doc.data().lastSeen?.toDate(),
        });
      }
    });
  },
};

export const storyService = {
  // Create story
  async createStory(userId, mediaUrl) {
    try {
      const storyRef = await addDoc(
        collection(db, `stories/${userId}/stories`),
        {
          mediaUrl,
          timestamp: serverTimestamp(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          views: [],
        }
      );
      return storyRef.id;
    } catch (error) {
      console.error('Error creating story:', error);
      throw error;
    }
  },

  // Get stories from following users
  async getUserStories(userId) {
    try {
      const snapshot = await getDocs(
        collection(db, `stories/${userId}/stories`)
      );
      const stories = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.expiresAt.toDate() > new Date()) {
          stories.push({
            id: doc.id,
            ...data,
            timestamp: data.timestamp?.toDate(),
          });
        }
      });
      return stories;
    } catch (error) {
      console.error('Error getting stories:', error);
      return [];
    }
  },

  // View story
  async viewStory(userId, storyId, viewerId) {
    try {
      const storyRef = doc(db, `stories/${userId}/stories/${storyId}`);
      await updateDoc(storyRef, {
        'views': serverTimestamp(),
        [`viewedBy.${viewerId}`]: true,
      });
    } catch (error) {
      console.error('Error viewing story:', error);
    }
  },
};

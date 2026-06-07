import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import { chatService } from '../services/firebaseService';

const Chat = () => {
  const { user, userData } = useAuth();
  const { bgColor } = useTheme();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load chats from Firestore
  useEffect(() => {
    if (!user) return;

    const loadChats = async () => {
      try {
        // In a real app, you'd listen to Firestore for real-time updates
        setLoading(false);
      } catch (error) {
        console.error('Error loading chats:', error);
        setLoading(false);
      }
    };

    loadChats();
  }, [user]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  if (loading) {
    return (
      <div className={`${bgColor} h-screen flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${bgColor} h-screen flex`}>
      <Sidebar
        chats={chats}
        onSelectChat={handleSelectChat}
        selectedChatId={selectedChat?.id}
      />
      
      {selectedChat ? (
        <ChatWindow
          chatId={selectedChat.id}
          recipientId={selectedChat.recipientId}
          recipientData={selectedChat.recipientData}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <p>Select a chat to start messaging</p>
        </div>
      )}
    </div>
  );
};

export default Chat;

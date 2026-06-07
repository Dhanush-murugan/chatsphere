import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiSearch, FiLogOut, FiSettings, FiMoon, FiSun } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ chats, onSelectChat, selectedChatId }) => {
  const { user, userData, logout } = useAuth();
  const { isDark, toggleTheme, bgColor, textColor, cardBg, borderColor } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredChats = chats.filter((chat) =>
    chat.participantName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={`${cardBg} w-full md:w-80 h-screen border-r ${borderColor} flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700 space-y-4">
        {/* Profile */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center cursor-pointer hover:shadow-lg transition">
              <span className={`${textColor} font-bold text-lg`}>
                {userData?.displayName?.[0] || 'U'}
              </span>
            </div>
            <div>
              <p className={`${textColor} font-semibold text-sm`}>
                {userData?.displayName}
              </p>
              <p className="text-gray-500 text-xs">@{userData?.username}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              className={`${textColor} hover:bg-gray-700 p-2 rounded-full transition`}
            >
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <button
              onClick={() => navigate('/profile')}
              className={`${textColor} hover:bg-gray-700 p-2 rounded-full transition`}
            >
              <FiSettings size={18} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-full bg-gray-700 ${textColor} border border-gray-600 focus:border-pink-500 focus:outline-none text-sm`}
          />
        </div>

        {/* Story Bar */}
        <div className="flex gap-2 overflow-x-auto">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-blue-500 flex-shrink-0 cursor-pointer hover:shadow-lg transition"
            />
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={`p-3 border-b border-gray-700 cursor-pointer transition ${
                selectedChatId === chat.id
                  ? 'bg-gray-700'
                  : 'hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-blue-500 flex-shrink-0 flex items-center justify-center">
                  <span className={`${textColor} font-bold`}>
                    {chat.participantName?.[0] || '?'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`${textColor} font-semibold text-sm`}>
                    {chat.participantName}
                  </p>
                  <p className="text-gray-500 text-xs truncate">
                    {chat.lastMessage || 'No messages yet'}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={`p-4 text-center ${textColor} opacity-50`}>
            {searchTerm ? 'No chats found' : 'No chats yet'}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`p-4 border-t ${borderColor}`}>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

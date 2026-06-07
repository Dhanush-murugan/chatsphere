import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiSearch, FiX } from 'react-icons/fi';
import { userService } from '../services/api';
import { chatService } from '../services/firebaseService';

const UserSearch = ({ onChatCreate, onClose }) => {
  const { user } = useAuth();
  const { bgColor, textColor, cardBg, borderColor } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (query) => {
    setSearchTerm(query);
    setError('');

    if (query.length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await userService.searchUsers(query);
      setResults(data.filter(u => u.id !== user?.uid));
    } catch (err) {
      setError('Error searching users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = async (selectedUser) => {
    try {
      const chatId = await chatService.getChatByParticipants(
        user?.uid,
        selectedUser.firebase_uid
      );
      onChatCreate?.({ id: chatId, recipientId: selectedUser.id });
      onClose?.();
    } catch (err) {
      setError('Error creating chat');
    }
  };

  return (
    <div className={`fixed inset-0 ${bgColor} bg-opacity-50 flex items-center justify-center z-50`}>
      <div className={`${cardBg} rounded-3xl p-6 w-full max-w-md shadow-2xl`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className={`${textColor} text-2xl font-bold`}>Find Users</h2>
          <button
            onClick={onClose}
            className={`${textColor} hover:bg-gray-700 p-2 rounded-full transition`}
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by username..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 ${textColor} border border-gray-600 focus:border-pink-500 focus:outline-none`}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-2 mb-4 text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-4 text-gray-400">
            Searching...
          </div>
        )}

        {/* Results */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            results.map((result) => (
              <button
                key={result.id}
                onClick={() => handleSelectUser(result)}
                className={`w-full p-3 rounded-lg ${cardBg} hover:bg-gray-700 transition text-left flex items-center gap-3`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <span className={`${textColor} font-bold`}>
                    {result.display_name?.[0] || '?'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`${textColor} font-semibold text-sm`}>
                    {result.display_name}
                  </p>
                  <p className="text-gray-500 text-xs">@{result.username}</p>
                </div>
                {result.is_verified && (
                  <span className="text-blue-500 text-lg">✓</span>
                )}
              </button>
            ))
          ) : (
            searchTerm && !loading && (
              <div className={`text-center py-4 ${textColor} opacity-50`}>
                No users found
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearch;

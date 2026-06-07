import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSmile, FiHeart, FiZap, FiLaugh } from 'react-icons/fi';

const MessageItem = ({
  message,
  isOwn,
  onDelete,
  onReaction,
  onReply,
  senderName,
}) => {
  const { textColor, cardBg } = useTheme();
  const [showReactions, setShowReactions] = React.useState(false);

  const reactionEmojis = ['❤️', '🔥', '😂', '👏', '😍', '🤔'];

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3 group`}>
      <div className="relative max-w-xs lg:max-w-md">
        {/* Message bubble */}
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwn
              ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
              : 'bg-gray-700 text-white'
          } ${message.deleted ? 'italic opacity-50' : ''}`}
        >
          {/* Sender name (for group chats) */}
          {!isOwn && senderName && (
            <p className="text-xs font-bold opacity-75 mb-1">{senderName}</p>
          )}

          {/* Message content */}
          {message.deleted ? (
            <p className="text-sm">This message was deleted</p>
          ) : (
            <>
              {message.imageUrl && (
                <img
                  src={message.imageUrl}
                  alt="Message"
                  className="max-w-xs rounded-lg mb-2 cursor-pointer hover:opacity-90"
                />
              )}
              {message.voiceUrl && (
                <audio
                  controls
                  className="max-w-xs mb-2 h-8"
                  src={message.voiceUrl}
                />
              )}
              {message.text && <p className="text-sm break-words">{message.text}</p>}
            </>
          )}

          {/* Timestamp and seen status */}
          <div className="text-xs mt-1 opacity-70 flex items-center justify-between">
            <span>
              {message.timestamp?.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            {isOwn && (
              <span className="ml-2">
                {message.seen ? '✓✓' : '✓'}
              </span>
            )}
          </div>
        </div>

        {/* Reactions */}
        {message.reactions && Object.values(message.reactions).length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {Object.entries(message.reactions).map(([userId, emoji]) => (
              <div
                key={userId}
                className="text-lg cursor-pointer hover:scale-125 transition"
                onClick={() => onReaction?.(message.id, emoji)}
                title={emoji}
              >
                {emoji}
              </div>
            ))}
          </div>
        )}

        {/* Action buttons (on hover) */}
        <div className="hidden group-hover:flex absolute bottom-12 right-0 gap-2 bg-gray-800 rounded-lg p-2">
          <button
            onClick={() => setShowReactions(!showReactions)}
            className="text-white hover:bg-gray-700 p-1 rounded transition"
            title="Add reaction"
          >
            <FiSmile size={16} />
          </button>
          {isOwn && (
            <>
              <button
                onClick={() => onReply?.(message)}
                className="text-white hover:bg-gray-700 p-1 rounded transition"
                title="Reply"
              >
                <FiArrowLeft size={16} />
              </button>
              <button
                onClick={() => onDelete?.(message.id)}
                className="text-red-400 hover:bg-gray-700 p-1 rounded transition"
                title="Delete"
              >
                ×
              </button>
            </>
          )}
        </div>

        {/* Reaction picker */}
        {showReactions && (
          <div className="absolute bottom-12 right-0 bg-gray-800 rounded-lg p-2 flex gap-2">
            {reactionEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  onReaction?.(message.id, emoji);
                  setShowReactions(false);
                }}
                className="text-lg hover:scale-125 transition"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;

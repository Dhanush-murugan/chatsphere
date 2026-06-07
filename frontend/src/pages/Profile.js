import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiArrowLeft, FiEdit2, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, userData, logout } = useAuth();
  const { bgColor, textColor, cardBg, borderColor } = useTheme();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: userData?.displayName || '',
    bio: userData?.bio || '',
    username: userData?.username || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // Save to backend/Firestore
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={`${bgColor} min-h-screen`}>
      {/* Header */}
      <div className={`${cardBg} border-b ${borderColor} p-4 flex items-center gap-4`}>
        <button
          onClick={() => navigate('/chat')}
          className={`${textColor} hover:bg-gray-700 p-2 rounded-full transition`}
        >
          <FiArrowLeft size={24} />
        </button>
        <h1 className={`${textColor} text-2xl font-bold`}>Profile</h1>
      </div>

      {/* Profile Content */}
      <div className={`max-w-2xl mx-auto ${bgColor} p-6`}>
        {/* Profile Picture */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center mb-4">
            <span className={`${textColor} text-5xl font-bold`}>
              {userData?.displayName?.[0] || 'U'}
            </span>
          </div>
          {userData?.isVerified && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className={textColor}>Verified</span>
              <span className="text-blue-500">✓</span>
            </div>
          )}
        </div>

        {/* Profile Form */}
        <div className={`${cardBg} rounded-3xl p-6 space-y-6`}>
          {/* Display Name */}
          <div>
            <label className={`block text-sm font-medium ${textColor} mb-2`}>
              Full Name
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 rounded-lg bg-gray-700 ${textColor} border border-gray-600 focus:border-pink-500 focus:outline-none disabled:opacity-50`}
            />
          </div>

          {/* Username */}
          <div>
            <label className={`block text-sm font-medium ${textColor} mb-2`}>
              Username
            </label>
            <div className="flex items-center">
              <span className={`${textColor} mr-2`}>@</span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing}
                className={`flex-1 px-4 py-2 rounded-lg bg-gray-700 ${textColor} border border-gray-600 focus:border-pink-500 focus:outline-none disabled:opacity-50`}
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className={`block text-sm font-medium ${textColor} mb-2`}>
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              rows="4"
              className={`w-full px-4 py-2 rounded-lg bg-gray-700 ${textColor} border border-gray-600 focus:border-pink-500 focus:outline-none disabled:opacity-50`}
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className={`block text-sm font-medium ${textColor} mb-2`}>
              Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className={`w-full px-4 py-2 rounded-lg bg-gray-700 ${textColor} border border-gray-600 opacity-50 cursor-not-allowed`}
            />
          </div>

          {/* Edit/Save Buttons */}
          <div className="flex gap-4 pt-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                <FiEdit2 size={18} />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  Cancel
                </button>
              </>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

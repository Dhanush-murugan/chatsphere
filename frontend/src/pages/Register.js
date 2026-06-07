import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
  const { register, loading, error } = useAuth();
  const { bgColor, textColor, cardBg } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError('');
  };

  const validateForm = () => {
    if (!formData.displayName || !formData.email || !formData.username || !formData.password) {
      setFormError('All fields are required');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return false;
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
      setFormError('Username must be 3-20 characters (letters, numbers, underscore only)');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await register(
      formData.email,
      formData.password,
      formData.username,
      formData.displayName
    );

    if (result.success) {
      navigate('/chat');
    }
  };

  return (
    <div className={`min-h-screen ${bgColor} flex items-center justify-center p-4`}>
      <div className={`${cardBg} rounded-3xl shadow-2xl p-8 w-full max-w-md`}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent mb-2">
            ChatSphere
          </h1>
          <p className={`${textColor} opacity-70`}>Create your account</p>
        </div>

        {/* Error Message */}
        {(formError || error) && (
          <div className="bg-red-500/10 border border-red-500 rounded-xl p-3 mb-6 text-red-500 text-sm">
            {formError || error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display Name */}
          <div className="relative">
            <label className={`block text-sm font-medium ${textColor} mb-2`}>
              Full Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-4 top-3.5 text-gray-400" />
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 rounded-lg bg-gray-700 ${textColor} border border-gray-600 focus:border-pink-500 focus:outline-none transition`}
                placeholder="John Doe"
                disabled={loading}
              />
            </div>
          </div>

          {/* Username */}
          <div className="relative">
            <label className={`block text-sm font-medium ${textColor} mb-2`}>
              Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-400">@</span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 rounded-lg bg-gray-700 ${textColor} border border-gray-600 focus:border-pink-500 focus:outline-none transition`}
                placeholder="johndoe"
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <label className={`block text-sm font-medium ${textColor} mb-2`}>
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-3.5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 rounded-lg bg-gray-700 ${textColor} border border-gray-600 focus:border-pink-500 focus:outline-none transition`}
                placeholder="john@example.com"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="relative">
            <label className={`block text-sm font-medium ${textColor} mb-2`}>
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-3.5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-12 pr-12 py-3 rounded-lg bg-gray-700 ${textColor} border border-gray-600 focus:border-pink-500 focus:outline-none transition`}
                placeholder="••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className={`block text-sm font-medium ${textColor} mb-2`}>
              Confirm Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-3.5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-12 pr-12 py-3 rounded-lg bg-gray-700 ${textColor} border border-gray-600 focus:border-pink-500 focus:outline-none transition`}
                placeholder="••••••"
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-pink-500 to-blue-500 hover:shadow-lg hover:shadow-pink-500/50 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {/* Login Link */}
        <p className={`text-center mt-6 ${textColor} opacity-70`}>
          Already have an account?{' '}
          <a href="/login" className="text-pink-500 font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;

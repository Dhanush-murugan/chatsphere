import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true); // Default dark mode
  const [theme, setTheme] = useState('dark');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('chatsphere-theme');
    if (savedTheme) {
      setTheme(savedTheme);
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    setTheme(newTheme);
    localStorage.setItem('chatsphere-theme', newTheme);
    
    // Update DOM
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const value = {
    isDark,
    theme,
    toggleTheme,
    bgColor: isDark ? 'bg-gray-900' : 'bg-white',
    textColor: isDark ? 'text-white' : 'text-gray-900',
    cardBg: isDark ? 'bg-gray-800' : 'bg-gray-50',
    borderColor: isDark ? 'border-gray-700' : 'border-gray-200',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

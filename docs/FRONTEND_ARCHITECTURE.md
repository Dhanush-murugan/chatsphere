# Frontend Architecture

## Project Structure

```
frontend/src/
├── components/          # Reusable UI components
│   ├── ChatWindow.js   # Main chat interface
│   ├── Sidebar.js      # Chat list sidebar
│   ├── MessageItem.js  # Single message
│   └── ...
├── pages/              # Full page components
│   ├── Login.js
│   ├── Register.js
│   ├── Chat.js
│   └── Profile.js
├── context/            # React Context (state management)
│   ├── AuthContext.js  # Authentication state
│   └── ThemeContext.js # Theme state
├── services/           # API & Firebase services
│   ├── api.js         # REST API calls
│   └── firebaseService.js  # Firestore real-time
├── hooks/              # Custom React hooks
│   ├── useChat.js
│   └── ...
├── utils/              # Utility functions
│   ├── validators.js
│   ├── formatters.js
│   └── ...
├── styles/             # Global styles
│   └── index.css
├── config/             # Configuration
│   └── firebase.js
└── App.js
```

## State Management

Using **React Context** + **Zustand** for state:

```javascript
// AuthContext - Authentication
{
  user,           // Firebase user
  userData,       // User profile from DB
  loading,        // Loading state
  error,          // Error messages
  isAuthenticated,
  register(),
  login(),
  logout(),
  resetPassword()
}

// ThemeContext - Theme management
{
  isDark,
  theme,
  toggleTheme(),
  bgColor,
  textColor,
  cardBg,
  borderColor
}
```

## Real-Time Features

### Firestore Listeners

```javascript
// Messages listener
messageService.onMessagesChange(chatId, (messages) => {
  // Handle message updates
});

// Typing indicator
chatService.onTypingChange(chatId, (isTyping) => {
  // Update typing status
});

// User online status
userService.onUserStatusChange(userId, (status) => {
  // Update online indicator
});
```

## Component Hierarchy

```
App
├── AuthProvider
│   └── ThemeProvider
│       └── Router
│           ├── Login
│           ├── Register
│           └── ProtectedRoute
│               ├── Chat
│               │   ├── Sidebar
│               │   │   ├── ProfileSection
│               │   │   ├── SearchBar
│               │   │   ├── StoryBar
│               │   │   └── ChatList
│               │   └── ChatWindow
│               │       ├── ChatHeader
│               │       ├── MessageArea
│               │       └── InputBox
│               └── Profile
```

## Data Flow

```
User Action
    ↓
Component (Form/Button)
    ↓
Context/Service (API/Firebase)
    ↓
Backend/Firestore
    ↓
Database Update
    ↓
Real-time Listener
    ↓
Context Update
    ↓
Component Re-render
```

## Performance Optimization

1. **Code Splitting** - Route-based splitting
2. **Image Optimization** - Lazy loading
3. **Memoization** - useCallback, useMemo
4. **Virtual Scrolling** - For long chat lists

## Error Handling

```javascript
try {
  const result = await someAsyncAction();
  if (!result.success) {
    setError(result.error);
  }
} catch (error) {
  setError(error.message);
}
```

---

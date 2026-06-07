# Frontend README

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create .env.local from example
cp .env.example .env.local

# Add your Firebase config
nano .env.local

# Start development server
npm start
```

App will open at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ChatWindow.js   # Main chat interface
│   ├── Sidebar.js      # Chat list sidebar
│   ├── MessageItem.js  # Single message component
│   └── UserSearch.js   # User search modal
├── pages/              # Full page components
│   ├── Login.js        # Login page
│   ├── Register.js     # Registration page
│   ├── Chat.js         # Main chat page
│   └── Profile.js      # User profile page
├── context/            # React Context providers
│   ├── AuthContext.js  # Authentication & user state
│   └── ThemeContext.js # Theme (dark/light) state
├── services/           # API & external services
│   ├── api.js         # REST API client
│   └── firebaseService.js  # Firestore real-time services
├── hooks/              # Custom React hooks
│   └── useChat.js     # Chat management hook
├── utils/              # Utility functions
│   ├── validators.js   # Input validation
│   └── formatters.js   # Data formatting
├── styles/             # Global styles
│   └── index.css      # Tailwind CSS + custom styles
├── config/             # Configuration files
│   └── firebase.js    # Firebase initialization
└── App.js             # Main app component with routing
```

## 🎯 Key Features

### Authentication
- Email/password registration
- Login with Firebase
- Password reset
- Secure session handling

### Real-Time Messaging
- Send text messages instantly
- Message timestamps
- Seen status (Sent → Delivered → Seen)
- Typing indicator
- Message deletion (soft delete)
- Message reactions (❤️🔥😂)

### Media Sharing
- Send images
- Send voice messages
- Upload to Firebase Storage
- Media preview in chat

### User Features
- User profiles with avatar
- Bio and display name
- Username system
- Blue verified badge
- Profile editing

### Customization
- Dark/Light mode toggle
- Chat themes
- Custom emoji picker
- Responsive design (mobile, tablet, desktop)

## 🔧 Technology Stack

- **React 18** - UI framework
- **React Router** - Navigation
- **Firebase Auth** - User authentication
- **Firebase Firestore** - Real-time database
- **Firebase Storage** - File storage
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Zustand** - State management (optional)

## 📚 Usage Examples

### Login
```javascript
import { useAuth } from './context/AuthContext';

const LoginComponent = () => {
  const { login, loading, error } = useAuth();

  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    if (result.success) {
      // Navigate to chat
    }
  };
};
```

### Send Message
```javascript
import { messageService } from './services/firebaseService';

const sendMessage = async (chatId, userId, text) => {
  await messageService.sendMessage(chatId, userId, text);
};
```

### Listen to Messages
```javascript
import { messageService } from './services/firebaseService';

useEffect(() => {
  const unsubscribe = messageService.onMessagesChange(chatId, (messages) => {
    setMessages(messages);
  });
  return unsubscribe;
}, [chatId]);
```

### Toggle Theme
```javascript
import { useTheme } from './context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Toggle</button>;
};
```

## 🌍 Environment Variables

Create `.env.local`:

```bash
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=sender_id
REACT_APP_FIREBASE_APP_ID=app_id
REACT_APP_API_URL=http://localhost:5000/api
```

## 🏗️ Building for Production

```bash
# Create production build
npm run build

# Preview build locally
npm run preview

# Deploy to Vercel
npm i -g vercel
vercel --prod
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## 🐛 Debugging

### Browser DevTools
- React DevTools extension
- Redux/Context DevTools

### Console Logging
```javascript
console.log('Debug:', data);
```

### Firebase Console
- Authentication logs
- Firestore queries
- Storage uploads

## 📱 Responsive Design

- **Mobile** (< 640px) - Single column layout
- **Tablet** (640px - 1024px) - 2 column layout
- **Desktop** (> 1024px) - Full layout

## ⚡ Performance Tips

1. **Code Splitting** - Routes are automatically split
2. **Lazy Loading** - Images load on demand
3. **Memoization** - Use React.memo for expensive components
4. **Firestore Optimization** - Use indexes for queries

## 🔐 Security

- Never commit `.env.local`
- Don't expose API keys in code
- Use Firebase security rules
- Validate all user input
- Use HTTPS in production

## 📖 Documentation

- [Setup Guide](../SETUP_GUIDE.md)
- [API Documentation](../docs/API_DOCUMENTATION.md)
- [Feature Guides](../docs/FEATURE_GUIDES.md)
- [Frontend Architecture](../docs/FRONTEND_ARCHITECTURE.md)

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📄 License

MIT License - feel free to use for personal/educational projects

## 🆘 Troubleshooting

### Issue: "Firebase is not initialized"
- Check `.env.local` has Firebase config
- Verify `REACT_APP_` prefix on all variables
- Restart dev server

### Issue: "Messages not updating"
- Check Firestore rules allow reads
- Verify chatId is correct
- Check browser console for errors

### Issue: "Images not uploading"
- Check Firebase Storage bucket exists
- Verify file size is < 5MB
- Check Firebase Storage rules

## 📞 Support

For issues:
1. Check documentation
2. Review GitHub issues
3. Create new issue with details

Happy coding! 🚀

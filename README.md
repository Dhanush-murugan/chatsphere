# ChatSphere - Instagram Style Real-Time Chat Web App

A modern, fully-featured Instagram-style 1-to-1 real-time chat web application built with React, Firebase, Node.js/Express, and WebRTC.

## 🎯 Features

### Core Messaging
- ✅ 1-to-1 private chat with real-time updates
- ✅ Message timestamps and seen status (Sent → Delivered → Seen)
- ✅ Typing indicator
- ✅ Image sending with Firebase Storage
- ✅ Voice message recording and playback
- ✅ Emoji support and message reactions (❤️🔥😂)
- ✅ Message deletion (soft delete)
- ✅ Disappearing messages (24h auto-delete)

### Communication
- ✅ WebRTC video calling
- ✅ Story feature (24h expiry)
- ✅ Blue tick verified badge system

### Customization
- ✅ Chat themes
- ✅ Dark/Light mode toggle
- ✅ Anytime profile editing

## 🏗️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Firebase Authentication** - User auth
- **Firebase Firestore** - Real-time messages
- **Firebase Storage** - Images & voice files
- **WebRTC** - Video calling
- **Tailwind CSS** - Styling
- **React Router** - Navigation

### Backend
- **Node.js + Express** - API server
- **Firebase Admin SDK** - Server-side Firebase
- **PostgreSQL/MySQL** - User profiles & data
- **JWT** - Token authentication

### Database
- **Firebase Firestore** - Real-time messaging
- **Firebase Storage** - Media files
- **SQL Database** - User profiles, settings

## 📁 Project Structure

```
chatsphere/
├── frontend/              # React frontend app
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API & Firebase services
│   │   ├── context/      # React Context (Auth, Theme)
│   │   ├── hooks/        # Custom hooks
│   │   ├── styles/       # Global styles
│   │   ├── utils/        # Utility functions
│   │   └── App.js        # Main app component
│   ├── package.json
│   └── .env.local        # Firebase config (gitignored)
│
├── backend/               # Node.js/Express API
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Auth & error handling
│   │   ├── models/       # Database models
│   │   ├── config/       # Configuration
│   │   └── server.js     # Entry point
│   ├── package.json
│   └── .env              # Database & secrets (gitignored)
│
└── docs/                  # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- Firebase project
- PostgreSQL/MySQL database

### 1. Setup Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage
4. Copy your Firebase config

### 2. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Add your Firebase config to .env.local
# REACT_APP_FIREBASE_API_KEY=xxx
# REACT_APP_FIREBASE_AUTH_DOMAIN=xxx
# ... (see .env.example)

# Start development server
npm start
```

### 3. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your credentials
# DATABASE_URL=postgresql://user:password@localhost:5432/chatsphere
# FIREBASE_SERVICE_ACCOUNT_KEY=xxx
# JWT_SECRET=xxx

# Run migrations
npm run migrate

# Start server
npm run dev
```

## 📋 Database Schema

### SQL Database - Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    profile_picture TEXT,
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    theme VARCHAR(20) DEFAULT 'dark',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Firestore Collections

- **users/{uid}** - Online status, last seen
- **chats/{chat_id}** - Chat metadata
- **messages/{chat_id}/{message_id}** - Chat messages
- **stories/{user_id}/{story_id}** - User stories

## 🔐 Security Rules

### Firestore Security Rules

```javascript
// Only participants can read/write messages
match /messages/{chatId}/{messageId} {
  allow read: if request.auth.uid in resource.data.participants;
  allow create: if request.auth.uid == request.resource.data.sender_id;
  allow update: if request.auth.uid == resource.data.sender_id;
  allow delete: if request.auth.uid == resource.data.sender_id;
}
```

### Backend Authentication
- JWT tokens for API protection
- Firebase Admin SDK verification
- CORS enabled for frontend

## 🎨 UI Design

- Instagram-inspired layout
- Modern premium design with glassmorphism
- Rounded message bubbles
- Gradient buttons and smooth animations
- Dark mode default with light mode toggle
- Fully responsive (mobile, tablet, desktop)

## 📱 Pages

1. **Landing Page** - Welcome & introduction
2. **Login Page** - Email/password authentication
3. **Register Page** - User signup with validation
4. **Main Chat Page** - Sidebar + chat window
5. **Profile Page** - User profile editing
6. **Settings Page** - Theme, privacy, account settings

## 🎯 Development Roadmap

- [ ] Setup Firebase project
- [ ] Create authentication system
- [ ] Build chat UI components
- [ ] Implement real-time messaging
- [ ] Add image upload
- [ ] Add voice messaging
- [ ] Implement typing indicator
- [ ] Add message reactions
- [ ] Build video calling
- [ ] Add story feature
- [ ] User search system
- [ ] Profile management
- [ ] Deploy to production

## 🤝 Contributing

This is a learning project. Feel free to extend and customize features!

## 📄 License

MIT License - feel free to use for personal/educational projects

## 📞 Support

For questions or issues, refer to the docs folder or Firebase documentation.

---

**Built with ❤️ using React, Firebase, and Node.js**

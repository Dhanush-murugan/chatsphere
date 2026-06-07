# ChatSphere - Setup & Installation Guide

## Prerequisites

Before you start, make sure you have:

- **Node.js 16+** - Download from [nodejs.org](https://nodejs.org/)
- **npm or yarn** - Comes with Node.js
- **PostgreSQL 12+** - Download from [postgresql.org](https://www.postgresql.org/download/)
- **Firebase Account** - Create one at [firebase.google.com](https://firebase.google.com)
- **Git** - For version control

## Step 1: Firebase Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name (e.g., "ChatSphere")
4. Enable Google Analytics (optional)
5. Create project

### 1.2 Enable Firebase Services

**Authentication:**
- Go to Authentication > Sign-in method
- Enable "Email/Password"
- Enable "Google" (optional)

**Firestore Database:**
- Go to Firestore Database
- Click "Create database"
- Start in production mode
- Choose your region

**Storage:**
- Go to Storage
- Click "Get started"
- Accept default rules
- Choose your region

### 1.3 Get Firebase Credentials

**For Frontend:**
1. Go to Project Settings
2. Scroll to "Your apps"
3. Click Web app icon
4. Copy the config object
5. Save to `frontend/.env.local`

**For Backend:**
1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Save JSON file contents to `backend/.env` as `FIREBASE_SERVICE_ACCOUNT_KEY`

## Step 2: Database Setup

### 2.1 PostgreSQL Installation

**On Windows:**
```bash
# Using PostgreSQL installer
1. Download from https://www.postgresql.org/download/windows/
2. Run installer
3. Set password for postgres user
4. Default port: 5432
```

**On macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**On Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2.2 Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE chatsphere;

# Connect to database
\c chatsphere

# Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

# Exit
\q
```

## Step 3: Frontend Setup

### 3.1 Install Dependencies

```bash
cd frontend
npm install
```

### 3.2 Configure Environment

```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local with your Firebase credentials
nano .env.local
```

Example `.frontend/.env.local`:
```
REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123def456
REACT_APP_API_URL=http://localhost:5000/api
```

### 3.3 Start Development Server

```bash
npm start
```

App will open at `http://localhost:3000`

## Step 4: Backend Setup

### 4.1 Install Dependencies

```bash
cd backend
npm install
```

### 4.2 Configure Environment

```bash
# Copy example file
cp .env.example .env

# Edit .env with your credentials
nano .env
```

Example `backend/.env`:
```
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/chatsphere
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=chatsphere

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@your-project.iam.gserviceaccount.com

# JWT
JWT_SECRET=your_super_secret_key_change_in_production

# Server
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 4.3 Initialize Database

```bash
npm run migrate
```

### 4.4 Start Backend Server

```bash
npm run dev
```

Server will start at `http://localhost:5000`

## Step 5: Firestore Security Rules

Update your Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth.uid == userId || request.auth != null;
      allow write: if request.auth.uid == userId;
      
      match /stats/{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }

    // Messages collection - only participants can read/write
    match /messages/{chatId}/messages/{messageId} {
      allow read: if request.auth.uid in resource.data.participants;
      allow create: if request.auth.uid == request.resource.data.senderId;
      allow update, delete: if request.auth.uid == resource.data.senderId;
    }

    // Chats collection
    match /chats/{chatId} {
      allow read, write: if request.auth.uid in resource.data.participants;
    }

    // Stories collection - accessible for reading
    match /stories/{userId}/stories/{storyId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
      allow delete: if request.auth.uid == userId;
    }
  }
}
```

## Testing the Application

### 1. Register a New Account

1. Navigate to `http://localhost:3000/register`
2. Enter details:
   - Full Name: John Doe
   - Username: johndoe
   - Email: john@example.com
   - Password: test123456

### 2. Create Another Account

Repeat in a different browser window or private mode

### 3. Test Messaging

1. Login with first account
2. Search for second user
3. Start chatting in real-time

## Deployment

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Set environment variables in Vercel dashboard
```

### Backend (Heroku/Railway)

```bash
# Install CLI
npm i -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

## Troubleshooting

### Issue: "Firebase config not valid"
- Check `.env.local` has correct Firebase credentials
- Ensure `REACT_APP_` prefix on frontend env vars

### Issue: "Database connection refused"
- Ensure PostgreSQL is running: `sudo systemctl status postgresql`
- Check DATABASE_URL format
- Verify database exists

### Issue: "Invalid Firebase token"
- Check Firebase Admin SDK setup in backend
- Verify FIREBASE_SERVICE_ACCOUNT_KEY is valid JSON

### Issue: CORS errors
- Ensure backend runs on `http://localhost:5000`
- Check CORS_ORIGIN matches frontend URL

## Next Steps

1. **Add WebRTC for Video Calling** - Integrate Peerjs or simple-peer
2. **Add Push Notifications** - Use Firebase Cloud Messaging
3. **Add Voice Messages** - Implement MediaRecorder API
4. **Deploy to Production** - Use Vercel & Railway
5. **Add Advanced Features** - Message search, file sharing, etc.

## Support & Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [WebRTC MDN Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)

## Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Enable HTTPS in production
- [ ] Set secure CORS origins
- [ ] Enable Firebase authentication rules
- [ ] Use environment variables for secrets
- [ ] Enable PostgreSQL SSL connections
- [ ] Set up rate limiting
- [ ] Enable database backups
- [ ] Review Firestore security rules

---

**Happy coding! 🚀**

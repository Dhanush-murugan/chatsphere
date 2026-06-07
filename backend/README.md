# Backend README

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create .env from example
cp .env.example .env

# Edit .env with your credentials
nano .env

# Run migrations
npm run migrate

# Start development server
npm run dev
```

Server will start at `http://localhost:5000`

## 📁 Project Structure

```
src/
├── server.js           # Express app setup & entry point
├── routes/             # API endpoints
│   ├── users.js       # User endpoints
│   ├── chats.js       # Chat endpoints
│   ├── messages.js    # Message endpoints
│   ├── stories.js     # Story endpoints
│   └── media.js       # Media/upload endpoints
├── middleware/         # Express middleware
│   └── auth.js        # Authentication & error handling
├── config/             # Configuration
│   └── database.js    # Database initialization
└── scripts/            # Utility scripts
    └── migrate.js     # Database migration script
```

## 🔧 Technology Stack

- **Node.js 16+** - Runtime
- **Express.js** - Web framework
- **Firebase Admin SDK** - Server-side Firebase
- **PostgreSQL** - SQL database
- **JWT** - Token authentication
- **CORS** - Cross-origin requests
- **Helmet** - Security headers
- **express-validator** - Input validation

## 📚 API Endpoints

### Users
```
GET    /api/users/:uid                 # Get user by UID
GET    /api/users/search/:username     # Search users
POST   /api/users                      # Create user
PUT    /api/users/:uid                 # Update profile
GET    /api/users/check-username/:name # Check availability
```

### Chats
```
GET    /api/chats              # Get user's chats
POST   /api/chats              # Create/get chat
GET    /api/chats/:chatId      # Get chat by ID
DELETE /api/chats/:chatId      # Delete chat
```

### Messages (Firestore)
```
GET    /api/messages/:chatId                    # Get messages
DELETE /api/messages/:chatId/:messageId         # Delete message
POST   /api/messages/:chatId/:messageId/react   # Add reaction
```

### Stories
```
POST   /api/stories              # Create story
GET    /api/stories/:userId      # Get user stories
DELETE /api/stories/:storyId     # Delete story
POST   /api/stories/:storyId/view # View story
```

### Media
```
GET    /api/media/upload-token    # Get Firebase upload URL
POST   /api/media/download-url    # Get download URL
```

See [API Documentation](../docs/API_DOCUMENTATION.md) for details.

## 🌍 Environment Variables

Create `.env`:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/chatsphere
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=chatsphere

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@your-project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## 🏃 Running the Server

### Development

```bash
# With auto-reload (nodemon)
npm run dev

# Watch mode
npm run dev:watch
```

### Production

```bash
npm start
```

## 📊 Database

### Initialize Database

```bash
npm run migrate
```

This will:
1. Create `users` table
2. Create `chats` table
3. Create necessary indexes

### Database Schema

**Users Table:**
```sql
- id (UUID, PRIMARY KEY)
- firebase_uid (VARCHAR, UNIQUE)
- username (VARCHAR, UNIQUE)
- email (VARCHAR)
- display_name (VARCHAR)
- profile_picture (TEXT)
- bio (TEXT)
- is_verified (BOOLEAN)
- theme (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Chats Table:**
```sql
- id (UUID, PRIMARY KEY)
- user_1_id (UUID, FOREIGN KEY)
- user_2_id (UUID, FOREIGN KEY)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- UNIQUE(user_1_id, user_2_id)
```

### Firestore Collections

- **users/{uid}** - User status
- **chats/{chatId}** - Chat metadata
- **messages/{chatId}/messages/{msgId}** - Chat messages
- **stories/{userId}/stories/{storyId}** - User stories

## 🔐 Authentication

### Firebase Token Verification

```javascript
const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decodedToken = await admin.auth().verifyIdToken(token);
  req.user = decodedToken;
  next();
};
```

### Protected Routes

Add to routes:
```javascript
router.get('/protected', verifyFirebaseToken, (req, res) => {
  // req.user contains decoded token
});
```

## 🛡️ Security Features

- **CORS** - Restrict cross-origin requests
- **Helmet** - Security HTTP headers
- **Input Validation** - express-validator
- **Firebase Auth** - Secure authentication
- **JWT** - Stateless authentication
- **HTTPS** - Use in production

## 📝 Logging

```javascript
console.log('Info message');
console.error('Error message');
console.warn('Warning message');
console.debug('Debug message');
```

Logs in production:
```bash
npm run logs  # View logs
```

## 🧪 Testing Endpoints

### Using cURL

```bash
# Get user
curl -X GET http://localhost:5000/api/users/firebase-uid \
  -H "Authorization: Bearer {token}"

# Create chat
curl -X POST http://localhost:5000/api/chats \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"participantIds": ["uid1", "uid2"]}'
```

### Using Postman

1. Import endpoints
2. Set up environment variables
3. Add token to authorization header
4. Test each endpoint

## ⚡ Performance Optimization

1. **Database Indexes** - On frequently queried columns
2. **Connection Pooling** - Reuse DB connections
3. **Caching** - Cache user data
4. **Compression** - Gzip responses

## 🚀 Deployment

### Heroku

```bash
# Create app
heroku create your-app-name

# Add database
heroku addons:create heroku-postgresql:standard-0

# Deploy
git push heroku main

# Run migrations
heroku run npm run migrate
```

See [Deployment Guide](../docs/DEPLOYMENT_GUIDE.md) for details.

## 📚 Useful Commands

```bash
# Start development
npm run dev

# Build/prepare for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Database migration
npm run migrate

# Check health
curl http://localhost:5000/health
```

## 🐛 Debugging

### Enable Debug Logging

```javascript
// In middleware
console.log('Request:', req.method, req.path);
console.log('User:', req.user?.uid);
```

### Check Database Connection

```javascript
pool.query('SELECT NOW()')
  .then(res => console.log('Connected:', res.rows))
  .catch(err => console.error('Connection failed:', err));
```

### Firebase Admin SDK

```javascript
admin.firestore().collection('users').get()
  .then(snapshot => console.log('Firestore connected'))
  .catch(err => console.error('Error:', err));
```

## 📖 Documentation

- [Setup Guide](../SETUP_GUIDE.md)
- [API Documentation](../docs/API_DOCUMENTATION.md)
- [Feature Guides](../docs/FEATURE_GUIDES.md)
- [Deployment Guide](../docs/DEPLOYMENT_GUIDE.md)

## 🤝 Contributing

1. Follow code style
2. Add tests for new features
3. Document API changes
4. Submit pull request

## 📄 License

MIT License - feel free to use for personal/educational projects

## 🆘 Troubleshooting

### Issue: "Database connection refused"
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Or on macOS
brew services list
```

### Issue: "Invalid Firebase token"
- Check FIREBASE_SERVICE_ACCOUNT_KEY is valid JSON
- Verify Firebase Admin SDK initialization

### Issue: "CORS errors"
- Set CORS_ORIGIN to frontend URL
- Check browser console for detailed error

## 📞 Support

For issues or questions:
1. Check documentation
2. Review error logs
3. Create GitHub issue with details

Happy coding! 🚀

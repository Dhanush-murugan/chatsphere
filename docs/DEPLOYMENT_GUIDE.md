# Deployment Guide

## Deploying to Production

### 1. Frontend Deployment (Vercel)

#### Step 1: Prepare for Production

```bash
# In frontend/.env.production
REACT_APP_FIREBASE_API_KEY=your_prod_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-prod-domain.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_prod_project_id
REACT_APP_API_URL=https://your-api.herokuapp.com/api
```

#### Step 2: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set production domain
# - Add environment variables
```

#### Step 3: Configure Vercel Settings

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Settings → Environment Variables
4. Add all environment variables
5. Redeploy

### 2. Backend Deployment (Heroku)

#### Step 1: Create Heroku Account

1. Sign up at [heroku.com](https://www.heroku.com)
2. Install Heroku CLI:
   ```bash
   # Windows
   npm install -g heroku

   # macOS
   brew tap heroku/brew && brew install heroku
   ```

#### Step 2: Deploy Application

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:standard-0

# Set environment variables
heroku config:set JWT_SECRET=your_super_secret_key
heroku config:set NODE_ENV=production
heroku config:set FIREBASE_PROJECT_ID=your_id
heroku config:set FIREBASE_PRIVATE_KEY="-----BEGIN..."
# ... set all other variables

# Deploy from Git
git push heroku main

# View logs
heroku logs --tail
```

#### Step 3: Verify Deployment

```bash
# Open app
heroku open

# Check health
curl https://your-app.herokuapp.com/health
```

### 3. Database Migration

#### Backup Existing Data

```bash
# Local PostgreSQL backup
pg_dump chatsphere > backup.sql

# Restore on Heroku
heroku pg:psql < backup.sql
```

#### Create New Database

```bash
# Heroku runs migrations automatically
# But you can manually run:
heroku run npm run migrate
```

### 4. Firebase Production Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth.uid == userId || request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    match /messages/{chatId}/messages/{messageId} {
      allow read: if request.auth.uid in resource.data.participants;
      allow create: if request.auth.uid == request.resource.data.senderId;
      allow update, delete: if request.auth.uid == resource.data.senderId;
    }

    match /chats/{chatId} {
      allow read, write: if request.auth.uid in resource.data.participants;
    }

    match /stories/{userId}/stories/{storyId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

### 5. Firebase Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{userId}/{allPaths=**} {
      allow read: if request.auth.uid != null;
      allow write: if request.auth.uid == userId;
    }

    match /voices/{userId}/{allPaths=**} {
      allow read: if request.auth.uid != null;
      allow write: if request.auth.uid == userId;
    }

    match /uploads/{userId}/{allPaths=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

### 6. Enable HTTPS

Both Vercel and Heroku provide HTTPS automatically.

Update your API calls:
```javascript
// Use HTTPS in production
REACT_APP_API_URL=https://your-api.herokuapp.com/api
```

### 7. Set Up Custom Domain

#### Vercel Domain

1. Go to Project Settings
2. Domains
3. Add custom domain
4. Follow DNS instructions

#### Heroku Domain

```bash
heroku domains:add www.yourdomain.com
heroku domains:add yourdomain.com
```

### 8. Environment-Specific Configuration

```javascript
// frontend/src/config/api.js
const API_URL = 
  process.env.NODE_ENV === 'production'
    ? 'https://api.chatsphere.com/api'
    : 'http://localhost:5000/api';
```

### 9. Monitoring & Logging

#### Heroku Logs

```bash
# Real-time logs
heroku logs --tail

# Error logs
heroku logs --tail --type error

# Specific dyno
heroku logs --tail --dyno web.1
```

#### Vercel Analytics

1. Dashboard → Analytics
2. View performance metrics
3. Set up error tracking

### 10. Backup Strategy

```bash
# Weekly database backup
# Create a cron job:

# Linux crontab
0 2 * * 0 pg_dump chatsphere | gzip > ~/backups/db-$(date +\%Y\%m\%d).sql.gz

# Backup to cloud
aws s3 cp ~/backups/db-$(date +%Y%m%d).sql.gz s3://my-bucket/backups/
```

### 11. Production Checklist

- [ ] Change all secret keys (JWT_SECRET, etc.)
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up database backups
- [ ] Enable Firebase authentication rules
- [ ] Set up monitoring and error tracking
- [ ] Configure email notifications
- [ ] Test all features in production
- [ ] Set up analytics
- [ ] Enable API rate limiting
- [ ] Configure CDN for static assets

### 12. Security Best Practices

```bash
# Use environment variables for all secrets
# Never commit .env files
# Use strong JWT secrets
# Enable database encryption
# Use HTTPS everywhere
# Implement API rate limiting
# Validate all user inputs
# Use CORS properly
```

### 13. Performance Optimization

```javascript
// Frontend
- Enable code splitting
- Minimize bundle size
- Implement lazy loading
- Use image optimization

// Backend
- Enable caching headers
- Use database indexes
- Implement connection pooling
- Use compression middleware

app.use(compression());
```

### 14. Rollback Strategy

```bash
# Heroku rollback
heroku releases
heroku rollback v123

# Vercel rollback
# Go to Deployments → Select previous version → Promote
```

---

## Quick Deployment Summary

```bash
# Frontend
cd frontend
npm run build
vercel --prod

# Backend
cd backend
git push heroku main

# Database
heroku pg:psql < schema.sql
heroku run npm run migrate
```

For detailed help:
- [Vercel Docs](https://vercel.com/docs)
- [Heroku Docs](https://devcenter.heroku.com/)
- [Firebase Docs](https://firebase.google.com/docs)

---

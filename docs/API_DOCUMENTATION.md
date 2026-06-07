# ChatSphere API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except `/users/search/:username`) require Firebase ID Token in Authorization header:
```
Authorization: Bearer {firebase_id_token}
```

## Endpoints

### Users

#### Get User by UID
```
GET /users/:uid
```

**Response:**
```json
{
  "id": "uuid",
  "firebase_uid": "string",
  "username": "string",
  "email": "string",
  "display_name": "string",
  "profile_picture": "url",
  "bio": "string",
  "is_verified": boolean,
  "theme": "dark|light",
  "created_at": "timestamp"
}
```

#### Search Users by Username
```
GET /users/search/:username
```

**Parameters:**
- `username` (string) - Username to search for

**Response:**
```json
[
  {
    "id": "uuid",
    "username": "string",
    "display_name": "string",
    "profile_picture": "url",
    "is_verified": boolean
  }
]
```

#### Create User
```
POST /users
Content-Type: application/json
Authorization: Bearer {token}
```

**Body:**
```json
{
  "username": "string",
  "displayName": "string"
}
```

#### Update User Profile
```
PUT /users/:uid
Content-Type: application/json
Authorization: Bearer {token}
```

**Body:**
```json
{
  "displayName": "string (optional)",
  "bio": "string (optional)",
  "theme": "dark|light (optional)",
  "profilePictureUrl": "url (optional)"
}
```

#### Check Username Availability
```
GET /users/check-username/:username
```

**Response:**
```json
{
  "available": boolean
}
```

### Chats

#### Get User's Chats
```
GET /chats
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": "uuid",
    "user_1_id": "uuid",
    "user_2_id": "uuid",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
]
```

#### Create/Get Chat
```
POST /chats
Content-Type: application/json
Authorization: Bearer {token}
```

**Body:**
```json
{
  "participantIds": ["firebase_uid_1", "firebase_uid_2"]
}
```

#### Get Chat by ID
```
GET /chats/:chatId
Authorization: Bearer {token}
```

#### Delete Chat
```
DELETE /chats/:chatId
Authorization: Bearer {token}
```

### Messages (Firestore)

#### Get Messages
```
GET /messages/:chatId?limit=50&offset=0
Authorization: Bearer {token}
```

#### Delete Message
```
DELETE /messages/:chatId/:messageId
Authorization: Bearer {token}
```

#### React to Message
```
POST /messages/:chatId/:messageId/react
Content-Type: application/json
Authorization: Bearer {token}
```

**Body:**
```json
{
  "emoji": "❤️"
}
```

### Stories

#### Create Story
```
POST /stories
Content-Type: application/json
Authorization: Bearer {token}
```

**Body:**
```json
{
  "mediaUrl": "url"
}
```

#### Get User's Stories
```
GET /stories/:userId
```

#### Delete Story
```
DELETE /stories/:storyId
Authorization: Bearer {token}
```

#### View Story
```
POST /stories/:storyId/view
Authorization: Bearer {token}
```

### Media

#### Get Upload Token
```
GET /media/upload-token
Authorization: Bearer {token}
```

**Response:**
```json
{
  "uploadUrl": "signed_url",
  "filename": "string"
}
```

#### Get Download URL
```
POST /media/download-url
Content-Type: application/json
Authorization: Bearer {token}
```

**Body:**
```json
{
  "filename": "string"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error",
  "errors": [
    {
      "param": "username",
      "msg": "Username must be 3-20 characters"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error"
}
```

## Rate Limiting

Currently no rate limiting. Consider implementing in production:
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);
```

## Real-Time Features (Firestore)

### Message Listener
```javascript
import { messageService } from '../services/firebaseService';

const unsubscribe = messageService.onMessagesChange(chatId, (messages) => {
  console.log('New messages:', messages);
});

// Cleanup
unsubscribe();
```

### Typing Indicator
```javascript
import { chatService } from '../services/firebaseService';

// Set typing
await chatService.setTypingStatus(chatId, true);

// Listen
const unsubscribe = chatService.onTypingChange(chatId, (isTyping) => {
  console.log('User is typing:', isTyping);
});
```

## Examples

### JavaScript/Fetch
```javascript
// Get user
const response = await fetch(
  'http://localhost:5000/api/users/firebase-uid',
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);
const user = await response.json();
```

### axios
```javascript
import api from './api';

// Get user
const { data } = await api.get(`/users/${uid}`);
```

### cURL
```bash
curl -X GET http://localhost:5000/api/users/firebase-uid \
  -H "Authorization: Bearer {token}"
```

## Pagination

Use `limit` and `offset` parameters for pagination:
```
GET /messages/:chatId?limit=20&offset=40
```

## Filtering & Search

Use query parameters:
```
GET /users/search/john?limit=10
```

---

Last Updated: June 2026

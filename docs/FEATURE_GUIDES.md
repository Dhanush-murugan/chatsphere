# Feature Implementation Guides

## 🎤 Voice Messages

### Frontend Implementation

```javascript
// services/voiceService.js
export const voiceService = {
  async recordMessage() {
    const mediaRecorder = new MediaRecorder(
      await navigator.mediaDevices.getUserMedia({ audio: true })
    );
    
    const audioChunks = [];
    mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
    
    return {
      start: () => mediaRecorder.start(),
      stop: () => {
        mediaRecorder.stop();
        return new Blob(audioChunks, { type: 'audio/mp3' });
      }
    };
  },

  async uploadVoice(blob) {
    const formData = new FormData();
    formData.append('audio', blob);
    return fetch(`${API_URL}/media/upload`, {
      method: 'POST',
      body: formData
    });
  }
};
```

### Backend Implementation

```javascript
// routes/media.js
router.post('/upload', verifyFirebaseToken, upload.single('audio'), (req, res) => {
  const bucket = admin.storage().bucket();
  const file = bucket.file(`voices/${req.user.uid}/${Date.now()}.mp3`);
  
  file.save(req.file.buffer, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ voiceUrl: file.publicUrl() });
  });
});
```

---

## 📸 Image Sharing

### Upload Handler

```javascript
// Handle image upload
const handleImageUpload = async (file) => {
  try {
    // Validate
    if (!validateImageSize(file) || !validateImageType(file)) {
      setError('Invalid image');
      return;
    }

    // Upload to Firebase Storage
    const storageRef = ref(storage, `images/${user.uid}/${Date.now()}`);
    const snapshot = await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(snapshot.ref);

    // Send message with image
    await messageService.sendMessage(chatId, user.uid, '', imageUrl, 'image');
  } catch (error) {
    setError(error.message);
  }
};
```

---

## 🎥 WebRTC Video Calling

### Using Simple-Peer

```javascript
// services/webrtcService.js
import SimplePeer from 'simple-peer';
import { db } from '../config/firebase';

export const webrtcService = {
  async initiateCall(recipientId) {
    const peer = new SimplePeer({ initiator: true, trickle: false });
    
    // Get ICE servers
    const iceServers = [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ];

    peer.on('signal', async (signal) => {
      // Send signal to recipient via Firestore
      await setDoc(
        doc(db, 'calls', recipientId),
        { offer: signal, from: user.uid }
      );
    });

    return peer;
  }
};
```

---

## 💬 Typing Indicator

```javascript
// Auto-hide typing after 2 seconds
const handleTyping = (text) => {
  setInputText(text);
  
  if (text.length > 0) {
    chatService.setTypingStatus(chatId, true);
    
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      chatService.setTypingStatus(chatId, false);
    }, 2000);
  }
};
```

---

## ✅ Seen Status

### Update Messages When Chat Opens

```javascript
useEffect(() => {
  const unsubscribe = messageService.onMessagesChange(chatId, (newMessages) => {
    setMessages(newMessages);

    // Mark unread as seen
    const unseenIds = newMessages
      .filter(m => m.senderId === recipientId && !m.seen)
      .map(m => m.id);

    if (unseenIds.length > 0) {
      messageService.markMessagesAsSeen(chatId, unseenIds, user.uid);
    }
  });

  return unsubscribe;
}, [chatId]);
```

---

## 😊 Message Reactions

```javascript
// Add emoji picker
import EmojiPicker from 'emoji-picker-react';

const handleReaction = async (messageId, emoji) => {
  await messageService.addReaction(chatId, messageId, user.uid, emoji.emoji);
};

// Display reactions
{message.reactions && Object.entries(message.reactions).length > 0 && (
  <div className="flex gap-1 mt-2 flex-wrap">
    {Object.entries(message.reactions).map(([userId, emoji]) => (
      <span key={userId} className="text-lg">{emoji}</span>
    ))}
  </div>
)}
```

---

## 📖 Story Feature (24h Auto-Delete)

### Create Story

```javascript
const handleCreateStory = async (mediaUrl) => {
  try {
    await storyService.createStory(user.uid, mediaUrl);
  } catch (error) {
    console.error('Error creating story:', error);
  }
};
```

### Auto-Delete Function

```javascript
// Backend cron job
const deleteExpiredStories = async () => {
  const db = admin.firestore();
  const snapshot = await db.collectionGroup('stories')
    .where('expiresAt', '<', new Date())
    .get();

  const batch = db.batch();
  snapshot.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
};

// Run every hour
setInterval(deleteExpiredStories, 3600000);
```

---

## 🔍 User Search

```javascript
// Search by @username
const handleSearch = async (query) => {
  try {
    const { data } = await userService.searchUsers(query);
    setSearchResults(data);
  } catch (error) {
    console.error('Search error:', error);
  }
};
```

---

## 🔐 Blue Tick Verification

Add to User Profile:

```javascript
{userData?.isVerified && (
  <div className="flex items-center gap-1">
    <span>Verified</span>
    <FiCheckCircle className="text-blue-500" />
  </div>
)}
```

---

## 🌙 Dark/Light Mode

```javascript
// Toggle theme
const { isDark, toggleTheme } = useTheme();

// Apply to document
useEffect(() => {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [isDark]);
```

---

## 📱 Push Notifications (Firebase)

```javascript
// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js');
}

// Request permission
const messaging = getMessaging();
getToken(messaging, { 
  vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY 
});
```

---

## 📊 Message Analytics

```javascript
// Track message stats
const getMessageStats = async (chatId) => {
  const snapshot = await getDocs(
    collection(db, `messages/${chatId}/messages`)
  );

  const stats = {
    total: snapshot.size,
    hasImages: snapshot.docs.filter(d => d.data().imageUrl).length,
    hasVoice: snapshot.docs.filter(d => d.data().voiceUrl).length,
  };

  return stats;
};
```

---

## 🚀 Batch Operations

```javascript
// Delete all messages in a chat
const deleteChatMessages = async (chatId) => {
  const batch = db.batch();
  const snapshot = await getDocs(
    collection(db, `messages/${chatId}/messages`)
  );

  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  await batch.commit();
};
```

---

More features coming soon! 🚀

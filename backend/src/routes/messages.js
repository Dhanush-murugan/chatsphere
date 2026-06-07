import express from 'express';
import { verifyFirebaseToken, catchAsync } from '../middleware/auth.js';
import { param, body, validationResult } from 'express-validator';
import admin from 'firebase-admin';

const router = express.Router();
const db = admin.firestore();

// Get messages for a chat
router.get('/:chatId',
  verifyFirebaseToken,
  param('chatId').notEmpty(),
  catchAsync(async (req, res) => {
    const { chatId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    try {
      const messagesRef = db.collection('messages').doc(chatId).collection('messages');
      const snapshot = await messagesRef
        .orderBy('timestamp', 'desc')
        .limit(parseInt(limit))
        .offset(parseInt(offset))
        .get();

      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
      }));

      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
);

// Delete message
router.delete('/:chatId/:messageId',
  verifyFirebaseToken,
  param('chatId').notEmpty(),
  param('messageId').notEmpty(),
  catchAsync(async (req, res) => {
    const { chatId, messageId } = req.params;
    const { uid } = req.user;

    try {
      const messageRef = db.collection('messages').doc(chatId).collection('messages').doc(messageId);
      const messageDoc = await messageRef.get();

      if (!messageDoc.exists) {
        return res.status(404).json({ error: 'Message not found' });
      }

      // Verify ownership
      if (messageDoc.data().senderId !== uid) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      // Soft delete
      await messageRef.update({
        deleted: true,
        deletedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.json({ message: 'Message deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
);

// React to message
router.post('/:chatId/:messageId/react',
  verifyFirebaseToken,
  param('chatId').notEmpty(),
  param('messageId').notEmpty(),
  body('emoji').notEmpty(),
  catchAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { chatId, messageId } = req.params;
    const { emoji } = req.body;
    const { uid } = req.user;

    try {
      const messageRef = db.collection('messages').doc(chatId).collection('messages').doc(messageId);
      
      await messageRef.update({
        [`reactions.${uid}`]: emoji,
      });

      res.json({ message: 'Reaction added' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
);

export default router;

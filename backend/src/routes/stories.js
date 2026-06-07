import express from 'express';
import { verifyFirebaseToken, catchAsync } from '../middleware/auth.js';
import { body, param, validationResult } from 'express-validator';
import admin from 'firebase-admin';

const router = express.Router();
const db = admin.firestore();

// Create story
router.post('/',
  verifyFirebaseToken,
  body('mediaUrl').notEmpty().isURL(),
  catchAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { uid } = req.user;
    const { mediaUrl } = req.body;

    try {
      const storyRef = db.collection('stories').doc(uid).collection('stories');
      const newStory = await storyRef.add({
        mediaUrl,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        views: [],
      });

      res.status(201).json({
        id: newStory.id,
        mediaUrl,
        timestamp: new Date(),
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
);

// Get user stories
router.get('/:userId',
  param('userId').notEmpty(),
  catchAsync(async (req, res) => {
    const { userId } = req.params;

    try {
      const storiesRef = db.collection('stories').doc(userId).collection('stories');
      const snapshot = await storiesRef
        .where('expiresAt', '>', new Date())
        .orderBy('expiresAt', 'asc')
        .get();

      const stories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
        expiresAt: doc.data().expiresAt.toDate(),
      }));

      res.json(stories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
);

// Delete story
router.delete('/:storyId',
  verifyFirebaseToken,
  param('storyId').notEmpty(),
  catchAsync(async (req, res) => {
    const { storyId } = req.params;
    const { uid } = req.user;

    try {
      const storyRef = db.collection('stories').doc(uid).collection('stories').doc(storyId);
      await storyRef.delete();

      res.json({ message: 'Story deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
);

// View story
router.post('/:storyId/view',
  verifyFirebaseToken,
  param('storyId').notEmpty(),
  catchAsync(async (req, res) => {
    const { storyId } = req.params;
    const { uid } = req.user;

    try {
      // In production, you would need the owner's uid
      // For now, we'll need to find the story owner
      const storiesRef = db.collectionGroup('stories').where(admin.firestore.FieldPath.documentId(), '==', storyId);
      const snapshot = await storiesRef.get();

      if (snapshot.empty) {
        return res.status(404).json({ error: 'Story not found' });
      }

      const storyDoc = snapshot.docs[0];
      const storyRef = storyDoc.ref;

      await storyRef.update({
        [`viewedBy.${uid}`]: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.json({ message: 'Story viewed' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
);

export default router;

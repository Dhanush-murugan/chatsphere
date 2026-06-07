import express from 'express';
import { verifyFirebaseToken, catchAsync } from '../middleware/auth.js';
import admin from 'firebase-admin';

const router = express.Router();

// Get Firebase Storage signed upload URL
router.get('/upload-token',
  verifyFirebaseToken,
  catchAsync(async (req, res) => {
    try {
      const bucket = admin.storage().bucket();
      const filename = `uploads/${req.user.uid}/${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const file = bucket.file(filename);
      const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      });

      res.json({ uploadUrl: url, filename });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
);

// Get download URL
router.post('/download-url',
  verifyFirebaseToken,
  catchAsync(async (req, res) => {
    const { filename } = req.body;

    try {
      const bucket = admin.storage().bucket();
      const file = bucket.file(filename);

      const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.json({ downloadUrl: url });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
);

export default router;

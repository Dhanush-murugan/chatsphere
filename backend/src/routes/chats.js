import express from 'express';
import { pool } from '../server.js';
import { verifyFirebaseToken, catchAsync } from '../middleware/auth.js';
import { body, param, validationResult } from 'express-validator';

const router = express.Router();

// Get user chats
router.get('/',
  verifyFirebaseToken,
  catchAsync(async (req, res) => {
    const { uid } = req.user;

    // Get user ID from Firebase UID
    const userResult = await pool.query(
      'SELECT id FROM users WHERE firebase_uid = $1',
      [uid]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userResult.rows[0].id;

    // Get all chats for this user
    const chatsResult = await pool.query(
      `SELECT * FROM chats 
       WHERE user_1_id = $1 OR user_2_id = $1
       ORDER BY updated_at DESC`,
      [userId]
    );

    res.json(chatsResult.rows);
  })
);

// Create or get chat
router.post('/',
  verifyFirebaseToken,
  body('participantIds').isArray().notEmpty(),
  catchAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { uid } = req.user;
    const { participantIds } = req.body;

    if (participantIds.length !== 2) {
      return res.status(400).json({ error: 'Exactly 2 participants required' });
    }

    // Get user IDs
    const usersResult = await pool.query(
      'SELECT id, firebase_uid FROM users WHERE firebase_uid = ANY($1)',
      [participantIds]
    );

    if (usersResult.rows.length !== 2) {
      return res.status(400).json({ error: 'One or both users not found' });
    }

    const [user1, user2] = usersResult.rows;

    // Check existing chat
    const existingChat = await pool.query(
      `SELECT * FROM chats 
       WHERE (user_1_id = $1 AND user_2_id = $2) 
          OR (user_1_id = $2 AND user_2_id = $1)`,
      [user1.id, user2.id]
    );

    if (existingChat.rows.length > 0) {
      return res.json(existingChat.rows[0]);
    }

    // Create new chat
    const newChat = await pool.query(
      `INSERT INTO chats (user_1_id, user_2_id)
       VALUES ($1, $2)
       RETURNING *`,
      [user1.id, user2.id]
    );

    res.status(201).json(newChat.rows[0]);
  })
);

// Get chat by ID
router.get('/:chatId',
  verifyFirebaseToken,
  param('chatId').notEmpty(),
  catchAsync(async (req, res) => {
    const { chatId } = req.params;

    const result = await pool.query(
      'SELECT * FROM chats WHERE id = $1',
      [chatId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.json(result.rows[0]);
  })
);

// Delete chat
router.delete('/:chatId',
  verifyFirebaseToken,
  param('chatId').notEmpty(),
  catchAsync(async (req, res) => {
    const { chatId } = req.params;
    const { uid } = req.user;

    // Get user ID
    const userResult = await pool.query(
      'SELECT id FROM users WHERE firebase_uid = $1',
      [uid]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userResult.rows[0].id;

    // Verify ownership
    const chatResult = await pool.query(
      'SELECT * FROM chats WHERE id = $1 AND (user_1_id = $2 OR user_2_id = $2)',
      [chatId, userId]
    );

    if (chatResult.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Delete chat
    await pool.query('DELETE FROM chats WHERE id = $1', [chatId]);

    res.json({ message: 'Chat deleted successfully' });
  })
);

export default router;

import express from 'express';
import { pool } from '../server.js';
import { verifyFirebaseToken, catchAsync } from '../middleware/auth.js';
import { param, body, validationResult } from 'express-validator';

const router = express.Router();

// Get user by UID
router.get('/:uid', 
  param('uid').notEmpty(),
  catchAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { uid } = req.params;
    const result = await pool.query(
      'SELECT id, firebase_uid, username, email, display_name, profile_picture, bio, is_verified, theme, created_at FROM users WHERE firebase_uid = $1',
      [uid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  })
);

// Search users by username
router.get('/search/:username',
  param('username').notEmpty().isLength({ min: 1 }),
  catchAsync(async (req, res) => {
    const { username } = req.params;
    const result = await pool.query(
      'SELECT id, firebase_uid, username, display_name, profile_picture, is_verified FROM users WHERE username ILIKE $1 LIMIT 10',
      [`${username}%`]
    );

    res.json(result.rows);
  })
);

// Create new user
router.post('/',
  verifyFirebaseToken,
  body('username').notEmpty().isLength({ min: 3, max: 20 }).matches(/^[a-zA-Z0-9_]+$/),
  body('displayName').notEmpty().isLength({ min: 2 }),
  catchAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, displayName } = req.body;
    const { uid, email } = req.user;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE firebase_uid = $1',
      [uid]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Check if username is taken
    const usernameCheck = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username.toLowerCase()]
    );

    if (usernameCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Create user
    const result = await pool.query(
      `INSERT INTO users (firebase_uid, username, email, display_name, theme)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, firebase_uid, username, email, display_name, theme`,
      [uid, username.toLowerCase(), email, displayName, 'dark']
    );

    res.status(201).json(result.rows[0]);
  })
);

// Update user profile
router.put('/:uid',
  verifyFirebaseToken,
  body('displayName').optional().isLength({ min: 2 }),
  body('bio').optional().isLength({ max: 150 }),
  body('theme').optional().isIn(['dark', 'light']),
  catchAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { uid } = req.params;
    
    // Verify ownership
    if (req.user.uid !== uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { displayName, bio, theme, profilePictureUrl } = req.body;

    let query = 'UPDATE users SET';
    const values = [];
    let paramCount = 1;

    if (displayName) {
      query += ` display_name = $${paramCount++},`;
      values.push(displayName);
    }
    if (bio) {
      query += ` bio = $${paramCount++},`;
      values.push(bio);
    }
    if (theme) {
      query += ` theme = $${paramCount++},`;
      values.push(theme);
    }
    if (profilePictureUrl) {
      query += ` profile_picture = $${paramCount++},`;
      values.push(profilePictureUrl);
    }

    query += ` updated_at = CURRENT_TIMESTAMP WHERE firebase_uid = $${paramCount}`;
    values.push(uid);

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch updated user
    const updatedUser = await pool.query(
      'SELECT id, firebase_uid, username, email, display_name, profile_picture, bio, is_verified, theme FROM users WHERE firebase_uid = $1',
      [uid]
    );

    res.json(updatedUser.rows[0]);
  })
);

// Check username availability
router.get('/check-username/:username',
  param('username').notEmpty().isLength({ min: 3, max: 20 }),
  catchAsync(async (req, res) => {
    const { username } = req.params;
    const result = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username.toLowerCase()]
    );

    res.json({ available: result.rows.length === 0 });
  })
);

export default router;

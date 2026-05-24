const express = require('express');
const router = express.Router();
const { login, seed, me } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/login
router.post('/login', login);

// ⚠️  SEED ROUTE DISABLED — run manually in DB or via mongo shell if needed.
// This route is commented out to prevent unauthorized admin creation in production.
// router.post('/seed', seed);

// GET /api/auth/me  — verify token + return admin info
router.get('/me', protect, me);

module.exports = router;

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// ── POST /api/auth/login ──────────────────────────────────
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const admin = await Admin.findOne({ username: username.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      admin: { id: admin._id, username: admin.username, name: admin.name },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/auth/seed  (run once to create first admin) ─
const seed = async (req, res) => {
  try {
    const exists = await Admin.findOne({ username: 'admin' });
    if (exists) {
      return res.status(409).json({ error: 'Admin already exists.' });
    }
    const admin = await Admin.create({ username: 'admin', password: 'admin123', name: 'Admin' });
    res.status(201).json({ message: 'Admin created', username: admin.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/auth/me ─────────────────────────────────────
const me = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) return res.status(404).json({ error: 'Admin not found.' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { login, seed, me };

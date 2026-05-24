const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

// GET  /api/categories          — public
router.get('/', getCategories);

// POST /api/categories          — admin only
router.post('/', protect, createCategory);

// PUT  /api/categories/:id      — admin only
router.put('/:id', protect, updateCategory);

// DELETE /api/categories/:id    — admin only
router.delete('/:id', protect, deleteCategory);

module.exports = router;

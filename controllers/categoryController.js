const Category = require('../models/Category');

// ── GET /api/categories ───────────────────────────────────
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ label: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/categories (admin only) ────────────────────
const createCategory = async (req, res) => {
  try {
    const { id, label, icon, description } = req.body;
    if (!id || !label) {
      return res.status(400).json({ error: 'id and label are required.' });
    }
    const category = await Category.create({ id, label, icon, description });
    res.status(201).json(category);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Category ID already exists.' });
    res.status(500).json({ error: err.message });
  }
};

// ── PUT /api/categories/:id (admin only) ─────────────────
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ error: 'Category not found.' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── DELETE /api/categories/:id (admin only) ───────────────
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ id: req.params.id });
    if (!category) return res.status(404).json({ error: 'Category not found.' });
    res.json({ message: 'Category deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };

const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

// ── Helper: upload buffer to Cloudinary via stream ────────
const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'ambika_tools_products' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });

// ── GET /api/products ─────────────────────────────────────
const getProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.categoryId) filter.categoryId = req.query.categoryId;
    if (req.query.featured === 'true') filter.featured = true;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/products/:id ─────────────────────────────────
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/products  (admin only) ─────────────────────
const createProduct = async (req, res) => {
  try {
    if (req.body.specs && typeof req.body.specs === 'string') {
      try { req.body.specs = JSON.parse(req.body.specs); }
      catch (e) { req.body.specs = {}; }
    }

    const { name, tagline, description, categoryId, image, specs, featured, price } = req.body;

    if (!name || !categoryId) {
      return res.status(400).json({ error: 'Name and categoryId are required.' });
    }

    // If file uploaded, stream buffer to Cloudinary directly
    let imageUrl = image || '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const product = await Product.create({
      name, tagline, description, categoryId,
      image: imageUrl,
      specs: specs || {},
      featured: featured || false,
      price: price || '',
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── PUT /api/products/:id  (admin only) ──────────────────
const updateProduct = async (req, res) => {
  try {
    if (req.body.specs && typeof req.body.specs === 'string') {
      try { req.body.specs = JSON.parse(req.body.specs); }
      catch (e) { req.body.specs = {}; }
    }

    const updates = { ...req.body };

    // If new file uploaded, stream to Cloudinary
    if (req.file) {
      updates.image = await uploadToCloudinary(req.file.buffer);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── DELETE /api/products/:id  (admin only) ───────────────
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };

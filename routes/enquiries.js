const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createEnquiry,
  getEnquiries,
  getEnquiry,
  updateEnquiry,
  deleteEnquiry,
} = require('../controllers/enquiryController');

// POST /api/enquiries           — public (submit form)
router.post('/', createEnquiry);

// GET  /api/enquiries           — admin only (list all)
router.get('/', protect, getEnquiries);

// GET  /api/enquiries/:id       — admin only (single)
router.get('/:id', protect, getEnquiry);

// PUT  /api/enquiries/:id       — admin only (update status)
router.put('/:id', protect, updateEnquiry);

// DELETE /api/enquiries/:id     — admin only
router.delete('/:id', protect, deleteEnquiry);

module.exports = router;

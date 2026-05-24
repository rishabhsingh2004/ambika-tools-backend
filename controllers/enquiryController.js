const Enquiry = require('../models/Enquiry');
const nodemailer = require('nodemailer');

// ── Nodemailer transporter ────────────────────────────────
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,  // Gmail App Password
    },
  });
};

const sendEmail = async (enquiry) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('⚠️  Email not configured. Skipping email notification.');
    return;
  }

  // Send to ADMIN_EMAIL if set, else fall back to EMAIL_USER
  const toEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  const productLine = enquiry.productName
    ? `<tr><td style="padding:6px 0;color:#666;font-size:14px;"><strong>Product:</strong></td><td style="padding:6px 0;font-size:14px;">${enquiry.productName}</td></tr>`
    : '';
  const sourceLabel = enquiry.source === 'product-page' ? 'Product Page' : 'Contact Form';

  await transporter.sendMail({
    from: `"Ambika Tools Website" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    replyTo: enquiry.email || undefined,
    subject: `🔔 New Enquiry — ${enquiry.name} (${enquiry.category || 'General'})`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;border-radius:10px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1e3a8a,#2563eb);padding:28px 32px;">
          <h1 style="margin:0;color:#fff;font-size:22px;">New Customer Enquiry</h1>
          <p style="margin:6px 0 0;color:#bfdbfe;font-size:13px;">Via ${sourceLabel} — ${new Date().toLocaleString('en-IN')}</p>
        </div>
        <div style="padding:28px 32px;background:#fff;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 0;color:#666;font-size:14px;width:120px;"><strong>Name:</strong></td><td style="padding:6px 0;font-size:14px;font-weight:600;">${enquiry.name}</td></tr>
            <tr><td style="padding:6px 0;color:#666;font-size:14px;"><strong>Phone:</strong></td><td style="padding:6px 0;font-size:14px;"><a href="tel:${enquiry.phone}" style="color:#2563eb;">${enquiry.phone}</a></td></tr>
            <tr><td style="padding:6px 0;color:#666;font-size:14px;"><strong>Email:</strong></td><td style="padding:6px 0;font-size:14px;">${enquiry.email ? `<a href="mailto:${enquiry.email}" style="color:#2563eb;">${enquiry.email}</a>` : '—'}</td></tr>
            <tr><td style="padding:6px 0;color:#666;font-size:14px;"><strong>Category:</strong></td><td style="padding:6px 0;font-size:14px;">${enquiry.category || '—'}</td></tr>
            ${productLine}
          </table>
          <div style="margin-top:18px;padding:14px 18px;background:#f0f7ff;border-left:4px solid #2563eb;border-radius:4px;">
            <p style="margin:0;font-size:14px;color:#333;line-height:1.6;">${enquiry.message}</p>
          </div>
          <div style="margin-top:20px;display:flex;gap:12px;">
            <a href="tel:${enquiry.phone}" style="display:inline-block;background:#22c55e;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:13px;font-weight:600;">📞 Call Now</a>
            ${enquiry.email ? `<a href="mailto:${enquiry.email}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:13px;font-weight:600;">✉️ Reply by Email</a>` : ''}
          </div>
        </div>
        <div style="padding:16px 32px;background:#f9f9f9;font-size:12px;color:#999;text-align:center;">
          Ambika Tools Admin System — Do not reply to this email directly.
        </div>
      </div>
    `,
  });
};

// ── POST /api/enquiries  (public) ─────────────────────────
const createEnquiry = async (req, res) => {
  try {
    const { name, phone, email, category, message, productId, productName, source } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ error: 'Name, phone, and message are required.' });
    }

    const enquiry = await Enquiry.create({
      name, phone, email, category, message,
      productId: productId || null,
      productName: productName || '',
      source: source || 'contact-form',
    });

    // Send email notification (non-blocking)
    sendEmail(enquiry).catch(err => console.error('Email error:', err.message));

    res.status(201).json({ message: 'Enquiry submitted successfully.', id: enquiry._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/enquiries  (admin only) ─────────────────────
const getEnquiries = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.source) filter.source = req.query.source;

    const enquiries = await Enquiry.find(filter)
      .populate('productId', 'name')
      .sort({ createdAt: -1 });

    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/enquiries/:id  (admin only) ─────────────────
const getEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id).populate('productId', 'name');
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found.' });
    res.json(enquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── PUT /api/enquiries/:id  (admin only) — update status ─
const updateEnquiry = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['new', 'read', 'replied', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found.' });
    res.json(enquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── DELETE /api/enquiries/:id  (admin only) ───────────────
const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found.' });
    res.json({ message: 'Enquiry deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createEnquiry, getEnquiries, getEnquiry, updateEnquiry, deleteEnquiry };

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const admin = await Admin.findOne({ admin_id: req.body.admin_id });
    if (!admin || !(await bcrypt.compare(req.body.password, admin.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Admin Registration
router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const admin = new Admin({ ...req.body, password: hashedPassword });
    await admin.save();
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Error registering admin' });
  }
});

module.exports = router;

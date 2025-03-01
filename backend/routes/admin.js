const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { admin_id, password } = req.body;
    const admin = await Admin.findOne({ admin_id: "admin" });

    // const admin = await Admin.findOne({ admin_id });
    console.log(req.body.password, admin.password)
    if (!admin || req.body.password !== admin.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
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

router.get('/borrowed-books', async (req, res) => {
  try {
    const borrowedBooks = await BorrowedBook.find({ return_date: null })
      .populate('book_id')
      .populate('student_id');
    const data = borrowedBooks.map((book) => ({
      book_id: book.book_id._id,
      title: book.book_id.title,
      author: book.book_id.author,
      student_name: book.student_id.name,
      student_id: book.student_id.student_id,
      due_date: book.due_date,
      fine: Math.max(
        0,
        Math.floor((new Date() - new Date(book.due_date)) / (1000 * 60 * 60 * 24)) * 10
      ),
    }));
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching borrowed books' });
  }
});


module.exports = router;

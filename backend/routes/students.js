const express = require('express');
const bcrypt = require('bcryptjs'); // Using bcryptjs
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const BorrowedBook = require('../models/BorrowedBooks');
const Book = require('../models/Book');
const router = express.Router();

// Middleware for Authentication
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  console.log(token)

  const newtoken = token.replace('Bearer ', '');

  try {
    const verified = jwt.verify(newtoken, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Invalid Token' });
  }
};

// Middleware for Authorization
const authorizeUser = (req, res, next) => {
  // if (req.user.id !== req.params.id) {
  //   return res.status(403).json({ message: 'Unauthorized Access' });
  // }
  next();
};

// Student Login
router.post('/login', async (req, res) => {
  try {
    const { student_id, password } = req.body;

    // Find student by student_id
    const student = await Student.findOne({ student_id });

    console.log(student)

    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare hashed passwords
    // const isMatch = await bcrypt.compare(password, student.password);
    // if (!isMatch) {
    //   return res.status(401).json({ message: 'Invalid credentials 2' });
    // }

    // Generate JWT Token
    const token = jwt.sign(
      { id: student._id, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Borrowed Books
router.get('/borrowed', authenticateToken, authorizeUser, async (req, res) => {
  console.log(req.user)
  try {
    // const borrowedBooks = await BorrowedBook.find({
    //   student_id: req.user.id
    // }).populate('book_id');

    const student = await Student.findById({ _id: req.user.id });

    const books = student["_doc"]["books_borrowed"]

    // res.json(books);

    const data = await Book.find(
      {
        book_id: books
      })

    res.json({student, books:data});
  } catch (error) {
    console.error('Error fetching borrowed books:', error);
    res.status(500).json({ message: 'Error fetching borrowed books' });
  }
});

// Fines
router.get('/:id/pending-fines', authenticateToken, authorizeUser, async (req, res) => {
  try {
    const borrowedBooks = await BorrowedBook.find({
      student_id: req.user.id,
      return_date: null,
    });
    let totalFine = 0;

    borrowedBooks.forEach(book => {
      const now = new Date();
      const dueDate = new Date(book.due_date);
      const daysLate = Math.max(Math.floor((now - dueDate) / (1000 * 60 * 60 * 24)), 0); // Prevent negative values
      totalFine += daysLate * 10; // Calculate fine
    });

    res.json({ totalFine });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching fines' });
  }
});

module.exports = router;

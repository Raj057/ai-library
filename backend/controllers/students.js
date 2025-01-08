// Final Version of students.js

const express = require('express');
const router = express.Router();
const { checkBorrowedBooks, checkPendingFines } = require('../helpers');
const { generateBookSummary } = require('../helpers');

// Route to check borrowed books for a student
router.get('/:id/borrowed-books', async (req, res) => {
  const { id } = req.params;
  try {
    const borrowedBooks = await checkBorrowedBooks(id);
    res.json(borrowedBooks);
  } catch (error) {
    console.error('Error fetching borrowed books:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to check pending fines for a student
router.get('/:id/pending-fines', async (req, res) => {
  const { id } = req.params;
  try {
    const fines = await checkPendingFines(id);
    res.json(fines);
  } catch (error) {
    console.error('Error fetching pending fines:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to generate a book summary by title
router.get('/:id/summary/:title', async (req, res) => {
  const { title } = req.params;
  try {
    const summary = await generateBookSummary(title);
    res.json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to fetch student profile details
router.get('/:id/profile', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

// routes/students.js
const express = require('express');
const router = express.Router();
const { checkBorrowedBooks, checkPendingFines } = require('../lib/tools');  // Import helper functions from tools.js

// Route to check borrowed books for a student
router.get('/:id/borrowed-books', async (req, res) => {
  const { id } = req.params;

  try {
    const borrowedBooks = await checkBorrowedBooks(id);  // Call the function from tools.js
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
    const fines = await checkPendingFines(id);  // Call the function from tools.js
    res.json(fines);
  } catch (error) {
    console.error('Error fetching pending fines:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

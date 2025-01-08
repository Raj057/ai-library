// routes/llm.js
const express = require('express');
const { callTools } = require('../lib/tools');  // Import the callTools function
const { checkBorrowedBooks, searchBookByTitle, searchBookByAuthor, searchBookByGenre, checkPendingFines } = require('../lib/helpers');  // Import from helpers.js

const router = express.Router();

// Handle incoming queries from the frontend
router.post('/query', async (req, res) => {
  const { query, userType, studentId } = req.body;
  console.log(query, userType, studentId);
  try {
    const authData = { id: studentId };
    const result = await callTools(query, authData);
    res.json(result);
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
});

module.exports = router;

// Updated routes/books.js to use function-based routing

const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBook,
  addBook,
  updateBook,
  deleteBook,
  getBorrowedBooks
} = require('../controllers/books');

// Define routes using the imported functions
router.get('/', getBooks);
router.get('/borrowed', getBorrowedBooks);
router.get('/:id', getBook);
router.post('/', addBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

module.exports = router;

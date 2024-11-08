const express = require('express');
const router = express.Router();
const { searchBookByTitle, searchBookByAuthor, searchBookByGenre, getAvailableBooks, getAllBooks } = require('../lib/helpers');  // Use helpers
const Book = require('../models/Book');  // Book model
const BorrowedBook = require('../models/BorrowedBooks');  // BorrowedBooks model

// Route to search books by title
router.get('/search/title/:name', async (req, res) => {
  const { name } = req.params;

  try {
    const books = await searchBookByTitle(name);  // Search books by title using the helper
    res.json(books);
  } catch (error) {
    console.error('Error searching books by title:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to search books by author
router.get('/search/author/:author', async (req, res) => {
  const { author } = req.params;

  try {
    const books = await searchBookByAuthor(author);  // Search books by author using the helper
    res.json(books);
  } catch (error) {
    console.error('Error searching books by author:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to search books by genre
router.get('/search/genre/:genre', async (req, res) => {
  const { genre } = req.params;

  try {
    const books = await searchBookByGenre(genre);  // Search books by genre using the helper
    res.json(books);
  } catch (error) {
    console.error('Error searching books by genre:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST: Add a new book
router.post('/', async (req, res) => {
  const { book_id, title, author, section, column, genre, total_copies, available_copies } = req.body;

  try {
    const newBook = new Book({ book_id, title, author, section, column, genre, total_copies, available_copies });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error adding book:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Borrow a book
router.post('/borrow', async (req, res) => {
  const { student_id, book_id } = req.body;

  try {
    const book = await Book.findOne({ book_id });
    if (!book || book.available_copies <= 0) {
      return res.status(400).json({ message: 'Book not available for borrowing.' });
    }

    // Check if the student has already borrowed this book and hasn't returned it
    const alreadyBorrowed = await BorrowedBook.findOne({ student_id, book_id, return_date: null });
    if (alreadyBorrowed) {
      return res.status(400).json({ message: 'You have already borrowed this book and not yet returned it.' });
    }

    // Update available copies
    book.available_copies -= 1;
    await book.save();

    // Add to borrowed_books collection
    const borrowedBook = new BorrowedBook({
      student_id,
      book_id: book._id,  // Reference the book's ObjectId
      borrow_date: new Date(),
      due_date: new Date(new Date().setDate(new Date().getDate() + 10))  // 10 days due date
    });
    await borrowedBook.save();

    res.json({ message: 'Book borrowed successfully', borrowedBook });
  } catch (error) {
    console.error('Error borrowing book:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get all books in the library
router.get('/allBooks', async (req, res) => {
  try {
    const allBooks = await getAllBooks();
    res.json(allBooks);
  } catch (error) {
    console.error('Error fetching all books:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get all available books
router.get('/availableBooks', async (req, res) => {
  try {
    const availableBooks = await getAvailableBooks();
    res.json(availableBooks);
  } catch (error) {
    console.error('Error fetching available books:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Return a book
router.post('/return', async (req, res) => {
  const { student_id, book_id } = req.body;

  try {
    const book = await Book.findOne({ book_id });
    const borrowedBook = await BorrowedBook.findOne({ student_id, book_id: book._id, return_date: null });

    if (!borrowedBook) {
      return res.status(404).json({ message: 'No record of borrowed book' });
    }

    // Mark the book as returned
    borrowedBook.return_date = new Date();

    // Calculate fine if overdue
    const now = new Date();
    const daysLate = Math.floor((now - borrowedBook.due_date) / (1000 * 60 * 60 * 24));
    if (daysLate > 0) {
      borrowedBook.fine = daysLate * 10;  // Fine of $10 per day late
    }

    await borrowedBook.save();

    // Increase available copies
    book.available_copies += 1;
    await book.save();

    res.json({ message: 'Book returned successfully', fine: borrowedBook.fine || 0 });
  } catch (error) {
    console.error('Error returning book:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

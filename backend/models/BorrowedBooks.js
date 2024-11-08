const mongoose = require('mongoose');

// Define the schema for borrowed books
const borrowedBookSchema = new mongoose.Schema({
  student_id: { type: String, required: true },                // E.g., "21ad001"
  book_id: { type: String, required: true },                   // E.g., "H001"
  borrow_date: { type: Date, required: true },                 // Date of borrowing
  due_date: { type: Date, required: true },                    // Due date (e.g., 10 days after borrow_date)
  return_date: { type: Date, default: null },                  // Date of return (null if not returned yet)
  fine: { type: Number, default: 0 }                           // Fine for overdue books
});

// Specify the collection name explicitly as "borrowed_books"
const BorrowedBook = mongoose.model('BorrowedBook', borrowedBookSchema, 'borrowed_books');

module.exports = BorrowedBook;

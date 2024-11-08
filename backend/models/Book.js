const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  book_id: { type: String, required: true, unique: true },      // E.g., "H001"
  title: { type: String, required: true },                     // E.g., "The Great Gatsby"
  author: { type: String, required: true },                    // E.g., "F. Scott Fitzgerald"
  genre: { type: String, required: true },                     // E.g., "Fiction"
  section: { type: String, required: true },                   // E.g., "B"
  column: { type: String, required: true },                    // E.g., "B2"
  total_copies: { type: Number, required: true, default: 1 },  // Total copies in the library
  available_copies: { type: Number, required: true, default: 1 }  // Available copies for borrowing
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;

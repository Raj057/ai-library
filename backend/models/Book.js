const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  book_id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  section: { type: String, required: true },
  column: { type: String, required: true },
  total_copies: { type: Number, required: true, default: 1 },
  available_copies: { type: Number, required: true, default: 1 },
});

module.exports = mongoose.model('Book', bookSchema);

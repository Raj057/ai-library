const mongoose = require('mongoose');

const borrowedBookSchema = new mongoose.Schema({
  student_id: { type: String, required: true },
  book_id: { type: String, required: true },
  borrow_date: { type: Date, required: true },
  due_date: { type: Date, required: true },
  return_date: { type: Date, default: null },
  fine: { type: Number, default: 0 },
});

module.exports = mongoose.model('BorrowedBook', borrowedBookSchema);

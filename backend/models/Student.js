const mongoose = require('mongoose');

// Define schema for borrowed books
const borrowedBookSchema = new mongoose.Schema({
  book_id: { type: String, required: true },             // Book ID
  borrow_date: { type: Date, required: true },          // Borrow date
  due_date: { type: Date, required: true },             // Due date
  return_date: { type: Date, default: null },           // Return date (nullable)
  days_left: { type: Number, default: 0 },              // Days left or overdue (-ve value)
  fine: { type: Number, default: 0 }                    // Fine for overdue books
});

// Define schema for student data
const studentSchema = new mongoose.Schema({
  student_id: { type: String, required: true, unique: true }, // Student ID
  name: { type: String, required: true },                     // Name
  email: { type: String, required: true, unique: true },      // Email
  password: { type: String, required: true },                 // Password (hashed)
  borrowed_books: { type: [borrowedBookSchema], default: [] } // Array of borrowed books
});

// Export the model
module.exports = mongoose.model('Student', studentSchema);

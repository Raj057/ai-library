const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  student_id: { type: String, required: true, unique: true },  // E.g., "21ad001"
  name: { type: String, required: true },                      // E.g., "John Doe"
  password: { type: String, required: true },                  // E.g., "21ad001"
  email: { type: String, required: true },                     // E.g., "john.doe@example.com"
  role: { type: String, required: true, enum: ['student', 'admin'] }  // "student" or "admin"
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;

const express = require('express');
const router = express.Router();
const Student = require('../models/Student');  // Import the Student model

// Login Route
router.post('/login', async (req, res) => {
  const { student_id, password } = req.body;

  try {
    const user = await Student.findOne({ student_id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Successful login
    res.json({
      message: 'Login successful',
      role: user.role,        // Send back role (either 'student' or 'admin')
      student_id: user.student_id
    });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

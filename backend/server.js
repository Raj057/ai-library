// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(cors());
app.use(express.json()); // Replaces bodyParser.json()
app.use(express.urlencoded({ extended: true })); // Replaces bodyParser.urlencoded()

// Import routes
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const llmRoutes = require('./routes/llm');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err);
    process.exit(1);  // Exit the server on DB connection failure
  });

// Route setup
app.use('/api/auth', authRoutes);  // Authentication routes
app.use('/api/books', bookRoutes); // Books-related routes
app.use('/api/llm', llmRoutes);    // LLM interaction routes

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the AI-Powered Library Management System API!');
});

// Handle 404 for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

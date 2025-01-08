// Final Version of server.js with function-based routing support

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const bodyParser = require('body-parser');
const { updateFinesDaily } = require('./lib/helpers');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const bookRoutes = require('./routes/books');
const studentRoutes = require('./routes/students');
const adminRoutes = require('./routes/admin');
const llmRoutes = require('./routes/llm');

app.use((req, res, next) => {
  console.log('Request:', req.method, req.url)
  next()
})

app.use('/api/books', bookRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/query', llmRoutes);


// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  
}).then(() => console.log('Connected to MongoDB')).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Daily Cron Job for Fine Updates
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily fine update...');
  await updateFinesDaily();
});

// Root route
app.get('/', (req, res) => {
  res.send('Library Management System API');
});

// Error Handling
app.use((req, res, next) => {
  console.log('Route not found');
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
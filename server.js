const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const shopifyRoutes = require('./routes/shopifyRoutes'); // Shopify routes
const authRoutes = require('./routes/authroutes'); // Auth routes
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser'); // Import cookie-parser

// Load environment variables (move this to the top)
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process with a failure code
  });

const app = express();

// Middleware for logging requests (only in development mode)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Middleware to parse JSON requests and CORS settings
app.use(
  cors({
    origin: 'http://localhost:5173', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Enable sending cookies with requests
  })
);
app.use(express.json());
app.use(cookieParser()); // Add cookie-parser middleware

// Define route prefixes
app.use('/api/v1/shopify', shopifyRoutes); // Shopify routes under '/v1/shopify'
app.use('/api/v1/auth', authRoutes); // Auth routes under '/v1/auth'

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot find ${req.originalUrl} on this server!`,
  });
});

// Global error handler (optional, for improved debugging)
app.use((err, req, res, next) => {
  console.error(err.stack);

  // In production, do not expose error stack
  const errorResponse =
    process.env.NODE_ENV === 'production'
      ? { success: false, message: 'Something went wrong!' }
      : { success: false, message: err.message, stack: err.stack };

  res.status(500).json(errorResponse);
});

// Start the server
const port = process.env.PORT || 5100;
app.listen(port, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || 'production'
    } mode on PORT ${port}...`
  );
});

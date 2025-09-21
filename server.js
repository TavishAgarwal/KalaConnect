// ===== BACKEND STRUCTURE =====

// === server.js ===
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const artisanRoutes = require('./routes/artisans');
const placeRoutes = require('./routes/places');
const uploadRoutes = require('./routes/upload');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
const connectDB = require('./config/database');
connectDB();

// Routes
app.use('/api/artisans', artisanRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'KalaKonnect API is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// === config/database.js ===


// === models/artisan.js ===


// === services/geminiAI.js ===


// === services/cloudStorage.js ===



// === middleware/upload.js ===


// === routes/artisans.js ===

// === routes/places.js ===


// === routes/upload.js ===


// === package.json (Backend) ===


// === .env (Backend) ===

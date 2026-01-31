/**
 * Bloom Filter Simulator - Backend Server
 * 
 * This is the main entry point for the Express.js server.
 * It sets up:
 * - Express application with middleware
 * - CORS for frontend communication
 * - API routes
 * - Database connection
 */

// Load environment variables from .env file (if exists)
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const { initializeDatabase } = require('./config/db');

// Create Express application
const app = express();

// Port configuration (default: 5000)
const PORT = process.env.PORT || 5000;

// ===================
// Middleware Setup
// ===================

// Enable CORS (Cross-Origin Resource Sharing)
// This allows the React frontend to communicate with this backend
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://frontend:3000'],
    methods: ['GET', 'POST'],
    credentials: true
}));

// Parse JSON request bodies
// This allows us to read JSON data sent in POST requests
app.use(express.json());

// Log all incoming requests (helpful for debugging)
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.path}`);
    next();
});

// ===================
// Routes
// ===================

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        message: '🌸 Bloom Filter Simulator API',
        version: '1.0.0',
        endpoints: {
            add: 'POST /api/add',
            check: 'POST /api/check',
            reset: 'POST /api/reset',
            status: 'GET /api/status',
            history: 'GET /api/history'
        }
    });
});

// Mount API routes under /api prefix
app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.path}`
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// ===================
// Start Server
// ===================

async function startServer() {
    // Initialize database (create tables if needed)
    await initializeDatabase();

    // Start listening for requests
    app.listen(PORT, () => {
        console.log('');
        console.log('🌸 ================================');
        console.log('🌸 Bloom Filter Simulator Backend');
        console.log('🌸 ================================');
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📍 http://localhost:${PORT}`);
        console.log('');
        console.log('Available endpoints:');
        console.log('  POST /api/add    - Add a value');
        console.log('  POST /api/check  - Check a value');
        console.log('  POST /api/reset  - Reset filter');
        console.log('  GET  /api/status - Get current state');
        console.log('');
    });
}

// Start the server
startServer().catch(console.error);

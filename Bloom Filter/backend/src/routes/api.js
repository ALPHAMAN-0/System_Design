/**
 * API Routes for Bloom Filter Simulator
 * 
 * This file defines all the REST API endpoints:
 * - POST /api/add    - Add a value to the Bloom Filter
 * - POST /api/check  - Check if a value might exist
 * - POST /api/reset  - Reset the Bloom Filter
 * - GET  /api/status - Get current Bloom Filter state
 * - GET  /api/history - Get operation history from database
 */

const express = require('express');
const router = express.Router();
const BloomFilter = require('../bloomfilter/BloomFilter');
const { logOperation, getRecentOperations } = require('../config/db');

// Create a single Bloom Filter instance for the application
// Size of 64 bits is good for demonstration purposes
const bloomFilter = new BloomFilter(64);

/**
 * POST /api/add
 * 
 * Add a value to the Bloom Filter.
 * 
 * Request Body:
 * {
 *   "value": "apple"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "value": "apple",
 *   "positions": [3, 15, 42, 58],
 *   "bitArray": [0,0,0,1,...],
 *   "message": "Value added successfully"
 * }
 */
router.post('/add', async (req, res) => {
    try {
        const { value } = req.body;

        // Validate input
        if (!value || value.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Please provide a value to add'
            });
        }

        // Add to Bloom Filter
        const result = bloomFilter.add(value.trim());

        // Log to database (async, don't wait)
        logOperation('add', value.trim(), 'Added successfully', result.positions);

        res.json({
            success: true,
            ...result,
            message: `Value "${value.trim()}" added successfully`
        });

    } catch (error) {
        console.error('Error in /add:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add value'
        });
    }
});

/**
 * POST /api/check
 * 
 * Check if a value might exist in the Bloom Filter.
 * 
 * Request Body:
 * {
 *   "value": "apple"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "value": "apple",
 *   "exists": true,
 *   "message": "Maybe Yes (possible false positive)",
 *   "positions": [3, 15, 42, 58],
 *   "bitArray": [0,0,0,1,...]
 * }
 */
router.post('/check', async (req, res) => {
    try {
        const { value } = req.body;

        // Validate input
        if (!value || value.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Please provide a value to check'
            });
        }

        // Check in Bloom Filter
        const result = bloomFilter.check(value.trim());

        // Log to database
        logOperation('check', value.trim(), result.message, result.positions);

        res.json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error('Error in /check:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to check value'
        });
    }
});

/**
 * POST /api/reset
 * 
 * Reset the Bloom Filter to its initial state.
 * All bits are set back to 0.
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Bloom Filter has been reset",
 *   "bitArray": [0,0,0,...],
 *   "itemCount": 0
 * }
 */
router.post('/reset', async (req, res) => {
    try {
        const result = bloomFilter.reset();

        // Log to database
        logOperation('reset', null, 'Filter reset', []);

        res.json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error('Error in /reset:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to reset Bloom Filter'
        });
    }
});

/**
 * GET /api/status
 * 
 * Get the current state of the Bloom Filter.
 * 
 * Response:
 * {
 *   "success": true,
 *   "bitArray": [0,0,1,0,1,...],
 *   "size": 64,
 *   "bitsSet": 12,
 *   "itemCount": 3,
 *   "fillRatio": "18.75%"
 * }
 */
router.get('/status', (req, res) => {
    try {
        const status = bloomFilter.getStatus();

        res.json({
            success: true,
            ...status
        });

    } catch (error) {
        console.error('Error in /status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get status'
        });
    }
});

/**
 * GET /api/history
 * 
 * Get recent operations from the database.
 * 
 * Query Parameters:
 * - limit: Number of records to return (default: 20)
 * 
 * Response:
 * {
 *   "success": true,
 *   "operations": [...]
 * }
 */
router.get('/history', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const operations = await getRecentOperations(limit);

        res.json({
            success: true,
            operations
        });

    } catch (error) {
        console.error('Error in /history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get history'
        });
    }
});

module.exports = router;

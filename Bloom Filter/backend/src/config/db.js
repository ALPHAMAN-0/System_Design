/**
 * Database Configuration
 * 
 * This file sets up the connection to PostgreSQL database.
 * We use a connection pool for efficient database access.
 * 
 * Environment Variables (set in .env or docker-compose):
 * - DB_HOST: Database host (default: localhost)
 * - DB_PORT: Database port (default: 5432)
 * - DB_USER: Database user (default: postgres)
 * - DB_PASSWORD: Database password (default: password)
 * - DB_NAME: Database name (default: bloomfilter)
 */

const { Pool } = require('pg');

// Create a connection pool
// Pool manages multiple connections efficiently
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'bloomfilter',
    // Maximum number of clients in the pool
    max: 10,
    // How long to wait for a connection
    idleTimeoutMillis: 30000,
    // How long to wait for connection
    connectionTimeoutMillis: 2000,
});

/**
 * Initialize the database
 * Creates the operations table if it doesn't exist
 */
async function initializeDatabase() {
    try {
        // Create the operations table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS operations (
                id SERIAL PRIMARY KEY,
                operation_type VARCHAR(20) NOT NULL,
                value VARCHAR(255),
                result VARCHAR(255),
                positions INTEGER[],
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Database initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing database:', error.message);
        // Don't throw - app can work without database logging
    }
}

/**
 * Log an operation to the database
 * 
 * @param {string} operationType - Type of operation (add, check, reset)
 * @param {string} value - Value that was used
 * @param {string} result - Result of the operation
 * @param {number[]} positions - Hash positions used
 */
async function logOperation(operationType, value, result, positions = []) {
    try {
        await pool.query(
            `INSERT INTO operations (operation_type, value, result, positions) 
             VALUES ($1, $2, $3, $4)`,
            [operationType, value, result, positions]
        );
    } catch (error) {
        console.error('Error logging operation:', error.message);
        // Don't throw - logging failure shouldn't break the app
    }
}

/**
 * Get recent operations from the database
 * 
 * @param {number} limit - Maximum number of operations to return
 * @returns {Object[]} - Array of operation records
 */
async function getRecentOperations(limit = 20) {
    try {
        const result = await pool.query(
            `SELECT * FROM operations ORDER BY created_at DESC LIMIT $1`,
            [limit]
        );
        return result.rows;
    } catch (error) {
        console.error('Error fetching operations:', error.message);
        return [];
    }
}

module.exports = {
    pool,
    initializeDatabase,
    logOperation,
    getRecentOperations
};

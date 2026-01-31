/**
 * API Service
 * 
 * This file contains all the functions to communicate with the backend API.
 * It handles HTTP requests and error handling.
 */

// Base URL for API - use environment variable or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Add a value to the Bloom Filter
 * 
 * @param {string} value - The value to add
 * @returns {Promise<Object>} - API response with bit array and positions
 */
export async function addValue(value) {
    const response = await fetch(`${API_BASE_URL}/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add value');
    }

    return response.json();
}

/**
 * Check if a value might exist in the Bloom Filter
 * 
 * @param {string} value - The value to check
 * @returns {Promise<Object>} - API response with exists flag and message
 */
export async function checkValue(value) {
    const response = await fetch(`${API_BASE_URL}/check`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to check value');
    }

    return response.json();
}

/**
 * Reset the Bloom Filter
 * 
 * @returns {Promise<Object>} - API response confirming reset
 */
export async function resetFilter() {
    const response = await fetch(`${API_BASE_URL}/reset`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reset filter');
    }

    return response.json();
}

/**
 * Get current status of the Bloom Filter
 * 
 * @returns {Promise<Object>} - API response with bit array and stats
 */
export async function getStatus() {
    const response = await fetch(`${API_BASE_URL}/status`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get status');
    }

    return response.json();
}

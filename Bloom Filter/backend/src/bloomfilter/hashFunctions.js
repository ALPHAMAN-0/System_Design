/*                                      Hash Functions for Bloom Filter
 * Why multiple hash functions?
 * - More hash functions = fewer false positives (but more bits set per value)
 * - Typically 3-7 hash functions are optimal for most use cases
 */

/**
 * DJB2 Hash Function
 * Created by Daniel J. Bernstein
 * One of the most popular and effective hash functions for strings
 * 
 * @param {string} str - The string to hash
 * @param {number} size - The size of the bit array
 * @returns {number} - Index in the bit array (0 to size-1)
 */
function hash1(str, size) {
    let hash = 5381; // Magic constant - works well in practice
    
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        // hash * 33 + char (bit shift is faster than multiplication)
        hash = ((hash << 5) + hash) + char;
    }
    
    // Ensure positive result and within array bounds
    return Math.abs(hash) % size;
}

//++++++++++++++++++++++SDBM Hash Function++++++++++++++++++++++
// @param {string} str - The string to hash
// @param {number} size - The size of the bit array
// @returns {number} - Index in the bit array (0 to size-1)
 
function hash2(str, size) {
    let hash = 0;
    
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        
        // hash * 65599 = hash * 65536 + hash * 32 + hash
        hash = char + (hash << 6) + (hash << 16) - hash;
    }
    
    return Math.abs(hash) % size;
}

/**
 * Lose Lose Hash Function (modified)
 * Simple hash function - adds all character codes
 * We modify it slightly for better distribution
 * 
 * @param {string} str - The string to hash
 * @param {number} size - The size of the bit array
 * @returns {number} - Index in the bit array (0 to size-1)
 */

function hash3(str, size) {
    let hash = 0;
    
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        // Multiply by position to consider character order
        hash = hash + (char * (i + 1));
    }
    
    return Math.abs(hash) % size;
}

/**
 * FNV-1a Hash Function
 * Fowler-Noll-Vo hash - excellent distribution
 * 
 * @param {string} str - The string to hash
 * @param {number} size - The size of the bit array
 * @returns {number} - Index in the bit array (0 to size-1)
 */

function hash4(str, size) {
    // FNV offset basis for 32-bit
    let hash = 2166136261;
    
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        // XOR then multiply by FNV prime
        hash ^= char;
        hash = (hash * 16777619) >>> 0; // Keep as 32-bit unsigned
    }
    
    return Math.abs(hash) % size;
}

/**
 * Get all hash values for a string
 * Returns an array of indices where bits should be set/checked
 * 
 * @param {string} str - The string to hash
 * @param {number} size - The size of the bit array
 * @returns {number[]} - Array of indices
 */
function getAllHashes(str, size) {
    return [
        hash1(str, size),
        hash2(str, size),
        hash3(str, size),
        hash4(str, size)
    ];
}

module.exports = {
    hash1,
    hash2,
    hash3,
    hash4,
    getAllHashes
};

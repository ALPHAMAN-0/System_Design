/**
 * Bloom Filter Implementation
 * 
 * A Bloom Filter is a space-efficient probabilistic data structure
 * used to test whether an element is a member of a set.
 * 
 * Key Properties:
 * - If check() returns FALSE -> The element is DEFINITELY NOT in the set
 * - If check() returns TRUE  -> The element MIGHT be in the set (possible false positive)
 * 
 * How it works:
 * 1. We have a bit array (all 0s initially)
 * 2. To ADD a value: Run it through multiple hash functions, set those bits to 1
 * 3. To CHECK a value: Run it through the same hash functions, check if ALL bits are 1
 * 
 * False Positives:
 * - Happen when all bit positions for a value are already set by OTHER values
 * - More hash functions and larger bit array = fewer false positives
 * - Cannot have false negatives (if we added it, it will always be found)
 */

const { getAllHashes } = require('./hashFunctions');

class BloomFilter {
    /**
     * Create a new Bloom Filter
     * 
     * @param {number} size - Size of the bit array (default: 64)
     *                        Larger = fewer false positives but more memory
     */
    constructor(size = 64) {
        this.size = size;
        // Initialize bit array with all zeros
        // We use a regular array of 0s and 1s for simplicity
        this.bitArray = new Array(size).fill(0);
        // Keep track of how many values have been added
        this.itemCount = 0;
    }

    /**
     * Add a value to the Bloom Filter
     * 
     * This sets the bits at positions returned by all hash functions to 1.
     * Once a bit is set, it can never be unset (except by reset).
     * 
     * @param {string} value - The value to add
     * @returns {Object} - Information about the add operation
     */
    add(value) {
        // Convert to string to ensure consistent hashing
        const strValue = String(value);

        // Get all hash positions for this value
        const positions = getAllHashes(strValue, this.size);

        // Set each bit position to 1
        positions.forEach(pos => {
            this.bitArray[pos] = 1;
        });

        this.itemCount++;

        return {
            value: strValue,
            positions: positions,
            bitArray: [...this.bitArray], // Return a copy
            itemCount: this.itemCount
        };
    }

    /**
     * Check if a value might exist in the Bloom Filter
     * 
     * If ANY of the hash positions is 0 -> DEFINITELY NOT in the set
     * If ALL of the hash positions are 1 -> MIGHT be in the set
     * 
     * @param {string} value - The value to check
     * @returns {Object} - Result of the check
     */
    check(value) {
        const strValue = String(value);

        // Get all hash positions for this value
        const positions = getAllHashes(strValue, this.size);

        // Check if ALL positions have bit set to 1
        const allBitsSet = positions.every(pos => this.bitArray[pos] === 1);

        return {
            value: strValue,
            positions: positions,
            exists: allBitsSet,
            // If false -> "Definitely No"
            // If true  -> "Maybe Yes (possible false positive)"
            message: allBitsSet
                ? "Maybe Yes (possible false positive)"
                : "Definitely No",
            bitArray: [...this.bitArray]
        };
    }

    /**
     * Reset the Bloom Filter
     * 
     * Clears all bits back to 0 and resets the item count.
     * Use this to start fresh.
     * 
     * @returns {Object} - Confirmation of reset
     */
    reset() {
        this.bitArray = new Array(this.size).fill(0);
        this.itemCount = 0;

        return {
            message: "Bloom Filter has been reset",
            bitArray: [...this.bitArray],
            itemCount: this.itemCount
        };
    }

    /**
     * Get the current state of the Bloom Filter
     * 
     * @returns {Object} - Current bit array and stats
     */
    getStatus() {
        // Count how many bits are set to 1
        const bitsSet = this.bitArray.filter(bit => bit === 1).length;

        return {
            bitArray: [...this.bitArray],
            size: this.size,
            bitsSet: bitsSet,
            itemCount: this.itemCount,
            // Fill ratio - higher means more likely false positives
            fillRatio: (bitsSet / this.size * 100).toFixed(2) + '%'
        };
    }
}

module.exports = BloomFilter;

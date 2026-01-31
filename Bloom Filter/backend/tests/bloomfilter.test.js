/**
 * Unit Tests for Bloom Filter
 * 
 * Run with: npm test
 * 
 * These tests verify that the Bloom Filter works correctly.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert');
const BloomFilter = require('../src/bloomfilter/BloomFilter');
const { hash1, hash2, hash3, hash4, getAllHashes } = require('../src/bloomfilter/hashFunctions');

describe('Hash Functions', () => {
    test('hash1 returns consistent results', () => {
        const result1 = hash1('test', 64);
        const result2 = hash1('test', 64);
        assert.strictEqual(result1, result2);
    });

    test('hash functions return different values for same input', () => {
        const h1 = hash1('hello', 64);
        const h2 = hash2('hello', 64);
        const h3 = hash3('hello', 64);
        const h4 = hash4('hello', 64);

        // At least some should be different
        const unique = new Set([h1, h2, h3, h4]);
        assert.ok(unique.size >= 2, 'Hash functions should produce some different values');
    });

    test('getAllHashes returns 4 values', () => {
        const hashes = getAllHashes('test', 64);
        assert.strictEqual(hashes.length, 4);
    });

    test('hash values are within bounds', () => {
        const size = 64;
        const hashes = getAllHashes('test string', size);

        hashes.forEach(hash => {
            assert.ok(hash >= 0 && hash < size, `Hash ${hash} should be within [0, ${size})`);
        });
    });
});

describe('Bloom Filter', () => {
    test('new filter has all zeros', () => {
        const bf = new BloomFilter(64);
        const status = bf.getStatus();

        assert.strictEqual(status.bitsSet, 0);
        assert.strictEqual(status.itemCount, 0);
        assert.ok(status.bitArray.every(bit => bit === 0));
    });

    test('add() sets bits and returns positions', () => {
        const bf = new BloomFilter(64);
        const result = bf.add('apple');

        assert.ok(result.positions.length > 0);
        assert.strictEqual(result.value, 'apple');

        // Check that returned positions have bit set to 1
        result.positions.forEach(pos => {
            assert.strictEqual(result.bitArray[pos], 1);
        });
    });

    test('check() returns true for added value', () => {
        const bf = new BloomFilter(64);
        bf.add('banana');

        const result = bf.check('banana');

        assert.strictEqual(result.exists, true);
        assert.ok(result.message.includes('Maybe Yes'));
    });

    test('check() returns false for value not added (usually)', () => {
        const bf = new BloomFilter(64);
        bf.add('apple');

        // Check a very different value
        const result = bf.check('xyz123');

        // Note: This might occasionally be true due to false positives,
        // but with a 64-bit array and one insertion, it's unlikely
        // For testing purposes, we check multiple random strings
        let foundFalse = false;
        const testStrings = ['xyz123', 'qwerty', '999999', 'notadded'];

        for (const str of testStrings) {
            if (!bf.check(str).exists) {
                foundFalse = true;
                break;
            }
        }

        assert.ok(foundFalse, 'At least one non-added value should return false');
    });

    test('reset() clears all bits', () => {
        const bf = new BloomFilter(64);
        bf.add('apple');
        bf.add('banana');

        // Verify some bits are set
        assert.ok(bf.getStatus().bitsSet > 0);

        // Reset
        const result = bf.reset();

        // Verify all zeros
        assert.strictEqual(bf.getStatus().bitsSet, 0);
        assert.strictEqual(bf.getStatus().itemCount, 0);
        assert.ok(result.bitArray.every(bit => bit === 0));
    });

    test('getStatus() returns correct fill ratio', () => {
        const bf = new BloomFilter(64);
        const status = bf.getStatus();

        assert.strictEqual(status.size, 64);
        assert.strictEqual(status.fillRatio, '0.00%');
    });

    test('check() returns false after reset', () => {
        const bf = new BloomFilter(64);
        bf.add('test');

        assert.strictEqual(bf.check('test').exists, true);

        bf.reset();

        assert.strictEqual(bf.check('test').exists, false);
    });
});

console.log('Running Bloom Filter tests...\n');

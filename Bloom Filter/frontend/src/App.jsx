/**
 * Bloom Filter Simulator - Main App Component
 * 
 * This is the main component that:
 * - Manages application state (bit array, results, loading)
 * - Coordinates between child components
 * - Handles API calls
 */

import { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import BitArrayGrid from './components/BitArrayGrid';
import ResultDisplay from './components/ResultDisplay';
import { addValue, checkValue, resetFilter, getStatus } from './services/api';

function App() {
    // ========================
    // State Management
    // ========================

    // The bit array from the Bloom Filter (array of 0s and 1s)
    const [bitArray, setBitArray] = useState(new Array(64).fill(0));

    // Positions that were affected by the last operation (for highlighting)
    const [highlightedPositions, setHighlightedPositions] = useState([]);

    // Result of the last operation
    const [result, setResult] = useState(null);

    // Loading state for API calls
    const [isLoading, setIsLoading] = useState(false);

    // List of values that have been added (for display)
    const [addedValues, setAddedValues] = useState([]);

    // ========================
    // Load initial state on mount
    // ========================
    useEffect(() => {
        loadStatus();
    }, []);

    // Load current filter status from backend
    async function loadStatus() {
        try {
            const status = await getStatus();
            setBitArray(status.bitArray);
        } catch (error) {
            console.error('Failed to load status:', error);
            // Use default empty array on error
        }
    }

    // ========================
    // Event Handlers
    // ========================

    /**
     * Handle adding a value to the Bloom Filter
     */
    async function handleAdd(value) {
        setIsLoading(true);
        setResult(null);

        try {
            const response = await addValue(value);

            // Update bit array
            setBitArray(response.bitArray);

            // Highlight affected positions
            setHighlightedPositions(response.positions);

            // Add to list of added values
            setAddedValues(prev => [...prev, value]);

            // Set result
            setResult({
                type: 'add',
                value: value,
                message: response.message,
                positions: response.positions
            });

            // Clear highlights after animation
            setTimeout(() => setHighlightedPositions([]), 2000);

        } catch (error) {
            setResult({
                type: 'error',
                message: error.message || 'Failed to add value'
            });
        } finally {
            setIsLoading(false);
        }
    }

    /**
     * Handle checking if a value exists
     */
    async function handleCheck(value) {
        setIsLoading(true);
        setResult(null);

        try {
            const response = await checkValue(value);

            // Highlight positions that were checked
            setHighlightedPositions(response.positions);

            // Set result
            setResult({
                type: 'check',
                value: value,
                exists: response.exists,
                message: response.message,
                positions: response.positions
            });

            // Clear highlights after animation
            setTimeout(() => setHighlightedPositions([]), 2000);

        } catch (error) {
            setResult({
                type: 'error',
                message: error.message || 'Failed to check value'
            });
        } finally {
            setIsLoading(false);
        }
    }

    /**
     * Handle resetting the Bloom Filter
     */
    async function handleReset() {
        setIsLoading(true);

        try {
            const response = await resetFilter();

            // Clear bit array
            setBitArray(response.bitArray);

            // Clear all state
            setHighlightedPositions([]);
            setAddedValues([]);

            // Set result
            setResult({
                type: 'reset',
                message: 'Bloom Filter has been reset. All bits cleared.'
            });

        } catch (error) {
            setResult({
                type: 'error',
                message: error.message || 'Failed to reset filter'
            });
        } finally {
            setIsLoading(false);
        }
    }

    // ========================
    // Render
    // ========================

    return (
        <div className="app">
            {/* Header */}
            <header className="header">
                <div className="header-content">
                    <h1 className="title">
                        <span className="title-icon">🌸</span>
                        Bloom Filter Simulator
                    </h1>
                    <p className="subtitle">
                        Learn how probabilistic data structures work through interactive visualization
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="main-content">
                {/* Info Card */}
                <section className="info-card">
                    <h2>What is a Bloom Filter?</h2>
                    <p>
                        A <strong>Bloom Filter</strong> is a space-efficient probabilistic data structure
                        used to test whether an element is a member of a set.
                    </p>
                    <div className="info-highlights">
                        <div className="highlight-item highlight-good">
                            <span className="highlight-icon">✓</span>
                            <div>
                                <strong>"Definitely No"</strong>
                                <p>If it says no, the value is definitely NOT in the set</p>
                            </div>
                        </div>
                        <div className="highlight-item highlight-warning">
                            <span className="highlight-icon">?</span>
                            <div>
                                <strong>"Maybe Yes"</strong>
                                <p>If it says yes, the value MIGHT be in the set (possible false positive)</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Input Form */}
                <section className="section">
                    <InputForm
                        onAdd={handleAdd}
                        onCheck={handleCheck}
                        onReset={handleReset}
                        isLoading={isLoading}
                    />
                </section>

                {/* Result Display */}
                <section className="section">
                    <ResultDisplay result={result} />
                </section>

                {/* Bit Array Visualization */}
                <section className="section">
                    <BitArrayGrid
                        bitArray={bitArray}
                        highlightedPositions={highlightedPositions}
                    />
                </section>

                {/* Added Values List */}
                {addedValues.length > 0 && (
                    <section className="section added-values-section">
                        <h3 className="section-title">
                            <span className="title-icon">📝</span>
                            Added Values
                        </h3>
                        <div className="added-values-list">
                            {addedValues.map((value, index) => (
                                <span key={index} className="added-value-tag">
                                    {value}
                                </span>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* Footer */}
            <footer className="footer">
                <p>
                    🌸 Bloom Filter Simulator |
                    Built for learning probabilistic data structures
                </p>
            </footer>
        </div>
    );
}

export default App;

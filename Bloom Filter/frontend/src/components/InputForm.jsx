/**
 * InputForm Component
 * 
 * A form component for entering values to add or check in the Bloom Filter.
 * Features:
 * - Text input for value entry
 * - Add button to insert value
 * - Check button to verify if value exists
 * - Reset button to clear the filter
 */

import { useState } from 'react';

function InputForm({ onAdd, onCheck, onReset, isLoading }) {
    // State for the input value
    const [inputValue, setInputValue] = useState('');

    // Handle form submission
    const handleSubmit = (e, action) => {
        e.preventDefault();

        if (action === 'reset') {
            onReset();
            return;
        }

        // Don't submit if input is empty
        if (!inputValue.trim()) {
            return;
        }

        if (action === 'add') {
            onAdd(inputValue.trim());
        } else if (action === 'check') {
            onCheck(inputValue.trim());
        }

        // Clear input after action
        setInputValue('');
    };

    return (
        <div className="input-form-container">
            <form className="input-form" onSubmit={(e) => e.preventDefault()}>
                <div className="input-wrapper">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter a value (e.g., apple, banana...)"
                        className="value-input"
                        disabled={isLoading}
                    />
                </div>

                <div className="button-group">
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, 'add')}
                        className="btn btn-add"
                        disabled={isLoading || !inputValue.trim()}
                    >
                        <span className="btn-icon">+</span>
                        Add to Filter
                    </button>

                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, 'check')}
                        className="btn btn-check"
                        disabled={isLoading || !inputValue.trim()}
                    >
                        <span className="btn-icon">?</span>
                        Check Value
                    </button>

                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, 'reset')}
                        className="btn btn-reset"
                        disabled={isLoading}
                    >
                        <span className="btn-icon">↺</span>
                        Reset
                    </button>
                </div>
            </form>

            <div className="sample-values">
                <span className="sample-label">Try these:</span>
                {['apple', 'banana', 'cherry', 'date'].map((value) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => setInputValue(value)}
                        className="sample-btn"
                    >
                        {value}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default InputForm;

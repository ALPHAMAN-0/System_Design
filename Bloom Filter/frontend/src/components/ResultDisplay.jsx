/**
 * ResultDisplay Component
 * 
 * Displays the result of add or check operations.
 * Shows different styles and messages based on the result:
 * - "Definitely No" - shown in red/danger style
 * - "Maybe Yes (possible false positive)" - shown in amber/warning style
 * - Success messages for add operations - shown in green
 */

function ResultDisplay({ result }) {
    // If no result yet, show initial message
    if (!result) {
        return (
            <div className="result-container result-empty">
                <div className="result-icon">🔍</div>
                <p className="result-message">
                    Add values to the filter or check if a value exists
                </p>
            </div>
        );
    }

    // Determine the result type and styling
    let resultClass = 'result-info';
    let icon = 'ℹ️';

    if (result.type === 'add') {
        resultClass = 'result-success';
        icon = '✅';
    } else if (result.type === 'check') {
        if (result.exists) {
            resultClass = 'result-warning';
            icon = '⚠️';
        } else {
            resultClass = 'result-danger';
            icon = '❌';
        }
    } else if (result.type === 'reset') {
        resultClass = 'result-info';
        icon = '🔄';
    } else if (result.type === 'error') {
        resultClass = 'result-danger';
        icon = '⚠️';
    }

    return (
        <div className={`result-container ${resultClass}`}>
            <div className="result-icon">{icon}</div>

            <div className="result-content">
                {result.value && (
                    <div className="result-value">
                        Value: <code>{result.value}</code>
                    </div>
                )}

                <p className="result-message">{result.message}</p>

                {result.positions && result.positions.length > 0 && (
                    <div className="result-positions">
                        <span className="positions-label">Hash positions:</span>
                        <div className="positions-list">
                            {result.positions.map((pos, idx) => (
                                <span key={idx} className="position-badge">
                                    {pos}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {result.type === 'check' && result.exists && (
                <div className="false-positive-note">
                    <strong>Note:</strong> "Maybe Yes" doesn't guarantee the value was added.
                    It could be a <em>false positive</em> caused by hash collisions from other values.
                </div>
            )}

            {result.type === 'check' && !result.exists && (
                <div className="definitely-no-note">
                    <strong>Guaranteed:</strong> This value was definitely never added to the filter.
                    Bloom Filters never have false negatives.
                </div>
            )}
        </div>
    );
}

export default ResultDisplay;

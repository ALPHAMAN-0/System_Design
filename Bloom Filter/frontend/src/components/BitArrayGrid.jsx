/**
 * BitArrayGrid Component
 * 
 * Displays the bit array as a visual grid.
 * Each cell represents one bit in the Bloom Filter:
 * - 0 bits are shown in a light/muted color
 * - 1 bits are shown in a highlighted/bright color
 * - Recently affected positions are animated
 */

function BitArrayGrid({ bitArray, highlightedPositions = [] }) {
    // Calculate grid dimensions (8 columns is nice for 64 bits)
    const columns = 8;

    return (
        <div className="bit-array-container">
            <h3 className="section-title">
                <span className="title-icon">⚡</span>
                Bit Array Visualization
            </h3>

            <div className="bit-array-stats">
                <div className="stat">
                    <span className="stat-value">{bitArray.length}</span>
                    <span className="stat-label">Total Bits</span>
                </div>
                <div className="stat">
                    <span className="stat-value">
                        {bitArray.filter(bit => bit === 1).length}
                    </span>
                    <span className="stat-label">Bits Set</span>
                </div>
                <div className="stat">
                    <span className="stat-value">
                        {((bitArray.filter(bit => bit === 1).length / bitArray.length) * 100).toFixed(1)}%
                    </span>
                    <span className="stat-label">Fill Ratio</span>
                </div>
            </div>

            <div
                className="bit-grid"
                style={{
                    gridTemplateColumns: `repeat(${columns}, 1fr)`
                }}
            >
                {bitArray.map((bit, index) => {
                    // Check if this position was recently affected
                    const isHighlighted = highlightedPositions.includes(index);

                    return (
                        <div
                            key={index}
                            className={`bit-cell ${bit === 1 ? 'bit-set' : 'bit-unset'} ${isHighlighted ? 'bit-highlighted' : ''}`}
                            title={`Index: ${index}, Value: ${bit}`}
                        >
                            <span className="bit-index">{index}</span>
                            <span className="bit-value">{bit}</span>
                        </div>
                    );
                })}
            </div>

            <div className="bit-legend">
                <div className="legend-item">
                    <div className="legend-box legend-unset"></div>
                    <span>0 (Not set)</span>
                </div>
                <div className="legend-item">
                    <div className="legend-box legend-set"></div>
                    <span>1 (Set)</span>
                </div>
                <div className="legend-item">
                    <div className="legend-box legend-highlighted"></div>
                    <span>Recently affected</span>
                </div>
            </div>
        </div>
    );
}

export default BitArrayGrid;

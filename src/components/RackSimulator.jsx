import React, { useEffect, useRef, useState } from 'react';
import './RackSimulator.css';
import useQuoteStore from '../store/quoteStore';

const RackSimulator = ({ dimensions, partDimensions }) => {
    const canvasRef = useRef(null);
    const rackWidth = 21; // inches
    const rackHeight = 13; // inches
    const wireCount = 13;
    const wireSpacing = rackWidth / (wireCount + 1); // spacing between wires
    const minSpacing = 0.25; // minimum spacing in inches
    const [useWireCentering, setUseWireCentering] = useState(true);
    const [verticalSpacing, setVerticalSpacing] = useState(0.25);
    const [horizontalSpacing, setHorizontalSpacing] = useState(0.25);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !partDimensions) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size (scaled up for better visibility)
        const scale = 30; // pixels per inch
        const width = rackWidth * scale;
        const height = rackHeight * scale;

        // Set canvas size to exactly match rack dimensions
        canvas.width = width;
        canvas.height = height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw rack background
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, width, height);

        // Draw rack frame with depth effect
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;

        // Draw main frame
        ctx.strokeRect(0, 0, width, height);

        // Draw depth effect (bottom and right edges)
        ctx.beginPath();
        ctx.moveTo(width, 0);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Draw the vertical wires with depth effect
        const wirePositions = [];
        for (let i = 1; i <= wireCount; i++) {
            const x = i * (width / (wireCount + 1));
            wirePositions.push(x);

            // Draw wire shadow
            ctx.beginPath();
            ctx.moveTo(x + 1, 0);
            ctx.lineTo(x + 1, height);
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Draw main wire
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw wire highlight
            ctx.beginPath();
            ctx.moveTo(x - 1, 0);
            ctx.lineTo(x - 1, height);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Remove any existing result container
        const container = canvas.parentElement;
        const existingResult = container.querySelector('.rack-result');
        if (existingResult) {
            existingResult.remove();
        }

        // Validate dimensions
        const partWidth = parseFloat(partDimensions.width);
        const partHeight = parseFloat(partDimensions.height);
        if (isNaN(partWidth) || isNaN(partHeight) || partWidth <= 0 || partHeight <= 0) {
            return;
        }

        // Calculate parts per row based on wire centering
        const partsPerRow = useWireCentering ? 13 : Math.floor((rackWidth + horizontalSpacing) / (partWidth + horizontalSpacing));

        // Calculate parts per column using custom vertical spacing
        const partsPerColumn = Math.floor((rackHeight + verticalSpacing) / (partHeight + verticalSpacing));

        // Calculate spacing
        const actualVerticalSpacing = verticalSpacing;
        const actualHorizontalSpacing = useWireCentering ? 0 : horizontalSpacing;

        // Draw parts with depth effect
        const scaledPartWidth = partWidth * scale;
        const scaledPartHeight = partHeight * scale;
        const scaledVerticalSpacing = actualVerticalSpacing * scale;
        const scaledHorizontalSpacing = actualHorizontalSpacing * scale;

        for (let row = 0; row < partsPerColumn; row++) {
            for (let col = 0; col < partsPerRow; col++) {
                let x;
                if (useWireCentering) {
                    // Center part on wire
                    x = wirePositions[col] - (scaledPartWidth / 2);
                } else {
                    // Use grid spacing for larger parts
                    x = scaledHorizontalSpacing + col * (scaledPartWidth + scaledHorizontalSpacing);
                }

                const y = scaledVerticalSpacing + row * (scaledPartHeight + scaledVerticalSpacing);

                if (x + scaledPartWidth <= canvas.width && y + scaledPartHeight <= canvas.height) {
                    // Draw part shadow
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                    ctx.fillRect(x + 2, y + 2, scaledPartWidth, scaledPartHeight);

                    // Draw main part
                    ctx.fillStyle = 'rgba(0, 123, 255, 0.3)';
                    ctx.fillRect(x, y, scaledPartWidth, scaledPartHeight);

                    // Draw part border
                    ctx.strokeStyle = '#007bff';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x, y, scaledPartWidth, scaledPartHeight);

                    // Draw part highlight
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + scaledPartWidth, y);
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        // Get the total quantity from the store
        const totalQuantity = useQuoteStore.getState().partData.quantity || 0;
        const totalCapacity = partsPerRow * partsPerColumn;
        const racksNeeded = Math.ceil(totalQuantity / totalCapacity);

        // Create a container for the results
        const resultContainer = document.createElement('div');
        resultContainer.className = 'rack-result';
        resultContainer.innerHTML = `
            <div class="result-item">
                <span class="result-label">Total Racks Needed:</span>
                <span class="result-value">${racksNeeded}</span>
            </div>
            <div class="result-details">
                <div class="detail-item">
                    <span class="detail-label">Rack Capacity:</span>
                    <span class="detail-value">${totalCapacity} parts</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Parts per Row:</span>
                    <span class="detail-value">${partsPerRow}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Parts per Column:</span>
                    <span class="detail-value">${partsPerColumn}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Wire Spacing:</span>
                    <span class="detail-value">${useWireCentering ? '1.5 in' : `${horizontalSpacing.toFixed(2)} in`}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Vertical Spacing:</span>
                    <span class="detail-value">${verticalSpacing.toFixed(2)} in</span>
                </div>
            </div>
        `;

        // Add the result container after the canvas
        container.appendChild(resultContainer);
    }, [partDimensions, useWireCentering, verticalSpacing, horizontalSpacing]);

    return (
        <div className="rack-simulator">
            <div className="rack-controls">
                <div className="input-group">
                    <label htmlFor="wireCentering">Wire Centering:</label>
                    <input
                        type="checkbox"
                        id="wireCentering"
                        checked={useWireCentering}
                        onChange={(e) => setUseWireCentering(e.target.checked)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="verticalSpacing">Vertical Spacing (in):</label>
                    <input
                        type="number"
                        id="verticalSpacing"
                        value={verticalSpacing}
                        onChange={(e) => setVerticalSpacing(Math.max(0.25, parseFloat(e.target.value) || 0.25))}
                        min="0.25"
                        step="0.25"
                    />
                </div>
                {!useWireCentering && (
                    <div className="input-group">
                        <label htmlFor="horizontalSpacing">Horizontal Spacing (in):</label>
                        <input
                            type="number"
                            id="horizontalSpacing"
                            value={horizontalSpacing}
                            onChange={(e) => setHorizontalSpacing(Math.max(0.25, parseFloat(e.target.value) || 0.25))}
                            min="0.25"
                            step="0.25"
                        />
                    </div>
                )}
            </div>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};

export default RackSimulator; 
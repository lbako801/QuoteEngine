import './Quote.css';
import FileBrowser from '../components/FileBrowser';
import RackSimulator from '../components/RackSimulator';
import useQuoteStore from '../store/quoteStore';
import useConfigStore from '../store/configStore';
import { useState, useMemo } from 'react';
import { calculateLaborTimes, calculateTotals } from '../utils/calculations';

function Quote() {
    const {
        partData,
        prepOptions,
        sectionStates,
        setPartData,
        togglePrepOption,
        setPrepSurfaceArea,
        setMaskingHolesCount,
        toggleSection,
        rackingOptions,
        toggleRackingOption,
        setRackingQuantity,
        rackingDimensions,
        setRackingDimension,
        platingSteps,
        addPlatingStep,
        removePlatingStep
    } = useQuoteStore();

    const { config } = useConfigStore();

    const [totalsSectionStates, setTotalsSectionStates] = useState({
        labor: true,
        plating: true,
        summary: true
    });

    const toggleTotalsSection = (section) => {
        setTotalsSectionStates(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const isPartInfoComplete = partData.name && partData.quantity > 0 && partData.surfaceArea > 0;

    // Calculate labor times and costs
    const laborResults = useMemo(() => {
        if (!isPartInfoComplete) return null;
        return calculateLaborTimes(partData, prepOptions, config);
    }, [partData, prepOptions, config, isPartInfoComplete]);

    // Calculate totals
    const totals = useMemo(() => {
        if (!laborResults) return null;
        return calculateTotals(laborResults);
    }, [laborResults]);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Format minutes
    const formatMinutes = (minutes) => {
        return minutes.toFixed(1);
    };

    return (
        <div className="quote-container">
            <div className="quote-card">
                <div className="quote-section">
                    <h2 onClick={() => toggleSection('part')}>
                        <div className="section-header">
                            <div>
                                <span className={`caret ${!sectionStates.part ? 'collapsed' : ''}`}>▼</span>
                                Part
                            </div>
                            <span className={`section-checkmark ${partData.name && partData.quantity > 0 && partData.surfaceArea > 0 ? 'visible' : ''}`}>✓</span>
                        </div>
                    </h2>
                    <div className={`quote-section-content ${!sectionStates.part ? 'collapsed' : ''}`}>
                    <div className="model-card">
                            <h3 onClick={() => toggleSection('model')}>
                                <span className={`caret ${!sectionStates.model ? 'collapsed' : ''}`}>▼</span>
                                Model
                            </h3>
                            <div className={`model-content ${!sectionStates.model ? 'collapsed' : ''}`}>
                        <FileBrowser />
                            </div>
                        </div>

                        <div className="part-card">
                            <div className="input-group">
                                <label htmlFor="partName">Part No.:</label>
                                <input
                                    type="text"
                                    id="partName"
                                    name="partName"
                                    placeholder="Enter part number"
                                    value={partData.name}
                                    onChange={(e) => setPartData('name', e.target.value)}
                                    className="wide-input"
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="description">Description:</label>
                                <input
                                    id="description"
                                    name="description"
                                    placeholder="Enter part description"
                                    value={partData.description}
                                    onChange={(e) => setPartData('description', e.target.value)}
                                    className="wide-input"
                                />
                            </div>

                            <div className="input-group horizontal">
                                <div className="input-group">
                                    <label htmlFor="quantity">Quantity:</label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        min="1"
                                        step="1"
                                        placeholder="Enter quantity"
                                        value={partData.quantity}
                                        onChange={(e) => setPartData('quantity', e.target.value)}
                                        onBlur={(e) => {
                                            const value = Math.max(1, parseInt(e.target.value) || 1);
                                            setPartData('quantity', value);
                                        }}
                                    />
                                </div>

                                <div className="input-group">
                                    <label htmlFor="surfaceArea">Surface Area:</label>
                                    <div className="surface-area-input">
                                        <input
                                            type="number"
                                            id="surfaceArea"
                                            name="surfaceArea"
                                            min="0"
                                            step="0.01"
                                            placeholder="Enter Surface Area"
                                            value={partData.surfaceArea}
                                            onChange={(e) => setPartData('surfaceArea', e.target.value)}
                                            onBlur={(e) => {
                                                const value = Math.max(0, parseFloat(e.target.value) || 0);
                                                setPartData('surfaceArea', value);
                                            }}
                                        />
                                        <span className="unit">in²</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`quote-section ${!isPartInfoComplete ? 'disabled' : ''}`}>
                    <h2 onClick={() => isPartInfoComplete && toggleSection('prep')}>
                        <div className="section-header">
                            <div>
                                <span className={`caret ${!sectionStates.prep ? 'collapsed' : ''}`}>▼</span>
                                Prep
                                {!isPartInfoComplete && <span className="section-hint">(Complete part info first)</span>}
                            </div>
                            <span className={`section-checkmark ${Object.values(prepOptions).some(option => option.checked && option.surfaceArea > 0) ? 'visible' : ''}`}>✓</span>
                        </div>
                    </h2>
                    <div className={`quote-section-content ${!sectionStates.prep ? 'collapsed' : ''}`}>
                        <div className="prep-options">
                            <div className="checkbox-group">
                                <div className="checkbox-row">
                                    <input
                                        type="checkbox"
                                        id="gritBlasting"
                                        name="gritBlasting"
                                        checked={prepOptions.gritBlasting.checked}
                                        onChange={() => togglePrepOption('gritBlasting')}
                                    />
                                    <label htmlFor="gritBlasting">Requires Grit Blasting</label>
                                </div>
                                <div className={`surface-area-input ${prepOptions.gritBlasting.checked ? 'expanded' : ''}`}>
                                    <input
                                        type="number"
                                        value={prepOptions.gritBlasting.surfaceArea}
                                        onChange={(e) => setPrepSurfaceArea('gritBlasting', e.target.value)}
                                        placeholder="Area for grit blasting"
                                        min="0"
                                        step="0.01"
                                    />
                                    <span className="unit">in²</span>
                                </div>
                            </div>
                            <div className="checkbox-group">
                                <div className="checkbox-row">
                                    <input
                                        type="checkbox"
                                        id="masking"
                                        name="masking"
                                        checked={prepOptions.masking.checked}
                                        onChange={() => togglePrepOption('masking')}
                                    />
                                    <label htmlFor="masking">Requires Masking</label>
                                </div>
                                <div className={`surface-area-input ${prepOptions.masking.checked ? 'expanded' : ''}`}>
                                    <input
                                        type="number"
                                        value={prepOptions.masking.surfaceArea}
                                        onChange={(e) => setPrepSurfaceArea('masking', e.target.value)}
                                        placeholder="Area for masking"
                                        min="0"
                                        step="0.01"
                                    />
                                    <span className="unit">in²</span>
                                </div>
                                {prepOptions.masking.checked && (
                                    <div className={`surface-area-input ${prepOptions.masking.checked ? 'expanded' : ''}`}>
                                        <input
                                            type="number"
                                            value={prepOptions.masking.holesCount}
                                            onChange={(e) => setMaskingHolesCount(e.target.value)}
                                            placeholder="# of holes/dowels"
                                            min="0"
                                            step="1"
                                        />
                                        <span className="unit">holes</span>
                                    </div>
                                )}
                            </div>
                            <div className="checkbox-group">
                                <div className="checkbox-row">
                                    <input
                                        type="checkbox"
                                        id="polishing"
                                        name="polishing"
                                        checked={prepOptions.polishing.checked}
                                        onChange={() => togglePrepOption('polishing')}
                                    />
                                    <label htmlFor="polishing">Requires Polishing</label>
                                </div>
                                <div className={`surface-area-input ${prepOptions.polishing.checked ? 'expanded' : ''}`}>
                                    <input
                                        type="number"
                                        value={prepOptions.polishing.surfaceArea}
                                        onChange={(e) => setPrepSurfaceArea('polishing', e.target.value)}
                                        placeholder="Area for polishing"
                                        min="0"
                                        step="0.01"
                                    />
                                    <span className="unit">in²</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`quote-section ${!isPartInfoComplete ? 'disabled' : ''}`}>
                    <h2 onClick={() => isPartInfoComplete && toggleSection('racking')}>
                        <div className="section-header">
                            <div>
                                <span className={`caret ${!sectionStates.racking ? 'collapsed' : ''}`}>▼</span>
                                Racking
                                {!isPartInfoComplete && <span className="section-hint">(Complete part info first)</span>}
                            </div>
                            <span className={`section-checkmark ${rackingDimensions.width > 0 && rackingDimensions.height > 0 ? 'visible' : ''}`}>✓</span>
                        </div>
                    </h2>
                    <div className={`quote-section-content ${!sectionStates.racking ? 'collapsed' : ''}`}>
                        <div className="dimensions-group">
                            <div className="dimension-input">
                                <label htmlFor="rackingWidth">Width:</label>
                                <div className="input-with-unit">
                                    <input
                                        type="number"
                                        id="rackingWidth"
                                        name="rackingWidth"
                                        value={rackingDimensions.width}
                                        onChange={(e) => setRackingDimension('width', e.target.value)}
                                        placeholder="Enter width"
                                        min="0"
                                        step="0.01"
                                    />
                                    <span className="unit">in</span>
                                </div>
                            </div>
                            <div className="dimension-input">
                                <label htmlFor="rackingHeight">Height:</label>
                                <div className="input-with-unit">
                                    <input
                                        type="number"
                                        id="rackingHeight"
                                        name="rackingHeight"
                                        value={rackingDimensions.height}
                                        onChange={(e) => setRackingDimension('height', e.target.value)}
                                        placeholder="Enter height"
                                        min="0"
                                        step="0.01"
                                    />
                                    <span className="unit">in</span>
                                </div>
                            </div>
                        </div>
                        <div className="model-card">
                            <h3 onClick={() => toggleSection('rackSimulator')}>
                                <span className={`caret ${!sectionStates.rackSimulator ? 'collapsed' : ''}`}>▼</span>
                                Rack Simulator
                            </h3>
                            <div className={`model-content ${!sectionStates.rackSimulator ? 'collapsed' : ''}`}>
                                <RackSimulator
                                    dimensions={{ width: 21, height: 13 }}
                                    partDimensions={rackingDimensions}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`quote-section ${!isPartInfoComplete ? 'disabled' : ''}`}>
                    <h2 onClick={() => isPartInfoComplete && toggleSection('plating')}>
                        <div className="section-header">
                            <div>
                                <span className={`caret ${!sectionStates.plating ? 'collapsed' : ''}`}>▼</span>
                                Plating
                                {!isPartInfoComplete && <span className="section-hint">(Complete part info first)</span>}
                            </div>
                            <span className={`section-checkmark ${platingSteps.length > 0 ? 'visible' : ''}`}>✓</span>
                        </div>
                    </h2>
                    <div className={`quote-section-content ${!sectionStates.plating ? 'collapsed' : ''}`}>
                        <div className="plating-options">
                            <div className="plating-steps">
                                <div className="plating-steps-list">
                                    {platingSteps.map((step, index) => (
                                        <div key={step.id} className="plating-step">
                                            <div className="step-number">{step.order}</div>
                                            <div className="step-type">{step.type}</div>
                                            <button 
                                                className="remove-step"
                                                onClick={() => removePlatingStep(step.id)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="add-step-controls">
                                    <select 
                                        className="step-type-select"
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                addPlatingStep(e.target.value);
                                                e.target.value = '';
                                            }
                                        }}
                                    >
                                        <option value="">Add plating step...</option>
                                        <option value="Gold">Gold</option>
                                        <option value="Silver">Silver</option>
                                        <option value="ENP">ENP</option>
                                        <option value="Bright Nickel">Bright Nickel</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="quote-section">
                    <h2 onClick={() => toggleSection('totals')}>
                        <div className="section-header">
                            <div>
                                <span className={`caret ${!sectionStates.totals ? 'collapsed' : ''}`}>▼</span>
                                Totals
                            </div>
                        </div>
                    </h2>
                    <div className={`quote-section-content ${!sectionStates.totals ? 'collapsed' : ''}`}>
                        <div className="totals-container">
                            <div className="totals-section">
                                <h3 onClick={() => toggleTotalsSection('labor')}>
                                    <div className="section-header">
                                        <div>
                                            <span className={`caret ${!totalsSectionStates.labor ? 'collapsed' : ''}`}>▼</span>
                                            Labor Totals
                                        </div>
                                    </div>
                                </h3>
                                <div className={`totals-content ${!totalsSectionStates.labor ? 'collapsed' : ''}`}>
                                    <div className="totals-grid">
                                        <div className="total-header">
                                            <div className="total-label"></div>
                                            <div className="total-columns">
                                                <div className="total-value">Minutes/Part</div>
                                                <div className="total-value">Minutes/Qty</div>
                                                <div className="total-value">Per Part</div>
                                                <div className="total-value">Per Qty</div>
                                            </div>
                                        </div>
                                        {prepOptions.gritBlasting.checked && laborResults && (
                                            <div className="total-item">
                                                <div className="total-label">Grit Blasting</div>
                                                <div className="total-columns">
                                                    <div className="total-value">{formatMinutes(laborResults.gritBlasting.minutesPerPart)}</div>
                                                    <div className="total-value">{formatMinutes(laborResults.gritBlasting.minutesPerQty)}</div>
                                                    <div className="total-value">{formatCurrency(laborResults.gritBlasting.costPerPart)}</div>
                                                    <div className="total-value">{formatCurrency(laborResults.gritBlasting.costPerQty)}</div>
                                                </div>
                                            </div>
                                        )}
                                        {prepOptions.masking.checked && laborResults && (
                                            <div className="total-item">
                                                <div className="total-label">Masking</div>
                                                <div className="total-columns">
                                                    <div className="total-value">{formatMinutes(laborResults.masking.minutesPerPart)}</div>
                                                    <div className="total-value">{formatMinutes(laborResults.masking.minutesPerQty)}</div>
                                                    <div className="total-value">{formatCurrency(laborResults.masking.costPerPart)}</div>
                                                    <div className="total-value">{formatCurrency(laborResults.masking.costPerQty)}</div>
                                                </div>
                                            </div>
                                        )}
                                        {prepOptions.polishing.checked && laborResults && (
                                            <div className="total-item">
                                                <div className="total-label">Polishing</div>
                                                <div className="total-columns">
                                                    <div className="total-value">{formatMinutes(laborResults.polishing.minutesPerPart)}</div>
                                                    <div className="total-value">{formatMinutes(laborResults.polishing.minutesPerQty)}</div>
                                                    <div className="total-value">{formatCurrency(laborResults.polishing.costPerPart)}</div>
                                                    <div className="total-value">{formatCurrency(laborResults.polishing.costPerQty)}</div>
                                                </div>
                                            </div>
                                        )}
                                        {totals && (
                                            <div className="total-item total-subtotal">
                                                <div className="total-label">Labor Subtotal</div>
                                                <div className="total-columns">
                                                    <div className="total-value">{formatMinutes(totals.minutesPerPart)}</div>
                                                    <div className="total-value">{formatMinutes(totals.minutesPerQty)}</div>
                                                    <div className="total-value">{formatCurrency(totals.costPerPart)}</div>
                                                    <div className="total-value">{formatCurrency(totals.costPerQty)}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="totals-section">
                                <h3 onClick={() => toggleTotalsSection('plating')}>
                                    <div className="section-header">
                                        <div>
                                            <span className={`caret ${!totalsSectionStates.plating ? 'collapsed' : ''}`}>▼</span>
                                            Plating Totals
                                        </div>
                                    </div>
                                </h3>
                                <div className={`totals-content ${!totalsSectionStates.plating ? 'collapsed' : ''}`}>
                                    <div className="totals-grid">
                                        <div className="total-header">
                                            <div className="total-label"></div>
                                            <div className="total-columns">
                                                <div className="total-value">Per Part</div>
                                                <div className="total-value">Per Qty</div>
                                            </div>
                                        </div>
                                        {platingSteps.map(step => (
                                            <div key={step.id} className="total-item">
                                                <div className="total-label">{step.type}</div>
                                                <div className="total-columns">
                                                    <div className="total-value">$0.00</div>
                                                    <div className="total-value">$0.00</div>
                                                </div>
                                            </div>
                                        ))}
                                        {platingSteps.length > 0 && (
                                            <div className="total-item total-subtotal">
                                                <div className="total-label">Plating Subtotal</div>
                                                <div className="total-columns">
                                                    <div className="total-value">$0.00</div>
                                                    <div className="total-value">$0.00</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="totals-section">
                                <h3 onClick={() => toggleTotalsSection('summary')}>
                                    <div className="section-header">
                                        <div>
                                            <span className={`caret ${!totalsSectionStates.summary ? 'collapsed' : ''}`}>▼</span>
                                            Summary
                                        </div>
                                    </div>
                                </h3>
                                <div className={`totals-content ${!totalsSectionStates.summary ? 'collapsed' : ''}`}>
                                    <div className="totals-grid">
                                        <div className="total-item">
                                            <div className="total-label">Total Surface Area</div>
                                            <div className="total-value">0.00 in²</div>
                                        </div>
                                        <div className="total-item">
                                            <div className="total-label">Total Prep Area</div>
                                            <div className="total-value">0.00 in²</div>
                                        </div>
                                        <div className="total-item">
                                            <div className="total-label">Total Racks Needed</div>
                                            <div className="total-value">0</div>
                                        </div>
                                        <div className="total-item">
                                            <div className="total-label">Total Parts</div>
                                            <div className="total-value">0</div>
                                        </div>
                                        <div className="total-header">
                                            <div className="total-label"></div>
                                            <div className="total-columns">
                                                <div className="total-value">Per Part</div>
                                                <div className="total-value">Per Qty</div>
                                            </div>
                                        </div>
                                        <div className="total-item total-grand-total">
                                            <div className="total-label">Grand Total</div>
                                            <div className="total-columns">
                                                <div className="total-value">$0.00</div>
                                                <div className="total-value">$0.00</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="add-to-quote-container">
                            <button className="add-to-quote-button">Add to Quote</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="quote-card quote-lines">
                <div className="quote-section">
                    <h2 onClick={() => toggleSection('quoteLines')}>
                        <span className={`caret ${!sectionStates.quoteLines ? 'collapsed' : ''}`}>▼</span>
                        Quote Lines
                    </h2>
                    <div className={`quote-section-content ${!sectionStates.quoteLines ? 'collapsed' : ''}`}>
                    {/* Quote lines will go here */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Quote; 
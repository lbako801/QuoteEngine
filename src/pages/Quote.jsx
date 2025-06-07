import './Quote.css';
import FileBrowser from '../components/FileBrowser';
import RackSimulator from '../components/RackSimulator';
import useQuoteStore from '../store/quoteStore';

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
        setRackingDimension
    } = useQuoteStore();

    const isPartInfoComplete = partData.name && partData.quantity > 0 && partData.surfaceArea > 0;

    return (
        <div className="quote-container">
            <div className="quote-card">
                <div className="quote-section">
                    <h2 onClick={() => toggleSection('part')}>
                        <span className={`caret ${!sectionStates.part ? 'collapsed' : ''}`}>▼</span>
                        Part
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
                                <label htmlFor="partName">Part Name:</label>
                                <input
                                    type="text"
                                    id="partName"
                                    name="partName"
                                    placeholder="Enter part name"
                                    value={partData.name}
                                    onChange={(e) => setPartData('name', e.target.value)}
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
                        <span className={`caret ${!sectionStates.prep ? 'collapsed' : ''}`}>▼</span>
                        Prep
                        {!isPartInfoComplete && <span className="section-hint">(Complete part info first)</span>}
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
                        <span className={`caret ${!sectionStates.racking ? 'collapsed' : ''}`}>▼</span>
                        Racking
                        {!isPartInfoComplete && <span className="section-hint">(Complete part info first)</span>}
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
                        <span className={`caret ${!sectionStates.plating ? 'collapsed' : ''}`}>▼</span>
                        Plating
                        {!isPartInfoComplete && <span className="section-hint">(Complete part info first)</span>}
                    </h2>
                    <div className={`quote-section-content ${!sectionStates.plating ? 'collapsed' : ''}`}>
                        <div className="plating-options">
                            {/* Plating options will go here */}
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
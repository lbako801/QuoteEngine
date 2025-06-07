import './Setup.css';
import useConfigStore from '../store/configStore';
import { useState } from 'react';

function Setup() {
    const { config, updateHourlyRate, updateProcessRate, updateMaterialCost, resetToDefaults } = useConfigStore();
    const [sectionStates, setSectionStates] = useState({
        labor: true,
        materials: true,
        calculations: true
    });

    const toggleSection = (section) => {
        setSectionStates(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

  return (
    <div className="setup-container">
            <div className="setup-card">
                <div className="setup-header">
                    <h1>Setup</h1>
                    <button className="reset-button" onClick={resetToDefaults}>
                        Reset to Defaults
                    </button>
                </div>

                <div className="setup-section">
                    <h2 onClick={() => toggleSection('labor')}>
                        <div className="section-header">
                            <div>
                                <span className={`caret ${!sectionStates.labor ? 'collapsed' : ''}`}>▼</span>
                                Labor Rates
                            </div>
                        </div>
                    </h2>
                    <div className={`setup-section-content ${!sectionStates.labor ? 'collapsed' : ''}`}>
                        <div className="config-group">
                            <h3>Hourly Rate</h3>
                            <div className="input-group">
                                <label htmlFor="hourlyRate">Hourly Rate:</label>
                                <div className="input-with-unit">
                                    <input
                                        type="number"
                                        id="hourlyRate"
                                        name="hourlyRate"
                                        value={config.laborRates.hourlyRate}
                                        onChange={(e) => updateHourlyRate(e.target.value)}
                                        placeholder="Enter hourly rate"
                                        min="0"
                                        step="0.01"
                                    />
                                    <span className="unit">$/hr</span>
                                </div>
                            </div>
                        </div>

                        <div className="config-group">
                            <h3>Process Rates</h3>
                            {Object.entries(config.laborRates.processes).map(([process, rates]) => (
                                <div key={process} className="process-group">
                                    <h4>{process.charAt(0).toUpperCase() + process.slice(1)}</h4>
                                    <div className="input-group">
                                        <label htmlFor={`${process}MinutesPerSquareInch`}>Minutes/in²:</label>
                                        <div className="input-with-unit">
                                            <input
                                                type="number"
                                                id={`${process}MinutesPerSquareInch`}
                                                name={`${process}MinutesPerSquareInch`}
                                                value={rates.minutesPerSquareInch}
                                                onChange={(e) => updateProcessRate(process, 'minutesPerSquareInch', e.target.value)}
                                                placeholder="Enter minutes per square inch"
                                                min="0"
                                                step="0.01"
                                            />
                                            <span className="unit">min/in²</span>
                                        </div>
                                    </div>
                                    {process === 'masking' && (
                                        <div className="input-group">
                                            <label htmlFor={`${process}MinutesPerHole`}>Minutes/hole:</label>
                                            <div className="input-with-unit">
                                                <input
                                                    type="number"
                                                    id={`${process}MinutesPerHole`}
                                                    name={`${process}MinutesPerHole`}
                                                    value={rates.minutesPerHole}
                                                    onChange={(e) => updateProcessRate(process, 'minutesPerHole', e.target.value)}
                                                    placeholder="Enter minutes per hole"
                                                    min="0"
                                                    step="0.01"
                                                />
                                                <span className="unit">min/hole</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="setup-section">
                    <h2 onClick={() => toggleSection('materials')}>
                        <div className="section-header">
                            <div>
                                <span className={`caret ${!sectionStates.materials ? 'collapsed' : ''}`}>▼</span>
                                Material Costs
                            </div>
                        </div>
                    </h2>
                    <div className={`setup-section-content ${!sectionStates.materials ? 'collapsed' : ''}`}>
                        <div className="config-group">
                            <h3>Costs per Square Inch</h3>
                            {Object.entries(config.materialCosts).map(([material, cost]) => (
                                <div key={material} className="input-group">
                                    <label htmlFor={material}>{material.charAt(0).toUpperCase() + material.slice(1)}:</label>
                                    <div className="input-with-unit">
                                        <input
                                            type="number"
                                            id={material}
                                            name={material}
                                            value={cost}
                                            onChange={(e) => updateMaterialCost(material, e.target.value)}
                                            placeholder={`Enter ${material} cost`}
                                            min="0"
                                            step="0.01"
                                        />
                                        <span className="unit">$/in²</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="setup-section">
                    <h2 onClick={() => toggleSection('calculations')}>
                        <div className="section-header">
                            <div>
                                <span className={`caret ${!sectionStates.calculations ? 'collapsed' : ''}`}>▼</span>
                                Calculations
                            </div>
                        </div>
                    </h2>
                    <div className={`setup-section-content ${!sectionStates.calculations ? 'collapsed' : ''}`}>
                        <div className="config-group">
                            <h3>Calculation Settings</h3>
                            <div className="input-group">
                                <label htmlFor="rackEfficiency">Rack Efficiency:</label>
                                <div className="input-with-unit">
                                    <input
                                        type="number"
                                        id="rackEfficiency"
                                        name="rackEfficiency"
                                        value={config.calculations.rackEfficiency}
                                        onChange={(e) => updateCalculationSetting('rackEfficiency', e.target.value)}
                                        placeholder="Enter rack efficiency"
                                        min="0"
                                        max="100"
                                        step="1"
                                    />
                                    <span className="unit">%</span>
                                </div>
                            </div>
                            <div className="input-group">
                                <label htmlFor="bufferTime">Buffer Time:</label>
                                <div className="input-with-unit">
                                    <input
                                        type="number"
                                        id="bufferTime"
                                        name="bufferTime"
                                        value={config.calculations.bufferTime}
                                        onChange={(e) => updateCalculationSetting('bufferTime', e.target.value)}
                                        placeholder="Enter buffer time"
                                        min="0"
                                        step="0.1"
                                    />
                                    <span className="unit">min</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
  );
}

export default Setup; 
import './Quote.css';
import FileBrowser from '../components/FileBrowser';

function Quote() {
    return (
        <div className="quote-container">
            <div className="quote-card">
                <div className="quote-section">
                    <h2>Part</h2>
                    <div className="model-card">
                        <h3>Model</h3>
                        <FileBrowser />
                    </div>
                    <div className="part-card">
                    </div>
                </div>
                <div className="quote-section">
                    <h2>Prep</h2>
                    {/* Prep content will go here */}
                </div>
            </div>

            <div className="quote-card quote-lines">
                <div className="quote-section">
                    <h2>Quote Lines</h2>
                    {/* Quote lines will go here */}
                </div>
            </div>
        </div>
    );
}

export default Quote; 
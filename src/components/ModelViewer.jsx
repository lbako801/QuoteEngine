import { useRef, useState } from 'react';
import './ModelViewer.css';

function ModelViewer({ modelUrl, fileName }) {
  const modelViewerRef = useRef(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleScreenshot = async () => {
    if (modelViewerRef.current) {
      const screenshot = await modelViewerRef.current.toDataURL();
      // Create a temporary link to download the screenshot
      const link = document.createElement('a');
      link.href = screenshot;
      link.download = `${fileName || 'model'}-screenshot.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`model-viewer ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="model-controls">
        <button 
          className="collapse-button"
          onClick={toggleCollapse}
          title={isCollapsed ? "Expand viewer" : "Collapse viewer"}
        >
          <i className={`fa-solid ${isCollapsed ? 'fa-square-caret-down' : 'fa-square-caret-up'}`}></i>
        </button>
        <button 
          className="screenshot-button"
          onClick={handleScreenshot}
          title="Take screenshot"
        >
          <i className="fa-solid fa-camera"></i>
        </button>
      </div>
      <model-viewer
        ref={modelViewerRef}
        src={modelUrl}
        alt={fileName || "3D Model"}
        camera-controls
        shadow-intensity="0"
        camera-orbit="0deg 75deg 105%"
        min-camera-orbit="auto auto 50%"
        max-camera-orbit="auto auto 150%"
        exposure="1"
        environment-image="neutral"
        style={{ width: '100%', height: '100%' }}
      >
        {fileName && (
          <div className="preview-overlay">
            {fileName}
          </div>
        )}
      </model-viewer>
    </div>
  );
}

export default ModelViewer; 
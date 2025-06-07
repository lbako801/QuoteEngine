import { useState } from 'react';
import './FileBrowser.css';
import ModelViewer from './ModelViewer';

function FileBrowser() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [modelUrl, setModelUrl] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a URL for the selected file
      const fileUrl = URL.createObjectURL(file);
      setModelUrl(fileUrl);
    }
  };

  return (
    <div className="file-browser">
      <div className="file-browser-content">
        <div className="model-container">
          {modelUrl && <ModelViewer modelUrl={modelUrl} fileName={selectedFile?.name} />}
        </div>
        <div className="button-container">
          <label className={`upload-button ${selectedFile ? 'reupload' : ''}`}>
            {selectedFile ? 'Reupload' : 'Upload Model'}
            <input
              type="file"
              id="file-input"
              onChange={handleFileSelect}
              className="file-input"
              accept=".gltf,.glb"
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default FileBrowser; 
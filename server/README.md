# Quote Engine Server

The server-side application for the Quote Engine, built with Node.js, Express, and Python.

## Overview

The server provides the backend API for the Quote Engine, handling:
- File uploads and processing
- PDF analysis and OCR
- AI integration with Ollama
- Data persistence
- API endpoints for the client application

## Prerequisites

- Node.js (v16 or higher)
- Python 3.8 or higher
- Ollama (for AI features) running Deepseek-R1
- Tesseract OCR (for PDF analysis)
- Poppler (for PDF processing)

## Dependencies

### Node.js Dependencies
- Express.js - Web framework
- Multer - File upload handling
- Axios - HTTP client
- CORS - Cross-origin resource sharing
- Various utility packages

### Python Dependencies
- pytesseract - OCR processing
- pdf2image - PDF to image conversion
- Pillow - Image processing
- requests - HTTP client for AI communication

## Setup

1. Install Node.js dependencies:
```bash
npm install
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Install Tesseract OCR:
- Windows: Download and install from https://github.com/UB-Mannheim/tesseract/wiki
- Linux: `sudo apt-get install tesseract-ocr`
- macOS: `brew install tesseract`

4. Install Poppler:
- Windows: Download from http://blog.alivate.com.au/poppler-windows/
- Linux: `sudo apt-get install poppler-utils`
- macOS: `brew install poppler`

5. Install Ollama:
- Follow instructions at https://ollama.ai/download

6. Create a `.env` file in the root directory with:
```
PORT=3001
OLLAMA_API_URL=http://localhost:11434
```

7. Start the server:
```bash
npm start
```

The server will be available at `http://localhost:3001`

## Project Structure

```
server/
├── server.js          # Main server entry point
├── ai.js             # AI integration and chat endpoints
├── analyze_pdf.py    # PDF analysis and OCR processing
├── uploads/          # Temporary file storage
├── ocr_output.txt    # OCR processing output
└── package.json      # Project dependencies
```

## Component Architecture

### 1. Main Server (server.js)
- Express server setup and configuration
- CORS middleware configuration
- Route registration
- Server initialization

### 2. AI Integration (ai.js)
- Ollama API integration
- Chat endpoint implementation
- PDF analysis endpoint
- File upload handling
- System message configuration for AI context
- Error handling and response formatting

Key Features:
- Dynamic model selection (Deepseek-R1 preferred)
- Structured AI responses
- File cleanup after processing
- Comprehensive error handling

### 3. PDF Analysis (analyze_pdf.py)
- PDF to image conversion
- OCR text extraction
- AI analysis integration
- Text processing and formatting

Key Features:
- High-resolution PDF processing (300 DPI)
- Multi-page PDF support
- OCR output logging
- AI analysis pipeline

## API Endpoints

### AI Operations
- `POST /api/ai/chat`
  - Purpose: Chat with AI assistant
  - Input: JSON with message
  - Output: AI response
  - Features: Context-aware responses, error handling

- `POST /api/ai/analyze-pdf`
  - Purpose: Analyze PDF drawings
  - Input: PDF file
  - Output: Structured analysis
  - Features: OCR processing, AI analysis

## Data Flow

1. **File Upload Process**
   - Client uploads file
   - Multer handles file storage
   - File processed by appropriate service
   - Temporary files cleaned up

2. **AI Chat Process**
   - Client sends message
   - Server checks Ollama availability
   - Message processed with context
   - Response formatted and returned

3. **PDF Analysis Process**
   - PDF uploaded
   - Converted to images
   - OCR extracts text
   - AI analyzes content
   - Structured response returned

## Development

- Use `npm run dev` for development with nodemon
- Use `npm start` for production
- Use `npm test` to run tests

## Testing

Run tests with:
```bash
npm test
```

## Notes

- The server requires Ollama to be running for AI features
- PDF analysis requires Tesseract OCR and Poppler to be installed
- Temporary files are stored in the `uploads` directory
- The server communicates with the client at `http://localhost:5173`
- AI responses are structured for metal finishing and plating context
- OCR processing is optimized for technical drawings
- File cleanup is implemented to prevent storage issues 
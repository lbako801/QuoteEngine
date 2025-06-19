# Quote Engine

A comprehensive quoting system for metal finishing and plating operations, featuring AI-assisted analysis and modern web technologies.

## Overview

The Quote Engine is a full-stack application designed to streamline the quoting process for metal finishing and plating operations. It combines modern web technologies with AI capabilities to provide accurate and efficient quote generation.

### Key Features

- **Part Information Management**
  - Detailed part specifications
  - Surface area calculations
  - Quantity management
  - Drawing analysis

- **AI Integration**
  - Drawing analysis with OCR
  - AI-assisted chat support
  - Intelligent process recommendations

- **Plating Process Management**
  - Multiple plating steps
  - Material cost calculations
  - Thickness tracking
  - Process optimization

- **Cost Calculations**
  - Labor costs
  - Material costs
  - Process-specific calculations
  - Total cost breakdown

## System Architecture

The Quote Engine consists of two main components that work together seamlessly:

### Client-Server Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Client   │◄────┤  Express Server │◄────┤  Ollama AI      │
│  (Port 5173)    │     │  (Port 3001)    │     │  (Port 11434)   │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Component Interaction

1. **User Interface (Client)**
   - Built with React
   - Handles user interactions
   - Manages application state
   - Renders PDFs and 3D models
   - Provides real-time feedback

2. **Backend Services (Server)**
   - Built with Express.js
   - Handles file processing
   - Manages AI integration
   - Processes PDFs and drawings
   - Provides API endpoints

3. **AI Integration (Ollama)**
   - Local AI processing
   - Drawing analysis
   - Technical assistance
   - Process recommendations

### Data Flow

1. **Drawing Analysis Flow**
   ```
   Client → Server → PDF Processing → OCR → AI Analysis → Client
   ```
   - Client uploads drawing
   - Server processes PDF
   - OCR extracts text
   - AI analyzes content
   - Results returned to client

2. **Chat Interaction Flow**
   ```
   Client → Server → Ollama → Server → Client
   ```
   - User sends message
   - Server forwards to Ollama
   - AI processes request
   - Response returned to user

3. **Quote Generation Flow**
   ```
   Client → Server → Calculations → Client
   ```
   - User inputs part details
   - Server calculates costs
   - Results displayed to user

## Project Structure

```
QuoteEngine/
├── client/           # React frontend application
│   ├── src/         # Source code
│   │   ├── components/  # UI components
│   │   ├── pages/      # Page components
│   │   └── api/        # API integration
│   └── public/      # Static assets
├── server/          # Node.js/Express backend
│   ├── ai.js        # AI integration
│   ├── analyze_pdf.py # PDF processing
│   └── uploads/     # Temporary storage
└── README.md        # This file
```

## Prerequisites

- Node.js (v16 or higher)
- Python 3.8 or higher
- Ollama (for AI features) running Deepseek-R1
- Tesseract OCR (for PDF analysis)
- Modern web browser

## Quick Start

1. Clone the repository:
```bash
git clone [repository-url]
cd QuoteEngine
```

2. Install all dependencies:
```bash
npm run install:all
```

3. Start both client and server:
```bash
npm start
```

4. Access the application:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Detailed Setup

### Client Setup
See [client/README.md](client/README.md) for detailed client setup instructions.

### Server Setup
See [server/README.md](server/README.md) for detailed server setup instructions.

## Development

### Running in Development Mode

The application can be started in development mode using:
```bash
npm start
```

This will start both the client and server concurrently.

### Building for Production

1. Build the client:
```bash
npm run build
```

2. Start the server in production mode:
```bash
cd server
npm start
```

## API Integration

The client and server communicate through RESTful APIs:

### Main Endpoints

1. **AI Operations**
   - `/api/ai/chat` - AI chat interface
   - `/api/ai/analyze-pdf` - PDF analysis

2. **File Operations**
   - File uploads handled through multipart/form-data
   - Temporary file storage with automatic cleanup

### Error Handling

- Client-side error boundaries
- Server-side error logging
- Graceful degradation
- User-friendly error messages

## Support

For support, please open an issue in the repository or contact the development team.

## Acknowledgments

- Ollama for AI capabilities
- Tesseract OCR for PDF analysis
- React and Node.js communities 
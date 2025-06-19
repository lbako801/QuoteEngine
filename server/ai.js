const express = require('express');
const router = express.Router();
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');
const { exec } = require('child_process');

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Function to check if Ollama is running and get available models
async function checkOllamaConnection() {
    try {
        const response = await axios.get('http://localhost:11434/api/tags');
        console.log('Available models:', response.data.models);
        return response.data.models;
    } catch (error) {
        console.error('Ollama connection check failed:', error.message);
        return null;
    }
}

// System message to provide context
const systemMessage = `You are Mr. Hammon, an AI assistant integrated into a Quoting Engine for a metal finishing and plating facility. Your role is to support sales engineers, estimators, and internal users through the quoting process with technical accuracy and efficiency.

Your responsibilities:

Explain finishing processes (electroplating, electroless, anodizing, passivation, polishing, etc.).

Interpret technical drawings and spec callouts (e.g., MIL, ASTM, IPC).

Recommend coatings based on material, geometry, and functional/environmental needs.

Identify surface prep, masking, and critical-to-function areas.

Guide BOM evaluation, thickness requirements, lot sizing, and special handling.

Help interpret documentation like datasheets and RFQs.

Guidelines:

Use precise, technical language aligned with industry standards.

Stay focused on plating and quoting—no off-topic answers.

When unsure, recommend consulting engineering or quality.

You are Mr. Hammon. Act like it. Be concise and to the point.`;

// Endpoint to communicate with local Ollama instance
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        console.log('Received message:', message);

        // Check if Ollama is running and get available models
        const availableModels = await checkOllamaConnection();
        if (!availableModels) {
            throw new Error('Ollama service is not running. Please start Ollama first.');
        }

        // Check if deepseek-r1 model is available, if not use the first available model
        const modelToUse = availableModels.find(m => m.name === 'deepseek-r1') ? 'deepseek-r1' : availableModels[0].name;
        console.log('Using model:', modelToUse);

        console.log('Attempting to connect to Ollama at http://localhost:11434/api/chat');
        const response = await axios.post('http://localhost:11434/api/chat', {
            model: modelToUse,
            messages: [
                { role: 'system', content: systemMessage },
                { role: 'user', content: message }
            ],
            stream: false
        });

        console.log('Ollama response:', response.data);

        // Check if the response has the expected format
        if (!response.data || !response.data.message || !response.data.message.content) {
            throw new Error('Invalid response format from Ollama');
        }

        // Format the response to match what the frontend expects
        res.json({
            message: response.data.message.content
        });
    } catch (error) {
        console.error('Detailed error:', {
            message: error.message,
            code: error.code,
            response: error.response?.data,
            status: error.response?.status,
            stack: error.stack
        });

        // Send a more detailed error response
        res.status(500).json({
            error: 'Failed to communicate with AI service',
            details: error.message,
            type: error.response ? 'ollama_error' : 'connection_error'
        });
    }
});

//Endpoint to send a pdf to the local Ollama instance for analysis
router.post('/analyze-pdf', upload.single('file'), async (req, res) => {
    const filePath = req.file.path;

    exec(`python analyze_pdf.py ${filePath}`, async (err, stdout, stderr) => {
        fs.unlinkSync(filePath); // Cleanup uploaded file

        if (err) {
            console.error('OCR error:', stderr);
            return res.status(500).json({ error: 'Failed to extract text from drawing' });
        }

        const extractedText = stdout.trim();

        const aiPrompt = `
        You are an intelligent assistant designed to analyze raw OCR text extracted from technical documents such as engineering drawings or manufacturing prints.

        Your task is to extract relevant information such as part identifiers, descriptions, dimensions, surface area, preparation steps (e.g., polishing, grit blasting, masking), plating requirements, and any referenced specifications or standards.

        Only include details that are explicitly stated in the text. If something is not present, indicate "Not provided." Do not infer, assume, or elaborate beyond what is directly mentioned. Keep your response focused and concise. Do not add explanations, commentary, or any other formatting beyond the extracted information.
        """
        ${extractedText}
        """
        `;

        try {
            const availableModels = await checkOllamaConnection();

            const modelToUse = 'deepseek-r1';

            const response = await axios.post('http://localhost:11434/api/chat', {
                model: modelToUse,
                messages: [
                    { role: 'system', content: systemMessage },
                    { role: 'user', content: aiPrompt }
                ],
                stream: false
            });

            if (!response.data?.message?.content) {
                throw new Error('Invalid AI response format');
            }

            res.json({ result: response.data.message.content });
        } catch (error) {
            console.error('AI failure:', error);
            res.status(500).json({
                error: 'Failed to analyze drawing with AI',
                details: error.message
            });
        }
    });
});

module.exports = router; 
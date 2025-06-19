const express = require('express');
const cors = require('cors');
const aiRouter = require('./ai');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ai', aiRouter);

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 

const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const fileService = require('./src/fileService');
const geminiService = require('./src/geminiService');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Get directory path from command line arguments
const args = process.argv.slice(2);
let baseDirectory = '';

if (args.length > 0) {
  baseDirectory = path.resolve(args[0]);
  console.log(`Using directory: ${baseDirectory}`);
} else {
  console.error('Error: No directory specified. Please provide a directory path as a command-line argument.');
  console.log('Example: node app.js /path/to/directory');
  process.exit(1);
}

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

// API Routes
app.get('/api/files', async (req, res) => {
  try {
    const files = await fileService.listFilesRecursively(baseDirectory);
    res.json(files);
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Failed to list files: ' + error.message });
  }
});

app.get('/api/file/:filePath(*)', async (req, res) => {
  try {
    const filePath = req.params.filePath;
    const fullPath = path.join(baseDirectory, filePath);
    const content = await fileService.readFileContent(fullPath);
    res.json({ content });
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Failed to read file: ' + error.message });
  }
});

app.post('/api/gpt4o', async (req, res) => {
  try {
    const { prompt, files } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // Read content for each selected file
    const filesWithContent = await Promise.all(
      files.map(async (file) => {
        const fullPath = path.join(baseDirectory, file.path);
        const content = await fileService.readFileContent(fullPath);
        return { ...file, content };
      })
    );
    
    // Send to GPT-4o
    const response = await geminiService.sendToGPT4o(prompt, filesWithContent);
    res.json({ response });
  } catch (error) {
    console.error('Error processing GPT-4o request:', error);
    res.status(500).json({ error: 'Failed to get response: ' + error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Serving files from: ${baseDirectory}`);
});
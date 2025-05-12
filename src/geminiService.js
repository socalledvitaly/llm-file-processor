require('dotenv').config();
const OpenAI = require('openai');

// Debug: Check if API key is loaded
console.log('API Key present:', process.env.OPENAI_API_KEY ? 'Yes' : 'No');
console.log('API Key starts with:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) + '...' : 'N/A');

// Create OpenAI client with OpenRouter configuration
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1'
  });
} catch (error) {
  console.error('OpenRouter initialization error:', error);
}

/**
 * Send prompt to Gemini 2.5 via OpenRouter
 * @param {string} prompt - User prompt
 * @param {Array} files - Array of {name, content} objects
 * @returns {Promise<string>} - Gemini response
 */
async function sendToGPT4o(prompt, files) {
  if (!openai) {
    throw new Error('OpenRouter client not initialized. Check your API key.');
  }

  try {
    // Format files content with filenames as prefixes
    let fileContents = '';
    files.forEach(file => {
      fileContents += `====================\n`;
      fileContents += `File: ${file.path}\n`;
      fileContents += `====================\n\n`;
      fileContents += `${file.content}\n\n`;
    });

    // Combine user prompt with file contents
    const fullPrompt = `${prompt}

Here are the file contents you requested to include:

${fileContents}`;

    // Make API call to Gemini 2.5 via OpenRouter
    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.5-pro-exp-03-25',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that analyzes files and answers questions about them.' },
        { role: 'user', content: fullPrompt }
      ]
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error sending prompt to Gemini via OpenRouter:', error);
    throw new Error('Failed to get response from Gemini: ' + error.message);
  }
}

module.exports = {
  sendToGPT4o
};
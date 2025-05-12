# LLM File Processor 🤖📁

A powerful web application that demonstrates effective **prompt engineering techniques** by processing multiple files through large language models like Gemini 2.5 via OpenRouter API. This project serves as a comprehensive example of how to structure prompts, manage file context, and build robust AI-powered applications.

## ✨ Features

- 📂 **Interactive File Explorer**: Browse and select multiple files from your filesystem
- 🎯 **Smart Prompt Engineering**: Demonstrates context-aware prompt construction with structured file content integration
- 🔄 **Multiple LLM Support**: Works with Gemini 2.5, GPT-4, Claude, and other models via OpenRouter API
- 🎨 **Clean User Interface**: Intuitive web interface built with vanilla JavaScript and modern CSS
- 📄 **Multi-file Analysis**: Process multiple files simultaneously in a single request
- 🚀 **Real-time Processing**: Live updates as responses stream from the AI model

## 🎓 Learning Objectives (Prompt Engineering Focus)

This project is designed as a learning resource for understanding key concepts in prompt engineering and AI application development:

### 1. Context Window Management
Learn how to effectively include multiple file contents in AI prompts without exceeding token limits:
- Strategic file content truncation
- Priority-based file selection
- Smart context summarization

### 2. Prompt Structure and Formatting
Understand the anatomy of effective prompts:
```
System Role Definition
├── Clear task specification
├── Context boundaries
└── Expected output format

User Prompt
├── Specific question/request
├── Structured file content
│   ├── File separators
│   ├── File metadata
│   └── Content sections
└── Additional instructions
```

### 3. API Integration Patterns
Master the art of working with LLM APIs:
- **OpenRouter as Universal Gateway**: Single API for multiple models
- **Error Handling**: Robust retry mechanisms and graceful degradation
- **Rate Limiting**: Managing API call frequency and batching
- **Response Processing**: Streaming vs batch responses

### 4. State Management in AI Applications
Learn to maintain context across interactions:
- File selection state persistence
- Conversation history management
- Error state handling
- Loading state indicators

## 📋 Prerequisites

Before diving in, ensure you have:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)  
- An **OpenRouter API key** (sign up at [openrouter.ai](https://openrouter.ai))

## 🚀 Quick Start Guide

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/llm-file-processor.git
cd llm-file-processor
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the project root with your OpenRouter API key:

```env
# OpenRouter API Key (required)
OPENAI_API_KEY=sk-or-v1-your-key-here

# Server port (optional, defaults to 3000)
PORT=3000
```

> **Security Note**: Never commit your `.env` file to version control. The `.gitignore` file is configured to exclude it automatically.

### 4. Launch the Application

```bash
npm start /path/to/your/files
```

For example:
```bash
# On Windows
npm start C:\Users\YourName\Documents\Projects

# On macOS/Linux  
npm start /Users/YourName/Documents/Projects
```

### 5. Access the Interface

Open your browser and navigate to `http://localhost:3000`

## 🏗️ Architecture Overview

The application follows a clean separation of concerns:

```
Frontend (Vanilla JS)          Backend (Express.js)
├── File Selection UI    ←→    ├── File System Access
├── Prompt Interface     ←→    ├── Directory Traversal  
├── Response Display     ←→    ├── Content Reading
└── State Management     ←→    └── LLM API Integration
                                        ↓
                                OpenRouter Gateway
                                        ↓
                            Multiple LLM Providers
                            (Gemini, GPT-4, Claude...)
```

### Project Structure

```
llm-file-processor/
├── app.js                 # Express server and API routes
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (local only)
├── .env.example          # Template for environment setup
├── README.md             # Project documentation
├── LICENSE               # MIT License
├── .gitignore           # Git ignore patterns
├── public/              # Frontend assets
│   ├── index.html       # Main HTML interface
│   ├── styles.css       # Styling with modern CSS
│   └── client.js        # Frontend JavaScript
├── src/                 # Backend modules
│   ├── fileService.js   # File operations and directory handling
│   └── geminiService.js # LLM API integration
└── examples/            # Sample files for testing
    ├── code.js         # JavaScript example
    ├── data.txt        # Text file example
    └── config.json     # JSON configuration example
```

## 🔍 How It Works: Prompt Engineering in Action

### 1. File Content Formatting

The application employs a structured approach to include multiple file contents in prompts:

```javascript
// Example of how files are formatted in the prompt
let fileContents = '';
files.forEach(file => {
  fileContents += `====================\n`;
  fileContents += `File: ${file.path}\n`;
  fileContents += `====================\n\n`;
  fileContents += `${file.content}\n\n`;
});
```

This creates clear boundaries between files, making it easier for the LLM to understand the structure:

```
====================
File: src/config.js
====================

const config = {
  apiKey: process.env.API_KEY,
  maxTokens: 4096
};

====================
File: documentation/setup.md
====================

# Setup Guide
Follow these steps to configure...
```

### 2. System Message Design

The application uses carefully crafted system messages to guide the AI's behavior:

```javascript
{
  role: 'system', 
  content: 'You are a helpful assistant that analyzes files and answers questions about them.'
}
```

**Why this works**:
- **Clear role definition**: Establishes the AI's purpose
- **Scope limitation**: Focuses on file analysis
- **Behavior guidance**: Sets expectation for helpful responses

### 3. Prompt Composition Strategy

The final prompt combines user intent with structured context:

```javascript
const fullPrompt = `${prompt}

Here are the file contents you requested to include:

${fileContents}`;
```

This pattern ensures:
- User's question comes first (primary focus)
- Context is clearly labeled
- Structured data follows a predictable format

## 🎯 Example Use Cases

### Code Review Assistant
```
Prompt: "Review these JavaScript files for potential security vulnerabilities and suggest improvements."
Files: src/auth.js, src/api.js, src/validation.js
```

### Documentation Generator  
```
Prompt: "Create comprehensive API documentation based on these route files."
Files: routes/users.js, routes/posts.js, routes/auth.js
```

### Log Analysis
```
Prompt: "Analyze these error logs and identify common patterns or issues."
Files: error.log, access.log, debug.log
```

### Configuration Management
```
Prompt: "Compare these configuration files and highlight the differences."
Files: config/production.json, config/development.json, config/testing.json
```

## 🛠️ Configuration Options

### Changing the AI Model

To switch to a different LLM, modify the model parameter in `src/geminiService.js`:

```javascript
const response = await openai.chat.completions.create({
  model: 'google/gemini-2.5-pro-exp-03-25', // Change this line
  messages: [...]
});
```

**Popular Models Available on OpenRouter**:
- `openai/gpt-4o` - Latest GPT-4 model
- `anthropic/claude-3.5-sonnet` - Claude 3.5 Sonnet
- `google/gemini-2.5-pro-exp-03-25` - Gemini 2.5 Pro
- `meta-llama/llama-3.2-90b-vision-instruct` - Llama 3.2
- `mistralai/mixtral-8x7b-instruct` - Mixtral

### Customizing System Behavior

Edit the system message in `src/geminiService.js` to change how the AI responds:

```javascript
// Example: Specialized code reviewer
{
  role: 'system',
  content: 'You are a senior software engineer reviewing code. Focus on security, performance, and best practices. Provide specific, actionable feedback.'
}

// Example: Document analyzer  
{
  role: 'system',
  content: 'You are a technical writer helping to analyze and summarize documents. Extract key points and create clear, structured summaries.'
}
```

## 📊 Prompt Engineering Best Practices

This project demonstrates several key principles:

### 1. **Be Specific and Clear**
❌ Bad: "Analyze these files"
✅ Good: "Review these JavaScript files for potential security vulnerabilities, focusing on authentication and data validation"

### 2. **Provide Context**
- Include file paths and names
- Explain relationships between files
- Set clear boundaries with separators

### 3. **Structure Your Requests**
```
1. Primary objective
2. Specific areas of focus
3. Expected output format
4. Constraints or limitations
```

### 4. **Use Progressive Enhancement**
Start with a basic prompt, then add:
- Role-specific instructions
- Output format specifications  
- Example outputs
- Edge case handling

## 🧪 Testing Your Own Prompts

1. **Create test files** in the `examples/` directory
2. **Experiment with different prompts**:
   - Try varying the specificity
   - Test different instruction formats
   - Experiment with role definitions
3. **Compare outputs** from different models
4. **Document successful patterns** for reuse

## 📚 Contributing

We welcome contributions! Here's how you can help:

### Setting Up Development Environment

```bash
# Fork the repository
git clone https://github.com/yourusername/llm-file-processor.git
cd llm-file-processor

# Install dependencies
npm install

# Install development tools
npm install --save-dev nodemon

# Run in development mode
npm run dev
```

### Contribution Guidelines

1. **Focus areas we welcome**:
   - Improved prompt engineering examples
   - Support for additional file types
   - UI/UX enhancements
   - Performance optimizations
   - Documentation improvements

2. **Before submitting**:
   - Test with multiple file types
   - Verify different LLM models work
   - Check browser compatibility
   - Update documentation

3. **Pull Request Process**:
   - Create feature branch
   - Make focused, atomic commits
   - Include tests if applicable
   - Update README if needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. Feel free to use this code as a starting point for your own AI projects!

## 🔗 Resources and References

### Prompt Engineering Guides
- [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/claude/docs/prompt-engineering)
- [Google AI Prompt Design Guide](https://ai.google.dev/docs/prompt_best_practices)

### API Documentation
- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Gemini API Reference](https://ai.google.dev/docs)
- [Express.js Documentation](https://expressjs.com/)

### Learning Resources
- [Prompt Engineering Course (DeepLearning.AI)](https://www.coursera.org/learn/prompt-engineering)
- [LangChain Prompt Templates](https://python.langchain.com/docs/modules/model_io/prompts/)

## 🤝 Support and Community

- **Issues**: [GitHub Issues](https://github.com/yourusername/llm-file-processor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/llm-file-processor/discussions)
- **Twitter**: Share your experiments with `#PromptEngineering`

---

**Built with ❤️ by the prompt engineering community**

*Remember: The best prompts are those that clearly communicate intent while providing sufficient context for the AI to deliver accurate, useful responses.*
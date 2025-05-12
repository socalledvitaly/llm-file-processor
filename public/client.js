document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const fileTreeElement = document.getElementById('fileTree');
    const selectedFilesElement = document.getElementById('selectedFiles');
    const promptInputElement = document.getElementById('promptInput');
    const submitButtonElement = document.getElementById('submitButton');
    const responseAreaElement = document.getElementById('responseArea');
    
    // State
    const state = {
      files: [],
      selectedFiles: [],
      isLoading: false
    };
    
    // Initialize the application
    init();
    
    async function init() {
      await fetchFiles();
      renderFileTree();
      setupEventListeners();
    }
    
    // Fetch files from the server
    async function fetchFiles() {
      try {
        fileTreeElement.innerHTML = '<div class="loading">Loading files...</div>';
        
        const response = await fetch('/api/files');
        if (!response.ok) {
          throw new Error(`Failed to fetch files: ${response.statusText}`);
        }
        
        state.files = await response.json();
      } catch (error) {
        console.error('Error fetching files:', error);
        fileTreeElement.innerHTML = `<div class="error">Error loading files: ${error.message}</div>`;
      }
    }
    
    // Render the file tree
    function renderFileTree() {
      if (state.files.length === 0) {
        fileTreeElement.innerHTML = '<div class="no-files">No files found</div>';
        return;
      }
      
      // Group files by directory
      const filesByDirectory = {};
      state.files.forEach(file => {
        const parts = file.path.split('/');
        let currentPath = '';
        
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          currentPath = currentPath ? `${currentPath}/${part}` : part;
          
          if (!filesByDirectory[currentPath]) {
            filesByDirectory[currentPath] = {
              name: part,
              path: currentPath,
              isDirectory: true,
              files: []
            };
          }
        }
        
        const directory = parts.length > 1 ? parts.slice(0, -1).join('/') : '';
        if (!filesByDirectory[directory]) {
          filesByDirectory[directory] = {
            name: directory || 'Root',
            path: directory,
            isDirectory: true,
            files: []
          };
        }
        
        filesByDirectory[directory].files.push(file);
      });
      
      // Create a tree structure
      const rootFiles = [];
      Object.values(filesByDirectory).forEach(dir => {
        if (!dir.path.includes('/')) {
          rootFiles.push(dir);
        }
      });
      
      // Sort root files
      rootFiles.sort((a, b) => a.name.localeCompare(b.name));
      
      // Clear the file tree
      fileTreeElement.innerHTML = '';
      
      // Add root files to the tree
      rootFiles.forEach(dir => {
        const dirElement = createDirectoryElement(dir);
        fileTreeElement.appendChild(dirElement);
      });
      
      // Add files with no directory
      const filesWithNoDir = state.files.filter(file => !file.path.includes('/'));
      filesWithNoDir.sort((a, b) => a.name.localeCompare(b.name));
      
      filesWithNoDir.forEach(file => {
        const fileElement = createFileElement(file);
        fileTreeElement.appendChild(fileElement);
      });
    }
    
    // Create a directory element
    function createDirectoryElement(dir) {
      const dirElement = document.createElement('div');
      dirElement.className = 'directory';
      
      const dirHeader = document.createElement('div');
      dirHeader.className = 'directory-header';
      dirHeader.innerHTML = `<span class="icon">📁</span> ${dir.name}`;
      dirElement.appendChild(dirHeader);
      
      const dirContent = document.createElement('div');
      dirContent.className = 'directory-content';
      dirContent.style.paddingLeft = '20px';
      
      // Sort files by name
      dir.files.sort((a, b) => a.name.localeCompare(b.name));
      
      dir.files.forEach(file => {
        const fileElement = createFileElement(file);
        dirContent.appendChild(fileElement);
      });
      
      dirElement.appendChild(dirContent);
      
      return dirElement;
    }
    
    // Create a file element
    function createFileElement(file) {
      const fileElement = document.createElement('div');
      fileElement.className = 'file-item';
      fileElement.dataset.path = file.path;
      fileElement.dataset.id = file.id;
      
      // Check if the file is selected
      if (state.selectedFiles.some(selectedFile => selectedFile.id === file.id)) {
        fileElement.classList.add('selected');
      }
      
      fileElement.innerHTML = `<span class="icon">📄</span> ${file.name}`;
      
      // Add click event listener
      fileElement.addEventListener('click', () => {
        toggleFileSelection(file, fileElement);
      });
      
      return fileElement;
    }
    
    // Toggle file selection
    function toggleFileSelection(file, element) {
      const isSelected = state.selectedFiles.some(selectedFile => selectedFile.id === file.id);
      
      if (isSelected) {
        // Remove from selected files
        state.selectedFiles = state.selectedFiles.filter(selectedFile => selectedFile.id !== file.id);
        element.classList.remove('selected');
      } else {
        // Add to selected files
        state.selectedFiles.push(file);
        element.classList.add('selected');
      }
      
      renderSelectedFiles();
    }
    
    // Render selected files
    function renderSelectedFiles() {
      if (state.selectedFiles.length === 0) {
        selectedFilesElement.innerHTML = '<p class="no-files">No files selected</p>';
        return;
      }
      
      selectedFilesElement.innerHTML = '';
      
      state.selectedFiles.forEach(file => {
        const fileElement = document.createElement('div');
        fileElement.className = 'selected-file';
        
        fileElement.innerHTML = `
          <span>${file.path}</span>
          <button class="remove-file" data-id="${file.id}">Remove</button>
        `;
        
        selectedFilesElement.appendChild(fileElement);
      });
      
      // Add event listeners to remove buttons
      const removeButtons = document.querySelectorAll('.remove-file');
      removeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
          const fileId = event.target.dataset.id;
          removeSelectedFile(fileId);
        });
      });
    }
    
    // Remove a selected file
    function removeSelectedFile(fileId) {
      state.selectedFiles = state.selectedFiles.filter(file => file.id !== fileId);
      
      // Update file tree selection
      const fileElement = document.querySelector(`.file-item[data-id="${fileId}"]`);
      if (fileElement) {
        fileElement.classList.remove('selected');
      }
      
      renderSelectedFiles();
    }
    
    // Submit to GPT-4o
    async function submitToGPT4o() {
      try {
        const prompt = promptInputElement.value.trim();
        
        if (!prompt) {
          throw new Error('Please enter a prompt');
        }
        
        if (state.selectedFiles.length === 0) {
          throw new Error('Please select at least one file');
        }
        
        // Set loading state
        state.isLoading = true;
        submitButtonElement.disabled = true;
        responseAreaElement.innerHTML = '<div class="loading">Getting response from GPT-4o...</div>';
        
        // Send request to server
        const response = await fetch('/api/gpt4o', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt,
            files: state.selectedFiles
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to get response from GPT-4o');
        }
        
        const data = await response.json();
        
        // Display response
        responseAreaElement.innerHTML = `<div class="response-content">${data.response}</div>`;
      } catch (error) {
        console.error('Error submitting to GPT-4o:', error);
        responseAreaElement.innerHTML = `<div class="error">${error.message}</div>`;
      } finally {
        // Reset loading state
        state.isLoading = false;
        submitButtonElement.disabled = false;
      }
    }
    
    // Setup event listeners
    function setupEventListeners() {
      submitButtonElement.addEventListener('click', submitToGPT4o);
    }
  });
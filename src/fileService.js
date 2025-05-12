const fs = require('fs');
const path = require('path');

/**
 * Recursively list all files in a directory
 * @param {string} dir - The directory to scan
 * @returns {Promise<Array>} - Array of file objects with path and name
 */
async function listFilesRecursively(dir) {
  const files = [];
  
  async function scanDirectory(currentDir, parentPath = '') {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const relativePath = path.join(parentPath, entry.name);
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        await scanDirectory(fullPath, relativePath);
      } else {
        files.push({
          id: relativePath.replace(/\\/g, '/'),
          name: entry.name,
          path: relativePath.replace(/\\/g, '/'),
          fullPath: fullPath
        });
      }
    }
  }
  
  await scanDirectory(dir);
  return files;
}

/**
 * Read file content
 * @param {string} filePath - Path to the file
 * @returns {Promise<string>} - File content
 */
async function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw new Error(`Could not read file ${filePath}`);
  }
}

module.exports = {
  listFilesRecursively,
  readFileContent
};
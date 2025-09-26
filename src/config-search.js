const fs = require('fs');
const path = require('path');

/**
 * Configuration file patterns to search for
 */
const CONFIG_PATTERNS = {
  // Package managers and build tools
  package: ['package.json', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'],
  build: ['webpack.config.js', 'webpack.config.ts', 'vite.config.js', 'vite.config.ts', 'rollup.config.js'],
  typescript: ['tsconfig.json', 'tsconfig.build.json', 'tsconfig.app.json'],
  
  // Environment and configuration
  environment: ['.env', '.env.local', '.env.development', '.env.production', '.env.example'],
  
  // Linting and formatting
  eslint: ['.eslintrc.js', '.eslintrc.json', '.eslintrc', 'eslint.config.js'],
  prettier: ['.prettierrc', '.prettierrc.json', '.prettierrc.js', 'prettier.config.js'],
  
  // Testing
  jest: ['jest.config.js', 'jest.config.json', 'jest.config.ts'],
  
  // Git and CI/CD
  git: ['.gitignore', '.gitattributes'],
  ci: ['.github/workflows/*.yml', '.github/workflows/*.yaml', '.travis.yml', 'circle.yml'],
  
  // Docker
  docker: ['Dockerfile', 'docker-compose.yml', 'docker-compose.yaml', '.dockerignore'],
  
  // Editor configurations
  editor: ['.editorconfig', '.vscode/settings.json', '.vscode/launch.json'],
  
  // Framework specific
  next: ['next.config.js', 'next.config.ts'],
  react: ['.babelrc', '.babelrc.json', 'babel.config.js'],
  vue: ['vue.config.js'],
  
  // Other common configs
  misc: ['README.md', 'LICENSE', 'CHANGELOG.md', '.nvmrc', '.node-version']
};

/**
 * Searches for configuration files in the given directory
 * @param {string} projectPath - Path to the project directory
 * @param {object} options - Search options
 * @returns {object} Object containing found configuration files grouped by category
 */
function searchConfigurationFiles(projectPath = '.', options = {}) {
  const {
    includeSubdirectories = true,
    maxDepth = 3,
    excludePaths = ['node_modules', '.git', 'dist', 'build'],
    categorize = true
  } = options;

  const results = {
    found: [],
    categorized: {},
    summary: {
      total: 0,
      byCategory: {}
    }
  };

  // Initialize categorized results
  if (categorize) {
    Object.keys(CONFIG_PATTERNS).forEach(category => {
      results.categorized[category] = [];
      results.summary.byCategory[category] = 0;
    });
  }

  /**
   * Recursively search for files
   * @param {string} currentPath - Current directory path
   * @param {number} depth - Current search depth
   */
  function searchDirectory(currentPath, depth = 0) {
    if (depth > maxDepth) return;

    try {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        const relativePath = path.relative(projectPath, fullPath);

        // Skip excluded paths (check if path starts with excluded directory or is exactly the excluded path)
        const shouldExclude = excludePaths.some(excluded => {
          const normalizedPath = relativePath.replace(/\\/g, '/');
          const normalizedExcluded = excluded.replace(/\\/g, '/');
          return normalizedPath === normalizedExcluded || 
                 normalizedPath.startsWith(normalizedExcluded + '/');
        });
        
        if (shouldExclude) {
          continue;
        }

        if (entry.isFile()) {
          // Check if file matches any configuration pattern
          const foundCategory = findConfigCategory(entry.name, relativePath);
          if (foundCategory) {
            const fileInfo = {
              name: entry.name,
              path: relativePath,
              fullPath: fullPath,
              category: foundCategory,
              size: fs.statSync(fullPath).size,
              modified: fs.statSync(fullPath).mtime
            };

            results.found.push(fileInfo);
            results.summary.total++;

            if (categorize) {
              results.categorized[foundCategory].push(fileInfo);
              results.summary.byCategory[foundCategory]++;
            }
          }
        } else if (entry.isDirectory() && includeSubdirectories) {
          searchDirectory(fullPath, depth + 1);
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not read directory ${currentPath}: ${error.message}`);
    }
  }

  /**
   * Determines which category a file belongs to
   * @param {string} fileName - Name of the file
   * @param {string} relativePath - Relative path of the file
   * @returns {string|null} Category name or null if not a config file
   */
  function findConfigCategory(fileName, relativePath) {
    for (const [category, patterns] of Object.entries(CONFIG_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.includes('*')) {
          // Handle wildcard patterns
          const regex = new RegExp(pattern.replace(/\*/g, '.*'));
          if (regex.test(relativePath)) {
            return category;
          }
        } else if (fileName === pattern || relativePath === pattern) {
          return category;
        }
      }
    }
    return null;
  }

  // Start the search
  const resolvedPath = path.resolve(projectPath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Project path does not exist: ${resolvedPath}`);
  }

  searchDirectory(resolvedPath);

  return results;
}

/**
 * Formats search results for display
 * @param {object} results - Results from searchConfigurationFiles
 * @param {object} options - Formatting options
 * @returns {string} Formatted results string
 */
function formatResults(results, options = {}) {
  const { showPaths = true, groupByCategory = true, showSummary = true } = options;
  
  let output = '';

  if (showSummary) {
    output += `\n📋 Configuration Files Summary\n`;
    output += `${'='.repeat(35)}\n`;
    output += `Total files found: ${results.summary.total}\n\n`;
  }

  if (groupByCategory && results.categorized) {
    for (const [category, files] of Object.entries(results.categorized)) {
      if (files.length > 0) {
        output += `📁 ${category.toUpperCase()} (${files.length})\n`;
        output += `${'-'.repeat(20)}\n`;
        
        files.forEach(file => {
          output += `  ✓ ${file.name}`;
          if (showPaths) {
            output += ` (${file.path})`;
          }
          output += '\n';
        });
        output += '\n';
      }
    }
  } else {
    output += '📁 ALL CONFIGURATION FILES\n';
    output += `${'-'.repeat(25)}\n`;
    results.found.forEach(file => {
      output += `  ✓ ${file.name}`;
      if (showPaths) {
        output += ` (${file.path})`;
      }
      output += ` [${file.category}]\n`;
    });
  }

  return output;
}

module.exports = {
  searchConfigurationFiles,
  formatResults,
  CONFIG_PATTERNS
};
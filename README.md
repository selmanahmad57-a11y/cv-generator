# CV Generator - Configuration File Search Tool

A powerful tool for discovering and cataloging configuration files in your projects. This tool helps developers quickly identify all configuration files across their codebase, making project setup and maintenance easier.

## Features

- 🔍 **Smart Detection**: Automatically detects 60+ types of configuration files
- 📁 **Categorized Results**: Groups files by type (package management, build tools, linting, etc.)
- 🎯 **Flexible Search**: Configurable search depth and exclusion patterns
- 📊 **Detailed Reports**: Provides file statistics and summaries
- 🖥️ **CLI Interface**: Command-line tool with multiple output formats
- ⚡ **Fast & Lightweight**: Zero dependencies, pure Node.js implementation

## Installation

```bash
# Clone the repository
git clone https://github.com/selmanahmad57-a11y/cv-generator.git
cd cv-generator

# No additional dependencies needed - uses Node.js built-in modules
```

## Usage

### Basic Usage

```bash
# Search current directory
npm start

# Or use the CLI directly
node src/cli.js
```

### CLI Options

```bash
# Search specific directory
node src/cli.js /path/to/your/project

# Shallow search (max depth 1)
node src/cli.js --max-depth 1

# Simple list without categories
node src/cli.js --no-categories

# Compact output without file paths
node src/cli.js --no-paths

# Skip subdirectories
node src/cli.js --no-subdirs
```

### NPM Scripts

```bash
npm run start          # Run main application
npm run search-config  # Run CLI with default options  
npm test              # Run test suite
```

## Supported Configuration Files

The tool recognizes configuration files across multiple categories:

### Package Management & Build Tools
- `package.json`, `yarn.lock`, `pnpm-lock.yaml`
- `webpack.config.js`, `vite.config.js`, `rollup.config.js`

### Language Configuration  
- `tsconfig.json`, `jsconfig.json`
- `.babelrc`, `babel.config.js`

### Code Quality & Formatting
- `.eslintrc.js`, `eslint.config.js`
- `.prettierrc`, `prettier.config.js`

### Testing
- `jest.config.js`, `vitest.config.js`

### Environment & Deployment
- `.env`, `.env.local`, `.env.production`
- `Dockerfile`, `docker-compose.yml`

### Version Control & CI/CD
- `.gitignore`, `.gitattributes`
- `.github/workflows/*.yml`, `.travis.yml`

### Editor & IDE
- `.editorconfig`, `.vscode/settings.json`

...and many more!

## API Usage

You can also use the tool programmatically:

```javascript
const { searchConfigurationFiles, formatResults } = require('./src/config-search');

// Search for config files
const results = searchConfigurationFiles('./my-project', {
  includeSubdirectories: true,
  maxDepth: 3,
  excludePaths: ['node_modules', '.git', 'dist']
});

// Display formatted results
console.log(formatResults(results));

// Access raw results
console.log('Found files:', results.found.length);
console.log('By category:', results.summary.byCategory);
```

## Example Output

```
🔍 Searching for configuration files in: /home/user/my-project

📋 Configuration Files Summary
===================================
Total files found: 8

📁 PACKAGE (2)
--------------------
  ✓ package.json (package.json)
  ✓ package-lock.json (package-lock.json)

📁 TYPESCRIPT (1)  
--------------------
  ✓ tsconfig.json (tsconfig.json)

📁 ESLINT (1)
--------------------
  ✓ .eslintrc.js (.eslintrc.js)

📁 GIT (1)
--------------------
  ✓ .gitignore (.gitignore)

📁 ENVIRONMENT (2)
--------------------
  ✓ .env (.env)
  ✓ .env.example (.env.example)

📁 MISC (1)
--------------------
  ✓ README.md (README.md)

⏱️  Search completed in 5ms
🏆 Top categories: package (2), environment (2), typescript (1)
```

## Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## License

MIT License - see [LICENSE](LICENSE) file for details.
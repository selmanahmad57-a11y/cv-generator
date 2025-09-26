#!/usr/bin/env node

const { searchConfigurationFiles, formatResults } = require('./config-search');
const path = require('path');

/**
 * Command line interface for configuration file search
 */
function main() {
  const args = process.argv.slice(2);
  
  // Parse command line arguments
  let projectPath = '.';
  let options = {
    includeSubdirectories: true,
    maxDepth: 3,
    excludePaths: ['node_modules', '.git', 'dist', 'build'],
    categorize: true
  };
  
  let formatOptions = {
    showPaths: true,
    groupByCategory: true,
    showSummary: true
  };

  // Simple argument parsing
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--path':
      case '-p':
        projectPath = args[i + 1] || '.';
        i++; // Skip next argument as it's the value
        break;
        
      case '--max-depth':
      case '-d':
        options.maxDepth = parseInt(args[i + 1]) || 3;
        i++;
        break;
        
      case '--no-subdirs':
        options.includeSubdirectories = false;
        break;
        
      case '--no-categories':
        options.categorize = false;
        formatOptions.groupByCategory = false;
        break;
        
      case '--no-paths':
        formatOptions.showPaths = false;
        break;
        
      case '--no-summary':
        formatOptions.showSummary = false;
        break;
        
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
        break;
        
      default:
        if (!arg.startsWith('-') && i === 0) {
          projectPath = arg;
        }
        break;
    }
  }

  try {
    console.log(`🔍 Searching for configuration files in: ${path.resolve(projectPath)}\n`);
    
    const startTime = Date.now();
    const results = searchConfigurationFiles(projectPath, options);
    const endTime = Date.now();
    
    if (results.summary.total === 0) {
      console.log('❌ No configuration files found in the specified directory.');
      console.log('\nTip: Make sure you\'re in the right directory or adjust search options.');
    } else {
      console.log(formatResults(results, formatOptions));
      console.log(`⏱️  Search completed in ${endTime - startTime}ms`);
      
      // Show most common categories found
      if (results.summary.total > 0) {
        const topCategories = Object.entries(results.summary.byCategory)
          .filter(([, count]) => count > 0)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([category, count]) => `${category} (${count})`);
        
        if (topCategories.length > 0) {
          console.log(`🏆 Top categories: ${topCategories.join(', ')}`);
        }
      }
    }
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
🔍 Configuration File Search Tool

USAGE:
  node src/cli.js [path] [options]

OPTIONS:
  -p, --path <path>      Project path to search (default: current directory)
  -d, --max-depth <num>  Maximum search depth (default: 3)
  --no-subdirs          Don't search subdirectories
  --no-categories       Don't group results by category
  --no-paths           Don't show file paths
  --no-summary         Don't show summary statistics
  -h, --help           Show this help message

EXAMPLES:
  node src/cli.js                    # Search current directory
  node src/cli.js /path/to/project   # Search specific path
  node src/cli.js --max-depth 1      # Shallow search
  node src/cli.js --no-categories    # Simple list format
  `);
}

// Run the CLI if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = { main, showHelp };
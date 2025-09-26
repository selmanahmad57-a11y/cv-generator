const { searchConfigurationFiles, formatResults } = require('./src/config-search');

/**
 * Main entry point for the CV Generator with configuration search
 */
function main() {
  console.log('🎯 CV Generator - Configuration File Search Tool\n');
  
  try {
    // Search for configuration files in current directory
    const results = searchConfigurationFiles('.');
    
    if (results.summary.total === 0) {
      console.log('❌ No configuration files found in the current directory.');
      console.log('\n💡 This might be a new project. Consider adding:');
      console.log('   • package.json for Node.js projects');
      console.log('   • .env for environment variables');
      console.log('   • .gitignore for version control');
      console.log('   • README.md for documentation');
    } else {
      console.log(formatResults(results));
    }
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = { main };
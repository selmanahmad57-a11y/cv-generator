const { searchConfigurationFiles, CONFIG_PATTERNS } = require('../src/config-search');
const fs = require('fs');
const path = require('path');

/**
 * Simple test suite for configuration file search
 */
function runTests() {
  console.log('🧪 Running Configuration Search Tests\n');
  
  let passed = 0;
  let failed = 0;
  
  function test(description, testFunction) {
    try {
      testFunction();
      console.log(`✅ ${description}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${description}: ${error.message}`);
      failed++;
    }
  }
  
  // Test 1: Basic functionality
  test('Should search current directory without errors', () => {
    const results = searchConfigurationFiles('.');
    if (typeof results !== 'object') {
      throw new Error('Results should be an object');
    }
    if (!Array.isArray(results.found)) {
      throw new Error('Results should have a found array');
    }
  });
  
  // Test 2: Should find known files
  test('Should find package.json and .gitignore', () => {
    const results = searchConfigurationFiles('.');
    const foundFiles = results.found.map(f => f.name);
    
    if (!foundFiles.includes('package.json')) {
      throw new Error('Should find package.json');
    }
    if (!foundFiles.includes('.gitignore')) {
      throw new Error('Should find .gitignore');
    }
  });
  
  // Test 3: Categorization
  test('Should properly categorize files', () => {
    const results = searchConfigurationFiles('.');
    const packageFile = results.found.find(f => f.name === 'package.json');
    const gitignoreFile = results.found.find(f => f.name === '.gitignore');
    
    if (packageFile && packageFile.category !== 'package') {
      throw new Error('package.json should be categorized as "package"');
    }
    if (gitignoreFile && gitignoreFile.category !== 'git') {
      throw new Error('.gitignore should be categorized as "git"');
    }
  });
  
  // Test 4: Options handling
  test('Should respect maxDepth option', () => {
    const resultsShallow = searchConfigurationFiles('.', { maxDepth: 0 });
    const resultsDeep = searchConfigurationFiles('.', { maxDepth: 3 });
    
    // With maxDepth 0, should only search root directory
    if (resultsShallow.found.length > resultsDeep.found.length) {
      throw new Error('Shallow search should not find more files than deep search');
    }
  });
  
  // Test 5: CONFIG_PATTERNS structure
  test('CONFIG_PATTERNS should be properly structured', () => {
    if (typeof CONFIG_PATTERNS !== 'object') {
      throw new Error('CONFIG_PATTERNS should be an object');
    }
    
    const requiredCategories = ['package', 'git', 'environment', 'eslint'];
    for (const category of requiredCategories) {
      if (!CONFIG_PATTERNS[category] || !Array.isArray(CONFIG_PATTERNS[category])) {
        throw new Error(`CONFIG_PATTERNS should have ${category} as an array`);
      }
    }
  });
  
  // Test 6: Error handling
  test('Should handle non-existent directory gracefully', () => {
    try {
      searchConfigurationFiles('/nonexistent/directory');
      throw new Error('Should have thrown an error for non-existent directory');
    } catch (error) {
      if (!error.message.includes('does not exist')) {
        throw new Error('Should throw appropriate error for non-existent directory');
      }
    }
  });
  
  // Summary
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed!');
    return true;
  } else {
    console.log('❌ Some tests failed.');
    return false;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const success = runTests();
  process.exit(success ? 0 : 1);
}

module.exports = { runTests };
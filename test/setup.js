// Add process polyfill for tests
global.process = {
  env: {
    NODE_ENV: 'test'
  }
}; 
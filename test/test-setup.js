// Polyfill for process
window.process = {
  env: {
    NODE_ENV: 'test'
  }
};

// Polyfill for immer's process check
if (typeof process === 'undefined') {
  global.process = window.process;
} 
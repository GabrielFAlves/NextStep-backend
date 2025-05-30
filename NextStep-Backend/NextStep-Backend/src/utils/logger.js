const logger = {
  info: (message, meta) => {
    console.log(`${message}`, meta || '');
  },
  
  error: (message, meta) => {
    console.error(`${message}`, meta || '');
  },
  
  warn: (message, meta) => {
    console.warn(`${message}`, meta || '');
  }
};

module.exports = logger;
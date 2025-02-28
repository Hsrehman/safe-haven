const logger = {
  dev: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [Dev]`, ...args);
    }
  },
  
  error: (error, context = '') => {
    const errorData = {
      message: error.message,
      context,
      timestamp: new Date().toISOString(),
      path: error.stack?.split('\n')[1]?.trim() || 'Unknown',
      code: error.code || 'UNKNOWN_ERROR'
    };

    if (process.env.NODE_ENV === 'production') {
      
      console.error(sanitizeData(errorData));
    } else {
      console.error(`[${errorData.timestamp}] [Error] [${context}]`, errorData);
    }
  },
  
  performance: (label, duration) => {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [Performance] ${label}:`, {
        duration: `${duration.toFixed(2)}ms`,
      });
    }
  },

  security: (event, data = {}) => {
    const logData = {
      event,
      timestamp: new Date().toISOString(),
      ...sanitizeData(data)
    };
    
    if (process.env.NODE_ENV === 'production') {
      
      console.warn(`[Security] ${event}`, logData);
    } else {
      console.warn(`[${logData.timestamp}] [Security] ${event}`, logData);
    }
  }
};

export default logger; 
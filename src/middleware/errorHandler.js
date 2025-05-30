const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Erro capturado:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  if (err.message.includes('autenticação')) {
    return res.status(401).json({
      success: false,
      error: 'Erro de autenticação com API externa'
    });
  }

  if (err.message.includes('limite') || err.message.includes('quota')) {
    return res.status(429).json({
      success: false,
      error: 'Limite de uso atingido. Tente novamente mais tarde.'
    });
  }

  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;
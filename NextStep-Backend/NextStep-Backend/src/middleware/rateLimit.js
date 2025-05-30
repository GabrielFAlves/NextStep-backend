const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX) || 20,
  message: {
    success: false,
    error: 'Muitas requisições. Tente novamente em 15 minutos.',
    retryAfter: Math.ceil((15 * 60 * 1000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Limite de requisições atingido',
      message: 'Tente novamente em 15 minutos',
      retryAfter: Math.ceil((15 * 60 * 1000) / 1000)
    });
  }
});

module.exports = limiter;
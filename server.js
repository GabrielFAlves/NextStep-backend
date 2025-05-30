require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const startServer = () => {
  try {
    const server = app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`);
      logger.info(`Ambiente: ${NODE_ENV}`);
      logger.info(`Gemini AI integrado`);
    });

    process.on('SIGTERM', () => {
      logger.info('SIGTERM recebido. Encerrando servidor...');
      server.close(() => {
        logger.info('Servidor encerrado.');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();
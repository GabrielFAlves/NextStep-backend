const elevenlabsService = require('../services/elevenlabsService');
const logger = require('../utils/logger');

class AudioController {
  async generateAudio(req, res, next) {
    try {
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({
          success: false,
          error: 'O texto é obrigatório'
        });
      }

      logger.info('Iniciando geração de áudio', {
        textLength: text.length
      });

      const audioBuffer = await elevenlabsService.generateAudio(text);

      // Configurar cabeçalhos para download do arquivo de áudio
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="audio.mp3"'
      });

      // Enviar o buffer de áudio como resposta
      res.send(audioBuffer);

    } catch (error) {
      logger.error('Erro na geração de áudio:', error);
      next(error);
    }
  }
}

module.exports = new AudioController();
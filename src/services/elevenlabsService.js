const axios = require('axios');
const logger = require('../utils/logger');

class ElevenLabsService {
  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY;
    this.voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // Voz padrão "Rachel"
    this.baseUrl = 'https://api.elevenlabs.io/v1';
  }

  async generateAudio(text) {
    try {
      logger.info('Iniciando geração de áudio com ElevenLabs');

      if (!this.apiKey) {
        throw new Error('ELEVENLABS_API_KEY não está configurada no arquivo .env');
      }

      const response = await axios.post(
        `${this.baseUrl}/text-to-speech/${this.voiceId}`,
        {
          text: text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.3,
            similarity_boost: 0.8
          }
        },
        {
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg'
          },
          responseType: 'arraybuffer'
        }
      );

      logger.info('Áudio gerado com sucesso');
      return response.data;
    } catch (error) {
      logger.error('Erro ao gerar áudio:', error.response?.data || error.message);

      if (error.message.includes('API_KEY')) {
        throw new Error('Erro de autenticação com a API do ElevenLabs');
      }

      throw new Error('Erro ao gerar áudio');
    }
  }
}

module.exports = new ElevenLabsService();
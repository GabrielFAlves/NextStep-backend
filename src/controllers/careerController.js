const careerService = require('../services/geminiService');
const logger = require('../utils/logger');

class CareerController {
  async analyzeCareer(req, res, next) {
    try {
      logger.info('Iniciando análise de carreira', { 
        profile: { 
          genero: req.body.genero, 
          idade: req.body.idade, 
          area: req.body.area_graduacao 
        }
      });

      const resultado = await careerService.analisarCarreira(req.body);

      logger.info('Análise concluída com sucesso');

      res.json({
        success: true,
        data: resultado,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Erro na análise de carreira:', error);
      next(error);
    }
  }
}

module.exports = new CareerController();
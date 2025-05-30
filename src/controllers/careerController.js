const careerService = require('../services/geminiService');
const logger = require('../utils/logger');

class CareerController {
  async analyzeCareer(req, res, next) {
    try {
      // Log mais detalhado com os novos campos
      logger.info('Iniciando análise de carreira', { 
        profile: { 
          genero: req.body.genero, 
          idade: req.body.idade, 
          area: req.body.area_graduacao,
          ano_conclusao: req.body.ano_conclusao,
          preferencia_ambiente: req.body.preferencia_ambiente,
          // Não logar skills completas por serem muito longas
          has_hard_skills: !!req.body.hard_skills,
          has_soft_skills: !!req.body.soft_skills,
          has_interesses: !!req.body.interesses
        }
      });

      const resultado = await careerService.analisarCarreira(req.body);

      // Log do resultado (sem dados sensíveis)
      logger.info('Análise concluída com sucesso', {
        roadmap_steps: resultado.roadmap?.length || 0,
        next_steps: resultado.nextSteps?.length || 0,
        soft_skills: resultado.softSkills?.length || 0,
        challenges: resultado.potentialChallenges?.length || 0
      });

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
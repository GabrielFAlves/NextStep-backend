const geminiConfig = require('../config/gemini');
const logger = require('../utils/logger');

class GeminiService {
  constructor() {
    this.model = geminiConfig.getModel();
  }

  criarPrompt(dados) {
    const { genero, idade, area_graduacao, ano_conclusao, interesses, preferencia_ambiente, is_tech_area } = dados;

    // Prompt base para qualquer área
    let prompt = `
Considere que você é um mentor de carreira sênior, altamente experiente e empático, especializado em orientar jovens profissionais com conselhos personalizados, baseados nas últimas tendências de mercado, desenvolvimento pessoal e competências comportamentais.

Um(a) ${genero} de ${idade} anos está atualmente cursando uma graduação na área de ${area_graduacao}, com previsão de conclusão em ${ano_conclusao}. Esta pessoa busca orientações claras e práticas sobre possíveis trajetórias de carreira que estejam alinhadas com suas preferências, valores e estilo de vida.

Ela tem interesse nas seguintes áreas: ${interesses} e demonstra preferência por um ambiente de trabalho caracterizado como ${preferencia_ambiente}.

Sua missão é:
1. Analisar esse perfil de forma crítica, estratégica e empática.
2. Sugerir caminhos profissionais que maximizem as potencialidades e os interesses deste perfil.
3. Elaborar uma narrativa inspiradora e motivacional, destacando pontos fortes e possíveis desafios dessa trajetória.
4. Identificar e listar:
   - As competências técnicas/profissionais recomendadas para esse caminho.
   - Os próximos passos práticos que essa pessoa pode realizar imediatamente.
   - As soft skills necessárias para ter sucesso nessa trajetória.
   - Os potenciais desafios ou obstáculos que ela pode encontrar.
   - Uma frase inspiradora que motive essa pessoa a seguir esse caminho.`;

    // Se for área de tecnologia, adicionar roadmaps
    if (is_tech_area) {
      prompt += `
5. Escolher, entre as opções abaixo, o roadmap mais adequado para esse caso:

ROADMAP-LIST:
• Frontend Development - https://roadmap.sh/frontend
• Backend Development - https://roadmap.sh/backend
• Android Development - https://roadmap.sh/android
• DevOps - https://roadmap.sh/devops
• Data Science - https://roadmap.sh/data-science

RESPONSE-INSTRUCTIONS:
Gere uma resposta APENAS no seguinte formato JSON válido, sem texto adicional:
{
    "titulo": "Título impactante que resuma o caminho sugerido",
    "texto": "Um parágrafo breve, combinando explicação técnica e motivacional, sobre por que esse é um bom caminho para o perfil apresentado.",
    "roadmap": "O link para o roadmap escolhido",
    "competencias_recomendadas": ["competência 1", "competência 2", "competência 3"],
    "proximos_passos": ["passo 1", "passo 2", "passo 3"],
    "soft_skills_necessarias": ["soft skill 1", "soft skill 2", "soft skill 3"],
    "potenciais_desafios": ["desafio 1", "desafio 2", "desafio 3"],
    "frase_inspiradora": "Uma frase motivacional e inspiradora"
}`;
    } else {
      // Para áreas não-tecnológicas, sem roadmap
      prompt += `

RESPONSE-INSTRUCTIONS:
Gere uma resposta APENAS no seguinte formato JSON válido, sem texto adicional:
{
    "titulo": "Título impactante que resuma o caminho sugerido",
    "texto": "Um parágrafo breve, combinando explicação técnica e motivacional, sobre por que esse é um bom caminho para o perfil apresentado.",
    "competencias_recomendadas": ["competência 1", "competência 2", "competência 3"],
    "proximos_passos": ["passo 1", "passo 2", "passo 3"],
    "soft_skills_necessarias": ["soft skill 1", "soft skill 2", "soft skill 3"],
    "potenciais_desafios": ["desafio 1", "desafio 2", "desafio 3"],
    "frase_inspiradora": "Uma frase motivacional e inspiradora"
}`;
    }

    return prompt;
  }

  async analisarCarreira(dados) {
    try {
      const prompt = this.criarPrompt(dados);
      
      logger.info('Enviando prompt para Gemini...');
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      logger.info('Resposta recebida do Gemini');

      // Tentar extrair JSON da resposta
      let jsonResponse;
      try {
        // Procurar por JSON na resposta
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonResponse = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('JSON não encontrado na resposta');
        }
      } catch (parseError) {
        logger.error('Erro ao parsear JSON:', parseError);
        logger.info('Resposta original do Gemini:', text);
        
        // Fallback: resposta estruturada manual
        const fallbackResponse = {
          titulo: "Análise de Carreira Personalizada",
          texto: "Com base no seu perfil, identificamos oportunidades promissoras que combinam com seus interesses e habilidades. O mercado atual oferece excelentes perspectivas para profissionais qualificados em sua área.",
          competencias_recomendadas: ["Conhecimento técnico específico", "Análise crítica", "Resolução de problemas"],
          proximos_passos: ["Definir área de especialização", "Buscar cursos complementares", "Desenvolver projetos práticos"],
          soft_skills_necessarias: ["Comunicação", "Trabalho em equipe", "Adaptabilidade"],
          potenciais_desafios: ["Mercado competitivo", "Necessidade de atualização constante", "Equilibrar teoria e prática"],
          frase_inspiradora: "Sua jornada profissional é única - construa-a com propósito e determinação!"
        };

        // Só adiciona roadmap se for área tech
        if (dados.is_tech_area) {
          fallbackResponse.roadmap = "https://roadmap.sh/backend";
        }

        jsonResponse = fallbackResponse;
      }

      // Validar estrutura da resposta
      const camposObrigatorios = [
        'titulo', 'texto', 'competencias_recomendadas',
        'proximos_passos', 'soft_skills_necessarias', 'potenciais_desafios', 'frase_inspiradora'
      ];

      // Só valida roadmap se for área tech
      if (dados.is_tech_area) {
        camposObrigatorios.push('roadmap');
      }

      for (const campo of camposObrigatorios) {
        if (!jsonResponse[campo]) {
          logger.warn(`Campo ausente na resposta: ${campo}`);
        }
      }

      return jsonResponse;

    } catch (error) {
      logger.error('Erro no GeminiService:', error);
      
      if (error.message.includes('API_KEY')) {
        throw new Error('Erro de autenticação com a API do Gemini');
      }
      
      if (error.message.includes('quota')) {
        throw new Error('Limite de uso da API do Gemini atingido');
      }
      
      throw new Error('Erro ao processar análise de carreira');
    }
  }
}

module.exports = new GeminiService();
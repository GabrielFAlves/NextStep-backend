const geminiConfig = require('../config/gemini');
const logger = require('../utils/logger');

class GeminiService {
  constructor() {
    this.model = geminiConfig.getModel();
  }

  criarPrompt(dados) {
    const {
      genero,
      idade,
      area_graduacao,
      ano_conclusao,
      interesses,
      preferencia_ambiente,
      hard_skills,
      soft_skills
    } = dados;

    const prompt = `
Considere que você é um mentor de carreira sênior, altamente experiente e empático, especializado em orientar jovens profissionais com conselhos personalizados, baseados nas últimas tendências de mercado, desenvolvimento pessoal e competências comportamentais.

Você está orientando um(a) jovem de ${idade} anos, do gênero ${genero}, atualmente cursando a graduação em ${area_graduacao}, com previsão de conclusão em ${ano_conclusao}. Essa pessoa possui interesse nas áreas de ${interesses}, e prefere atuar em um ambiente de trabalho ${preferencia_ambiente}.

Ela possui as seguintes hard skills: ${hard_skills}, e soft skills: ${soft_skills}.

Sua missão é:
1. Analisar esse perfil de forma crítica, estratégica e empática.
2. Sugerir um caminho profissional que maximize as potencialidades e os interesses dessa pessoa.
3. Escolher, entre as opções abaixo, o roadmap mais adequado para esse caso.
4. Elaborar uma narrativa inspiradora e motivacional, destacando pontos fortes e possíveis desafios desse caminho.
5. Retornar somente um JSON no formato abaixo, com as seguintes regras:

**REGRAS IMPORTANTES:**
- Os campos \`title\`, \`introduction\` e \`inspirationalQuote\` devem conter **apenas uma entrada** cada.
- Os campos \`roadmap\`, \`nextSteps\`, \`softSkills\`, \`potentialChallenges\` devem conter **quantos itens forem relevantes**, usando a criatividade. Não limite a 2.
- No campo \`roadmap\`, **os dois primeiros itens devem ter \`"completed": true\`**, os demais podem ser \`false\`.
- Todas as etapas devem utilizar períodos relativos (ex: “0–3 meses”, “6–12 meses”) e não devem conter datas fixas ou anos absolutos. O plano precisa parecer atual e atemporal, independentemente da data de uso.

RESPONSE FORMAT:
{
  "title": "Título impactante que resuma o caminho sugerido",
  "introduction": "Parágrafo explicativo e motivacional, conectando o perfil da pessoa ao caminho sugerido.",
  "roadmap": [
    {
      "title": "Etapa 1",
      "description": "Descrição da etapa",
      "timeframe": "Tempo estimado",
      "completed": true
    },
    {
      "title": "Etapa 2",
      "description": "Descrição da etapa",
      "timeframe": "Tempo estimado",
      "completed": true
    },
    {
      "title": "Etapa 3",
      "description": "Descrição da etapa",
      "timeframe": "Tempo estimado",
      "completed": false
    }
  ],
  "nextSteps": [
    "Passo prático 1",
    "Passo prático 2",
    "Passo prático 3"
  ],
  "softSkills": [
    "Soft skill 1",
    "Soft skill 2",
    "Soft skill 3"
  ],
  "potentialChallenges": [
    "Desafio 1",
    "Desafio 2",
    "Desafio 3"
  ],
  "inspirationalQuote": {
    "text": "Frase inspiradora",
    "author": "Nome do autor"
  }
}`;

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

        // Fallback: resposta estruturada manual com novo formato
        jsonResponse = this.criarRespostaFallback(dados);
      }

      // Validar e garantir estrutura correta da resposta
      jsonResponse = this.validarEstrutura(jsonResponse);

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

  criarRespostaFallback(dados) {
    const { area_graduacao, interesses } = dados;

    return {
      title: `Carreira em ${area_graduacao}: Seu Caminho para o Sucesso`,
      introduction: `Com base no seu perfil e interesses em ${interesses}, identificamos um caminho promissor que combina suas habilidades técnicas com as demandas do mercado atual. Sua trajetória em ${area_graduacao} oferece excelentes oportunidades de crescimento e realização profissional.`,
      roadmap: [
        {
          title: "Fundamentos Acadêmicos",
          description: "Conclusão da graduação com foco nas disciplinas core",
          timeframe: "Até a formatura",
          completed: true
        },
        {
          title: "Desenvolvimento de Projetos Práticos",
          description: "Criação de portfólio com projetos relevantes para a área",
          timeframe: "6-12 meses",
          completed: true
        },
        {
          title: "Especialização Técnica",
          description: "Aprofundamento nas tecnologias e metodologias mais demandadas",
          timeframe: "1-2 anos",
          completed: false
        },
        {
          title: "Experiência Profissional",
          description: "Estágios, freelances ou primeiro emprego na área",
          timeframe: "1-2 anos",
          completed: false
        },
        {
          title: "Desenvolvimento de Liderança",
          description: "Crescimento para posições de maior responsabilidade",
          timeframe: "3-5 anos",
          completed: false
        }
      ],
      nextSteps: [
        "Finalizar projetos acadêmicos pendentes",
        "Criar ou atualizar perfil no LinkedIn",
        "Desenvolver um projeto prático para o portfólio",
        "Participar de eventos e networking da área",
        "Buscar oportunidades de estágio ou trainee"
      ],
      softSkills: [
        "Comunicação eficaz",
        "Trabalho em equipe",
        "Pensamento crítico",
        "Adaptabilidade",
        "Gestão de tempo",
        "Liderança"
      ],
      potentialChallenges: [
        "Mercado competitivo com muitos candidatos qualificados",
        "Necessidade de atualização constante das habilidades técnicas",
        "Equilibrar vida acadêmica com desenvolvimento profissional",
        "Construir uma rede de contatos profissionais",
        "Transição da vida acadêmica para o mercado de trabalho"
      ],
      inspirationalQuote: {
        text: "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
        author: "Robert Collier"
      }
    };
  }

  validarEstrutura(resposta) {
    // Garantir que todos os campos obrigatórios existam
    const estruturaBase = {
      title: resposta.title || "Carreira Personalizada",
      introduction: resposta.introduction || "Análise personalizada da sua trajetória profissional.",
      roadmap: Array.isArray(resposta.roadmap) ? resposta.roadmap : [],
      nextSteps: Array.isArray(resposta.nextSteps) ? resposta.nextSteps : [],
      softSkills: Array.isArray(resposta.softSkills) ? resposta.softSkills : [],
      potentialChallenges: Array.isArray(resposta.potentialChallenges) ? resposta.potentialChallenges : [],
      inspirationalQuote: resposta.inspirationalQuote || {
        text: "Sua jornada profissional é única - construa-a com propósito e determinação!",
        author: "Mentor de Carreira"
      }
    };

    // Validar estrutura do roadmap
    if (estruturaBase.roadmap.length > 0) {
      estruturaBase.roadmap = estruturaBase.roadmap.map((item, index) => ({
        title: item.title || `Etapa ${index + 1}`,
        description: item.description || "Descrição da etapa",
        timeframe: item.timeframe || "A definir",
        completed: index < 2 ? true : (item.completed || false) // Primeiras duas etapas sempre completed: true
      }));
    }

    // Validar estrutura da citação inspiradora
    if (typeof estruturaBase.inspirationalQuote === 'string') {
      estruturaBase.inspirationalQuote = {
        text: estruturaBase.inspirationalQuote,
        author: "Autor Desconhecido"
      };
    }

    return estruturaBase;
  }
}

module.exports = new GeminiService();
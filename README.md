# NextStep Backend

Backend para mentoria profissional com Gemini AI e geração de áudio com ElevenLabs.

## Funcionalidades

- Análise de carreira com Gemini AI
- Geração de áudio com ElevenLabs

## Requisitos

- Node.js 14+
- NPM ou Yarn

## Configuração

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
PORT=3000
GEMINI_API_KEY=sua_chave_api_gemini
ELEVENLABS_API_KEY=sua_chave_api_elevenlabs
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM  # Opcional, voz padrão "Rachel"
FRONTEND_URL=http://localhost:3001
RATE_LIMIT_MAX=20
```

## Executando o projeto

```
npm run dev
```

## Endpoints

### Análise de Carreira

```
POST /api/analyze
```

Corpo da requisição:

```json
{
  "genero": "masculino",
  "idade": 25,
  "area_graduacao": "Ciência da Computação",
  "ano_conclusao": 2025,
  "interesses": "Desenvolvimento web, inteligência artificial",
  "preferencia_ambiente": "remoto e colaborativo",
  "hard_skills": "JavaScript, Python, React, Node.js",
  "soft_skills": "Comunicação, trabalho em equipe, resolução de problemas"
}
```

### Geração de Áudio

```
POST /api/generate-audio
```

Corpo da requisição:

```json
{
  "text": "Texto que será convertido em áudio"
}
```

Resposta: Arquivo de áudio MP3

## Licença

MIT
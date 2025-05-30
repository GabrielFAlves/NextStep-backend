const Joi = require('joi');

const careerSchema = Joi.object({
  genero: Joi.string()
    .valid('masculino', 'feminino', 'outro', 'prefiro_nao_informar')
    .required()
    .messages({
      'any.required': 'Gênero é obrigatório',
      'any.only': 'Gênero deve ser: masculino, feminino, outro ou prefiro_nao_informar'
    }),
  
  idade: Joi.number()
    .integer()
    .min(16)
    .max(100)
    .required()
    .messages({
      'number.base': 'Idade deve ser um número',
      'number.min': 'Idade mínima é 16 anos',
      'number.max': 'Idade máxima é 100 anos',
      'any.required': 'Idade é obrigatória'
    }),
  
  area_graduacao: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Área de graduação deve ter pelo menos 2 caracteres',
      'string.max': 'Área de graduação deve ter no máximo 100 caracteres',
      'any.required': 'Área de graduação é obrigatória'
    }),
  
  ano_conclusao: Joi.number()
    .integer()
    .min(2024)
    .max(2035)
    .required()
    .messages({
      'number.min': 'Ano de conclusão deve ser a partir de 2024',
      'number.max': 'Ano de conclusão deve ser até 2035',
      'any.required': 'Ano de conclusão é obrigatório'
    }),
  
  interesses: Joi.string()
    .min(5)
    .max(500)
    .required()
    .messages({
      'string.min': 'Interesses devem ter pelo menos 5 caracteres',
      'string.max': 'Interesses devem ter no máximo 500 caracteres',
      'any.required': 'Interesses são obrigatórios'
    }),
  
  preferencia_ambiente: Joi.string()
    .valid(
      'presencial e colaborativo',
      'remoto e independente', 
      'remoto e colaborativo',
      'híbrido e flexível',
      'presencial e individual'
    )
    .required()
    .messages({
      'any.required': 'Preferência de ambiente é obrigatória',
      'any.only': 'Preferência de ambiente deve ser uma das opções válidas'
    }),

  hard_skills: Joi.string()
    .min(3)
    .max(1000)
    .required()
    .messages({
      'string.min': 'Hard skills devem ter pelo menos 3 caracteres',
      'string.max': 'Hard skills devem ter no máximo 1000 caracteres',
      'any.required': 'Hard skills são obrigatórias'
    }),

  soft_skills: Joi.string()
    .min(3)
    .max(1000)
    .required()
    .messages({
      'string.min': 'Soft skills devem ter pelo menos 3 caracteres',
      'string.max': 'Soft skills devem ter no máximo 1000 caracteres',
      'any.required': 'Soft skills são obrigatórias'
    })
});

const validateCareerRequest = (req, res, next) => {
  const { error } = careerSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Dados inválidos',
      details: error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }))
    });
  }
  
  next();
};

module.exports = {
  validateCareerRequest
};
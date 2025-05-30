const Joi = require('joi');

const careerSchema = Joi.object({
  genero: Joi.string()
    .valid('homem', 'mulher', 'não-binário', 'prefiro não informar')
    .required()
    .messages({
      'any.required': 'Gênero é obrigatório',
      'any.only': 'Gênero deve ser: homem, mulher, não-binário ou prefiro não informar'
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
    .min(5)
    .max(300)
    .required()
    .messages({
      'string.min': 'Preferência de ambiente deve ter pelo menos 5 caracteres',
      'string.max': 'Preferência de ambiente deve ter no máximo 300 caracteres',
      'any.required': 'Preferência de ambiente é obrigatória'
    }),

  is_tech_area: Joi.boolean()
    .required()
    .messages({
      'boolean.base': 'is_tech_area deve ser true ou false',
      'any.required': 'is_tech_area é obrigatório'
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
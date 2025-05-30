const Joi = require('joi');

const audioSchema = Joi.object({
  text: Joi.string()
    .min(1)
    .max(5000)
    .required()
    .messages({
      'string.empty': 'O texto não pode estar vazio',
      'string.min': 'O texto deve ter pelo menos 1 caractere',
      'string.max': 'O texto deve ter no máximo 5000 caracteres'
    })
});

const validateAudioRequest = (req, res, next) => {
  const { error } = audioSchema.validate(req.body, { abortEarly: false });

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
  validateAudioRequest
};
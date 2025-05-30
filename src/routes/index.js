const express = require('express');
const careerController = require('../controllers/careerController');
const { validateCareerRequest } = require('../middleware/validation');
const rateLimit = require('../middleware/rateLimit');

const router = express.Router();

router.post('/analyze', rateLimit, validateCareerRequest, careerController.analyzeCareer);

module.exports = router;
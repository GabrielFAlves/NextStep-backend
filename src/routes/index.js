const express = require('express');
const careerController = require('../controllers/careerController');
const audioController = require('../controllers/audioController');
const { validateCareerRequest } = require('../middleware/validation');
const { validateAudioRequest } = require('../middleware/audioValidation');
const rateLimit = require('../middleware/rateLimit');

const router = express.Router();

router.post('/analyze', rateLimit, validateCareerRequest, careerController.analyzeCareer);
router.post('/generate-audio', rateLimit, validateAudioRequest, audioController.generateAudio);

module.exports = router;
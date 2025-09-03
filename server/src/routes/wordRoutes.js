const express = require('express');
const router = express.Router();
const wordController = require('../controllers/wordController');

// Routes pour les mots
router.get('/', wordController.getAllWords);
router.get('/root/:root', wordController.getWordsByRoot);
router.get('/root/:root/context', wordController.getWordOccurrencesWithContext);

module.exports = router;

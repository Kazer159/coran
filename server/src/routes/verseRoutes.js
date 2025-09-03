const express = require('express');
const router = express.Router();
const verseController = require('../controllers/verseController');

// Routes pour les versets
router.get('/', verseController.getAllVerses);
router.get('/search', verseController.searchVerses);
router.get('/sura/:suraNumber', verseController.getVersesBySura);
router.get('/sura/:suraNumber/aya/:ayaNumber', verseController.getVerseByAya);

module.exports = router;

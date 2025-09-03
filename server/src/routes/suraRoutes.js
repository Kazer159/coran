const express = require('express');
const router = express.Router();
const suraController = require('../controllers/suraController');

// Routes pour les sourates
router.get('/', suraController.getAllSuras);
router.get('/revelation-order', suraController.getSurasByRevelationOrder);
router.get('/revelation-place/:place', suraController.getSurasByRevelationPlace);
router.get('/:number', suraController.getSuraByNumber);

module.exports = router;

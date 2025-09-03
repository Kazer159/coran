const Sura = require('../models/Sura');

// Récupérer toutes les sourates
exports.getAllSuras = async (req, res) => {
  try {
    const suras = await Sura.find().sort({ number: 1 });
    res.status(200).json(suras);
  } catch (error) {
    console.error('Erreur lors de la récupération des sourates:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer une sourate par son numéro
exports.getSuraByNumber = async (req, res) => {
  try {
    const { number } = req.params;
    const sura = await Sura.findOne({ number: parseInt(number) });
    
    if (!sura) {
      return res.status(404).json({ message: 'Sourate non trouvée' });
    }
    
    res.status(200).json(sura);
  } catch (error) {
    console.error(`Erreur lors de la récupération de la sourate ${req.params.number}:`, error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer les sourates par lieu de révélation
exports.getSurasByRevelationPlace = async (req, res) => {
  try {
    const { place } = req.params;
    const suras = await Sura.find({ 
      revelationPlace: { $regex: new RegExp(place, 'i') } 
    }).sort({ number: 1 });
    
    res.status(200).json(suras);
  } catch (error) {
    console.error(`Erreur lors de la récupération des sourates de ${req.params.place}:`, error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer les sourates triées par ordre de révélation
exports.getSurasByRevelationOrder = async (req, res) => {
  try {
    const suras = await Sura.find().sort({ revelationOrder: 1 });
    res.status(200).json(suras);
  } catch (error) {
    console.error('Erreur lors de la récupération des sourates par ordre de révélation:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

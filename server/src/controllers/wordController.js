const Word = require('../models/Word');
const Verse = require('../models/Verse');

// Récupérer tous les mots (avec pagination)
exports.getAllWords = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const words = await Word.find()
      .sort({ sura: 1, aya: 1, pos: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const count = await Word.countDocuments();
    
    res.status(200).json({
      words,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des mots:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Rechercher les mots par racine
exports.getWordsByRoot = async (req, res) => {
  try {
    const { root } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const words = await Word.find({ 
      root: { $regex: new RegExp(root, 'i') } 
    })
    .sort({ sura: 1, aya: 1, pos: 1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));
    
    const count = await Word.countDocuments({ 
      root: { $regex: new RegExp(root, 'i') }
    });
    
    if (!words.length) {
      return res.status(404).json({ message: 'Aucun mot trouvé avec cette racine' });
    }
    
    res.status(200).json({
      words,
      totalResults: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error(`Erreur lors de la recherche de mots avec la racine "${req.params.root}":`, error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer les occurrences d'un mot avec son contexte
exports.getWordOccurrencesWithContext = async (req, res) => {
  try {
    const { root } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    // Recherche des mots par racine
    const words = await Word.find({ 
      root: { $regex: new RegExp(root, 'i') } 
    })
    .sort({ sura: 1, aya: 1, pos: 1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));
    
    if (!words.length) {
      return res.status(404).json({ message: 'Aucun mot trouvé avec cette racine' });
    }
    
    // Récupérer le contexte (verset complet) pour chaque occurrence
    const occurrences = await Promise.all(
      words.map(async (word) => {
        const verse = await Verse.findOne({
          sura: word.sura,
          aya: word.aya
        });
        
        return {
          wordId: word._id,
          root: word.root,
          sura: word.sura,
          aya: word.aya,
          position: word.pos,
          verseTextAr: verse ? verse.textAr : null,
          verseTextFr: verse ? verse.textFr : null,
          segment: verse ? verse.segments.find(s => s.pos === word.pos) : null
        };
      })
    );
    
    const count = await Word.countDocuments({ 
      root: { $regex: new RegExp(root, 'i') }
    });
    
    res.status(200).json({
      occurrences,
      totalResults: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error(`Erreur lors de la récupération des occurrences de la racine "${req.params.root}":`, error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

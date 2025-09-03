const Verse = require('../models/Verse');

// Récupérer tous les versets (avec pagination)
exports.getAllVerses = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const verses = await Verse.find()
      .sort({ sura: 1, aya: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const count = await Verse.countDocuments();
    
    res.status(200).json({
      verses,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des versets:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer les versets d'une sourate spécifique
exports.getVersesBySura = async (req, res) => {
  try {
    const { suraNumber } = req.params;
    const verses = await Verse.find({ sura: parseInt(suraNumber) })
      .sort({ aya: 1 });
    
    if (!verses.length) {
      return res.status(404).json({ message: 'Aucun verset trouvé pour cette sourate' });
    }
    
    res.status(200).json(verses);
  } catch (error) {
    console.error(`Erreur lors de la récupération des versets de la sourate ${req.params.suraNumber}:`, error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer un verset spécifique par sourate et numéro de verset
exports.getVerseByAya = async (req, res) => {
  try {
    const { suraNumber, ayaNumber } = req.params;
    const verse = await Verse.findOne({ 
      sura: parseInt(suraNumber),
      aya: parseInt(ayaNumber)
    });
    
    if (!verse) {
      return res.status(404).json({ message: 'Verset non trouvé' });
    }
    
    res.status(200).json(verse);
  } catch (error) {
    console.error(`Erreur lors de la récupération du verset ${req.params.ayaNumber} de la sourate ${req.params.suraNumber}:`, error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Rechercher des versets par texte (en arabe ou français)
exports.searchVerses = async (req, res) => {
  try {
    const { query, language = 'all', page = 1, limit = 20 } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Paramètre de recherche manquant' });
    }
    
    let searchQuery = {};
    
    if (language === 'ar') {
      searchQuery = { textAr: { $regex: query, $options: 'i' } };
    } else if (language === 'fr') {
      searchQuery = { textFr: { $regex: query, $options: 'i' } };
    } else {
      searchQuery = {
        $or: [
          { textAr: { $regex: query, $options: 'i' } },
          { textFr: { $regex: query, $options: 'i' } }
        ]
      };
    }
    
    const verses = await Verse.find(searchQuery)
      .sort({ sura: 1, aya: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const count = await Verse.countDocuments(searchQuery);
    
    res.status(200).json({
      verses,
      totalResults: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error(`Erreur lors de la recherche de versets pour "${req.query.query}":`, error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

import apiClient from './config';

const verseService = {
  // Récupérer tous les versets (avec pagination)
  getAllVerses: async (page = 1, limit = 20) => {
    try {
      const response = await apiClient.get(`/verses?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des versets:', error);
      throw error;
    }
  },

  // Récupérer les versets d'une sourate spécifique
  getVersesBySura: async (suraNumber) => {
    try {
      const response = await apiClient.get(`/verses/sura/${suraNumber}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des versets de la sourate ${suraNumber}:`, error);
      throw error;
    }
  },

  // Récupérer un verset spécifique par sourate et numéro de verset
  getVerseByAya: async (suraNumber, ayaNumber) => {
    try {
      const response = await apiClient.get(`/verses/sura/${suraNumber}/aya/${ayaNumber}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du verset ${ayaNumber} de la sourate ${suraNumber}:`, error);
      throw error;
    }
  },

  // Rechercher des versets par texte (en arabe ou français)
  searchVerses: async (query, language = 'all', page = 1, limit = 20) => {
    try {
      const response = await apiClient.get(
        `/verses/search?query=${encodeURIComponent(query)}&language=${language}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la recherche de versets pour "${query}":`, error);
      throw error;
    }
  },

  // Récupérer un verset spécifique par son ID
  getVerseById: async (verseId) => {
    try {
      const response = await apiClient.get(`/verses/${verseId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du verset avec l'ID ${verseId}:`, error);
      
      // En cas d'échec avec l'API, essayons de récupérer le verset à partir du localStorage
      try {
        const bookmarksString = localStorage.getItem('bookmarkedVerses');
        const bookmarks = bookmarksString ? JSON.parse(bookmarksString) : [];
        
        // Si l'ID est dans les signets, utilisons les données du localStorage
        if (bookmarks.includes(verseId)) {
          // Format: sura:aya (exemple: 1:7)
          const [sura, aya] = verseId.split(':').map(Number);
          return { _id: verseId, sura, aya, textAr: '', textFr: `Verset ${aya} de la sourate ${sura}` };
        }
      } catch (localStorageError) {
        console.error('Erreur lors de la récupération des données du localStorage:', localStorageError);
      }
      
      throw error;
    }
  },

  // Récupérer un verset aléatoire d'au moins 150 caractères
  getRandomVerse: async () => {
    try {
      // Approche améliorée pour sélectionner des versets plus longs
      // Liste des sourates contenant généralement des versets longs (comme Al-Baqarah, Al-Imran, An-Nisa, etc.)
      const longVersesSuras = [2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 16, 18, 20, 21, 22, 23, 24, 26, 28, 33, 34, 35, 39, 40, 42, 48];
      
      // Sélectionner d'abord une sourate qui contient probablement des versets longs
      const randomSura = longVersesSuras[Math.floor(Math.random() * longVersesSuras.length)];
      
      // Obtenir les informations de la sourate
      const suraInfo = await import('./suraNames').then(module => {
        const suras = module.default;
        return suras.find(sura => sura.number === randomSura) || { name: '', nameFr: '' };
      }).catch(() => ({ name: '', nameFr: '' }));
      
      // Obtenir tous les versets de cette sourate
      const suraVerses = await verseService.getVersesBySura(randomSura);
      
      // Filtrer les versets ayant plus de 150 caractères
      const longVerses = suraVerses.filter(verse => verse.textAr && verse.textAr.length >= 150);
      
      // S'il n'y a pas de versets assez longs, essayer une autre approche
      if (longVerses.length === 0) {
        // Prendre le verset le plus long disponible dans cette sourate
        suraVerses.sort((a, b) => (b.textAr ? b.textAr.length : 0) - (a.textAr ? a.textAr.length : 0));
        const longestVerse = suraVerses[0];
        
        // Ajouter les noms de sourate au verset
        return {
          ...longestVerse,
          suraName: suraInfo.name || '',
          suraNameFr: suraInfo.nameFr || `Sourate ${randomSura}`
        };
      }
      
      // Sélectionner un verset aléatoire parmi les versets longs
      const randomLongVerse = longVerses[Math.floor(Math.random() * longVerses.length)];
      
      // Ajouter les noms de sourate au verset
      return {
        ...randomLongVerse,
        suraName: suraInfo.name || '',
        suraNameFr: suraInfo.nameFr || `Sourate ${randomSura}`
      };
    } catch (error) {
      console.error('Erreur lors de la récupération d\'un verset aléatoire:', error);
      
      // En cas d'erreur, retourner un verset par défaut
      return {
        sura: 48,
        aya: 23,
        textAr: "سُنَّةَ ٱللَّهِ ٱلَّتِى قَدْ خَلَتْ مِن قَبْلُ ۖ وَلَن تَجِدَ لِسُنَّةِ ٱللَّهِ تَبْدِيلًا",
        textFr: "Telle est la règle d'Allah établie depuis toujours. Et tu ne saurais trouver changement à la règle d'Allah.",
        suraName: "الفتح",
        suraNameFr: "Al-Fath (La Victoire)"
      };
    }
  }
};

export default verseService;

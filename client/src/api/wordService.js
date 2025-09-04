import apiClient from './config';

const wordService = {
  // Récupérer tous les mots (avec pagination)
  getAllWords: async (page = 1, limit = 50) => {
    try {
      const response = await apiClient.get(`/words?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des mots:', error);
      throw error;
    }
  },

  // Rechercher les mots par racine
  getWordsByRoot: async (root, page = 1, limit = 50) => {
    try {
      const response = await apiClient.get(`/words/root/${root}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la recherche de mots avec la racine "${root}":`, error);
      throw error;
    }
  },

  // Récupérer les occurrences d'un mot avec son contexte
  getWordOccurrencesWithContext: async (root, page = 1, limit = 20) => {
    try {
      const response = await apiClient.get(`/words/root/${root}/context?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des occurrences de la racine "${root}":`, error);
      throw error;
    }
  }
};

export default wordService;

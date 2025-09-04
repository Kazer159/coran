import apiClient from './config';

const suraService = {
  // Récupérer toutes les sourates
  getAllSuras: async () => {
    try {
      const response = await apiClient.get('/suras');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des sourates:', error);
      throw error;
    }
  },

  // Récupérer une sourate par son numéro
  getSuraByNumber: async (number) => {
    try {
      const response = await apiClient.get(`/suras/${number}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la sourate ${number}:`, error);
      throw error;
    }
  },

  // Récupérer une sourate par son ID (alias de getSuraByNumber)
  getSuraById: async (id) => {
    return suraService.getSuraByNumber(id);
  },

  // Récupérer les sourates par lieu de révélation
  getSurasByRevelationPlace: async (place) => {
    try {
      const response = await apiClient.get(`/suras/revelation-place/${place}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des sourates de ${place}:`, error);
      throw error;
    }
  },

  // Récupérer les sourates par ordre de révélation
  getSurasByRevelationOrder: async () => {
    try {
      const response = await apiClient.get('/suras/revelation-order');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des sourates par ordre de révélation:', error);
      throw error;
    }
  }
};

export default suraService;

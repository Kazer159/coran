import { useState } from 'react';

/**
 * Hook personnalisé pour gérer l'affichage des détails mot-à-mot des versets
 * @returns {Object} Méthodes et états pour gérer les détails des versets
 */
const useVerseDetails = () => {
  const [expandedVerses, setExpandedVerses] = useState([]);

  /**
   * Basculer l'affichage des détails d'un verset (mot à mot)
   * @param {string} verseId - ID du verset à basculer
   */
  const toggleVerseWordDetails = (verseId) => {
    setExpandedVerses(prev => {
      if (prev.includes(verseId)) {
        // Si le verset est déjà étendu, le fermer
        return prev.filter(id => id !== verseId);
      } else {
        // Sinon, l'ajouter à la liste des versets étendus
        return [...prev, verseId];
      }
    });
  };

  /**
   * Vérifie si un verset spécifique est actuellement étendu
   * @param {string} verseId - ID du verset à vérifier
   * @returns {boolean} - true si le verset est étendu, false sinon
   */
  const isVerseExpanded = (verseId) => {
    return expandedVerses.includes(verseId);
  };

  /**
   * Réinitialise tous les états d'expansion des versets
   */
  const resetExpandedVerses = () => {
    setExpandedVerses([]);
  };

  /**
   * Définit directement la liste des versets étendus
   * @param {Array} verseIds - Liste des IDs de versets à étendre
   */
  const setVerseDetailsState = (verseIds) => {
    setExpandedVerses(verseIds);
  };

  return {
    expandedVerses,
    toggleVerseWordDetails,
    isVerseExpanded,
    resetExpandedVerses,
    setVerseDetailsState,
    setExpandedVerses
  };
};

export default useVerseDetails;

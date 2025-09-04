import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour gérer les versets mis en favoris (bookmarks)
 * @returns {Object} Méthodes et états pour gérer les favoris
 */
const useBookmarks = () => {
  const [bookmarkedVerses, setBookmarkedVerses] = useState([]);

  // Charger les favoris depuis le localStorage au chargement
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem('bookmarkedVerses');
      if (savedBookmarks) {
        setBookmarkedVerses(JSON.parse(savedBookmarks));
      }
    } catch (e) {
      console.error('Erreur lors du chargement des favoris:', e);
    }
  }, []);

  /**
   * Basculer l'état d'un verset favori (ajouter/retirer)
   * @param {Object} verse - Objet verset avec sura et aya
   * @returns {boolean} - true si le verset est maintenant en favori, false sinon
   */
  const toggleBookmark = (verse) => {
    // Créer un identifiant standardisé au format 'sura:aya'
    const standardId = `${verse.sura}:${verse.aya}`;
    
    // Vérifier si le verset est déjà dans les favoris
    const isBookmarked = bookmarkedVerses.includes(standardId);
    
    const newBookmarks = isBookmarked
      ? bookmarkedVerses.filter(id => id !== standardId)
      : [...bookmarkedVerses, standardId];
    
    setBookmarkedVerses(newBookmarks);
    
    // Sauvegarder dans localStorage
    try {
      localStorage.setItem('bookmarkedVerses', JSON.stringify(newBookmarks));
    } catch (e) {
      console.error('Erreur lors de la sauvegarde des favoris:', e);
    }
    
    return !isBookmarked;
  };

  /**
   * Vérifie si un verset est en favori
   * @param {Object} verse - Objet verset avec sura et aya
   * @returns {boolean} - true si le verset est en favori, false sinon
   */
  const isBookmarked = (verse) => {
    const standardId = `${verse.sura}:${verse.aya}`;
    return bookmarkedVerses.includes(standardId);
  };

  /**
   * Ajoute un verset aux favoris
   * @param {Object} verse - Objet verset avec sura et aya
   */
  const addBookmark = (verse) => {
    const standardId = `${verse.sura}:${verse.aya}`;
    if (!bookmarkedVerses.includes(standardId)) {
      const newBookmarks = [...bookmarkedVerses, standardId];
      setBookmarkedVerses(newBookmarks);
      localStorage.setItem('bookmarkedVerses', JSON.stringify(newBookmarks));
    }
  };

  /**
   * Retire un verset des favoris
   * @param {Object} verse - Objet verset avec sura et aya
   */
  const removeBookmark = (verse) => {
    const standardId = `${verse.sura}:${verse.aya}`;
    const newBookmarks = bookmarkedVerses.filter(id => id !== standardId);
    setBookmarkedVerses(newBookmarks);
    localStorage.setItem('bookmarkedVerses', JSON.stringify(newBookmarks));
  };

  return {
    bookmarkedVerses,
    toggleBookmark,
    isBookmarked,
    addBookmark,
    removeBookmark
  };
};

export default useBookmarks;

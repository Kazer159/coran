import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useVerseDetails from '../hooks/useVerseDetails';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  CircularProgress,
  Pagination,
  Tabs,
  Tab,
  Alert,
  Paper,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import verseService from '../api/verseService';
import wordService from '../api/wordService';
import VerseCard from '../components/common/VerseCard';
import suraNames from '../api/suraNames';

// Fonction pour extraire les paramètres de recherche de l'URL
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

// Fonction pour obtenir le nom français d'une sourate à partir de son numéro
const getSuraNameFr = (suraNumber) => {
  const sura = suraNames.find(s => s.number === parseInt(suraNumber, 10));
  return sura ? sura.nameFr : `Sourate ${suraNumber}`;
};

const SearchPage = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Hook pour gérer l'analyse mot par mot
  const { toggleVerseWordDetails, isVerseExpanded } = useVerseDetails();
  
  // État pour gérer les signets/favoris
  const [bookmarkedVerses, setBookmarkedVerses] = useState([]);

  // Charger les favoris au chargement de la page
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('quran-bookmarks');
    if (savedBookmarks) {
      try {
        const parsedBookmarks = JSON.parse(savedBookmarks);
        setBookmarkedVerses(parsedBookmarks);
      } catch (error) {
        console.error("Erreur lors du chargement des favoris:", error);
      }
    }
  }, []);

  // Gestion des favoris
  const handleToggleBookmark = (verse) => {
    const verseId = `${verse.sura}:${verse.aya}`;
    setBookmarkedVerses(prevBookmarks => {
      let newBookmarks;
      if (prevBookmarks.some(bookmark => bookmark.id === verseId)) {
        // Supprimer le signet
        newBookmarks = prevBookmarks.filter(bookmark => bookmark.id !== verseId);
      } else {
        // Ajouter le signet
        const newBookmark = {
          id: verseId,
          sura: verse.sura,
          aya: verse.aya,
          suraName: verse.suraName || '',
          suraNameFr: verse.suraNameFr || '',
          textAr: verse.textAr || '',
          textFr: verse.textFr || '',
          dateAdded: new Date().toISOString()
        };
        newBookmarks = [...prevBookmarks, newBookmark];
      }
      // Sauvegarder dans le localStorage
      localStorage.setItem('quran-bookmarks', JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  };

  // Vérifier si un verset est dans les favoris
  const isVerseBookmarked = (verse) => {
    if (!verse || !verse.sura || !verse.aya) return false;
    const verseId = `${verse.sura}:${verse.aya}`;
    return bookmarkedVerses.some(bookmark => bookmark.id === verseId);
  };
  
  // Extraire les paramètres de recherche de l'URL
  const initialSearchTerm = query.get('q') || '';
  const initialSearchMode = query.get('mode') || 'text';
  const initialLanguage = query.get('lang') || 'all';
  const initialSura = query.get('sura') || '';
  const initialAya = query.get('aya') || '';
  const initialTranslitTerm = query.get('tl') || '';
  
  // États pour les paramètres de recherche
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [searchTranslitTerm, setSearchTranslitTerm] = useState(initialTranslitTerm);
  const [searchMode, setSearchMode] = useState(initialSearchMode);
  const [language, setLanguage] = useState(initialLanguage);
  const [suraFilter, setSuraFilter] = useState(initialSura);
  const [ayaFilter, setAyaFilter] = useState(initialAya);
  
  // États pour les résultats et la pagination
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  
  // Effectuer la recherche quand les paramètres changent dans l'URL
  // Note: On utilise deliberément eslint-disable pour limiter les dépendances à location.search
  // pour éviter une boucle infinie car performSearch modifie l'état qui pourrait déclencher à nouveau l'effet
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // Réinitialiser les états avec les paramètres de l'URL à chaque changement de recherche
    setSearchTerm(query.get('q') || '');
    setSearchTranslitTerm(query.get('tl') || '');
    setSearchMode(query.get('mode') || 'text');
    setLanguage(query.get('lang') || 'all');
    setSuraFilter(query.get('sura') || '');
    setAyaFilter(query.get('aya') || '');
    
    if (query.get('q') || (query.get('sura') && query.get('aya'))) {
      performSearch();
    }
  }, [location.search]);
  /* eslint-enable react-hooks/exhaustive-deps */
  
  /* Note: Nous utilisons eslint-disable pour ce useEffect car nous voulons
     délibérément que la recherche ne se déclenche que lorsque l'URL change,
     et non lorsque les valeurs initiales ou la fonction performSearch changent */
  
  // Utiliser useCallback pour mémoiser la fonction performSearch
  const performSearch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (searchMode === 'text') {
        // Recherche de versets par texte
        response = await verseService.searchVerses(
          searchTerm,
          language,
          currentPage,
          10
        );
        
        setResults(response.verses);
        setTotalPages(response.totalPages);
        setTotalResults(response.totalResults);
      } else if (searchMode === 'root') {
        // Recherche par racine
        response = await wordService.getWordOccurrencesWithContext(
          searchTerm,
          currentPage,
          10
        );
        
        // Débogage pour voir la structure de la réponse
        console.log('Réponse pour recherche par racine:', response);
        
        // Traiter les résultats pour s'assurer que chaque occurrence a les données nécessaires
        const processedOccurrences = response.occurrences.map(occ => {
          // S'assurer que la translitération est disponible pour les segments et le verset
          if (occ.segment && !occ.segment.tl) {
            occ.segment.tl = ''; // Garantir qu'il y a au moins un champ vide
          }
          return occ;
        });
        
        setResults(processedOccurrences);
        setTotalPages(response.totalPages);
        setTotalResults(response.totalResults);
      } else if (suraFilter && ayaFilter) {
        // Recherche par référence (sourate/verset)
        const verse = await verseService.getVerseByAya(suraFilter, ayaFilter);
        setResults([verse]);
        setTotalPages(1);
        setTotalResults(1);
      }
    } catch (err) {
      console.error('Erreur lors de la recherche:', err);
      if (err.response && err.response.status === 404) {
        setResults([]);
        setTotalResults(0);
        setTotalPages(0);
        setError('Aucun résultat trouvé pour cette recherche.');
      } else {
        setError('Une erreur est survenue lors de la recherche. Veuillez réessayer plus tard.');
      }
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchMode, searchTerm, language, currentPage, suraFilter, ayaFilter]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    
    // Construction des paramètres de recherche pour l'URL
    const searchParams = new URLSearchParams();
    
    if (searchMode === 'text' || searchMode === 'root') {
      searchParams.set('q', searchTerm);
      searchParams.set('mode', searchMode);
      
      // Ajouter le paramètre tl s'il existe
      if (searchTranslitTerm) {
        searchParams.set('tl', searchTranslitTerm);
      }
      
      if (searchMode === 'text') {
        searchParams.set('lang', language);
      }
    } else if (searchMode === 'reference' && suraFilter) {
      searchParams.set('sura', suraFilter);
      if (ayaFilter) {
        searchParams.set('aya', ayaFilter);
      }
    }
    
    // Mise à jour de l'URL avec les paramètres de recherche
    navigate({
      pathname: '/search',
      search: searchParams.toString()
    });
    
    // Réinitialiser la pagination
    setCurrentPage(1);
  };
  
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    
    // Mettre à jour l'URL avec le nouveau numéro de page
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', value);
    
    navigate({
      pathname: '/search',
      search: searchParams.toString()
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Recherche
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Tabs
          value={searchMode}
          onChange={(e, newValue) => setSearchMode(newValue)}
          indicatorColor="primary"
          textColor="primary"
          centered
          sx={{ mb: 3 }}
        >
          <Tab 
            value="text" 
            label="Par texte" 
            icon={<FormatQuoteIcon />} 
            iconPosition="start"
          />
          <Tab 
            value="root" 
            label="Par racine" 
            icon={<LocalLibraryIcon />} 
            iconPosition="start"
          />
          <Tab 
            value="reference" 
            label="Par référence" 
            icon={<SearchIcon />} 
            iconPosition="start"
          />
        </Tabs>
        
        <Box component="form" onSubmit={handleSearch} noValidate>
          {(searchMode === 'text' || searchMode === 'root') && (
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={searchMode === 'text' ? 8 : 12}>
                <TextField
                  label={searchMode === 'text' ? "Rechercher du texte" : "Rechercher une racine arabe"}
                  variant="outlined"
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  helperText={
                    searchMode === 'text' 
                      ? "Entrez un mot ou une phrase en arabe ou en français"
                      : "Entrez une racine arabe (ex: كتب, سلم)"
                  }
                />
              </Grid>
              
              {searchMode === 'text' && (
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="language-select-label">Langue</InputLabel>
                    <Select
                      labelId="language-select-label"
                      id="language-select"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      label="Langue"
                    >
                      <MenuItem value="all">Toutes les langues</MenuItem>
                      <MenuItem value="ar">Arabe</MenuItem>
                      <MenuItem value="fr">Français</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>
          )}
          
          {searchMode === 'reference' && (
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  label="Numéro de sourate"
                  variant="outlined"
                  fullWidth
                  type="number"
                  inputProps={{ min: 1, max: 114 }}
                  value={suraFilter}
                  onChange={(e) => setSuraFilter(e.target.value)}
                  helperText="Entrez un numéro de sourate (1-114)"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Numéro de verset"
                  variant="outlined"
                  fullWidth
                  type="number"
                  inputProps={{ min: 1 }}
                  value={ayaFilter}
                  onChange={(e) => setAyaFilter(e.target.value)}
                  helperText="Entrez un numéro de verset"
                />
              </Grid>
            </Grid>
          )}
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<SearchIcon />}
              disabled={
                (searchMode === 'text' && !searchTerm.trim()) ||
                (searchMode === 'root' && !searchTerm.trim()) ||
                (searchMode === 'reference' && !suraFilter)
              }
            >
              Rechercher
            </Button>
          </Box>
        </Box>
      </Paper>
      
      {/* Affichage des résultats */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : results.length > 0 ? (
        <>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" component="div">
              {totalResults} résultat{totalResults > 1 ? 's' : ''} trouvé{totalResults > 1 ? 's' : ''}
            </Typography>
            <Divider sx={{ my: 2 }} />
          </Box>
          
          {results.map((result, index) => {
            // Préparer les données du verset selon le mode de recherche
            let verseData;
            
            if (searchMode === 'text') {
              verseData = {
                ...result,
                // Assurer la compatibilité avec VerseCard
                _id: result._id || `${result.sura}:${result.aya}`,
                suraName: result.suraName,
                suraNameFr: getSuraNameFr(result.sura)
              };
            } else if (searchMode === 'root') {
              // Ajouter plus de débogage pour vérifier les données reçues
              console.log('Données de résultat pour recherche par racine:', result);
              
              // Essayer de récupérer la translitération depuis plusieurs sources possibles
              const translitText = result.verseTl || result.textTl || result.transliteration || '';
              console.log('Transliteration récupérée:', translitText);
              
              verseData = {
                sura: result.sura,
                aya: result.aya,
                textAr: result.verseTextAr || result.textAr || '',
                textFr: result.verseTextFr || result.textFr || '',
                // Définir explicitement la translitération
                textTl: translitText,
                // S'assurer que le segment contient la translittération
                segments: result.segment ? [
                  {
                    ...result.segment,
                    // S'assurer que la translitération du segment est disponible
                    tl: result.segment.tl || ''
                  }
                ] : [],
                _id: result._id || `${result.sura}:${result.aya}`,
                suraName: result.suraName || '',
                suraNameFr: getSuraNameFr(result.sura),
                // Ajouter des métadonnées spécifiques pour la recherche par racine
                rootInfo: {
                  root: result.root || '',
                  segment: result.segment || {}
                }
              };
              
              // Débogage pour vérifier la structure finale de verseData
              console.log('Structure de verseData pour VerseCard:', verseData);
            } else { // reference
              verseData = {
                ...result,
                _id: result._id || `${result.sura}:${result.aya}`,
                suraName: result.suraName,
                suraNameFr: getSuraNameFr(result.sura)
              };
            }
            
            return (
              <React.Fragment key={index}>
                {/* Utiliser VerseCard pour tous les types de résultats */}
                <VerseCard 
                  verse={verseData} 
                  showActions={true} 
                  showDetails={isVerseExpanded(verseData._id || `${verseData.sura}:${verseData.aya}`)}
                  isBookmarked={isVerseBookmarked(verseData)}
                  onToggleBookmark={handleToggleBookmark}
                  onToggleDetails={toggleVerseWordDetails}
                  theme={document.documentElement.getAttribute('data-theme') || 'light'}
                  fontSize={{
                    arabic: 1.8,
                    translation: 1
                  }}
                  displayMode="standard"
                  showContextButton={true}
                  searchTerm={searchTerm}
                  searchTranslitTerm={searchTranslitTerm || searchTerm}
                />
                
                {/* Si mode de recherche par racine et qu'on a des détails de segment */}
                {searchMode === 'root' && result.segment && (
                  <Box sx={{
                    p: 2,
                    mb: 3,
                    mt: -2,
                    backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    borderRadius: 1
                  }}>
                    <Typography variant="subtitle2" gutterBottom>
                      <Chip 
                        label={`Racine: ${result.root}`} 
                        size="small" 
                        color="secondary" 
                        sx={{ mr: 1 }}
                      />
                      Détails du mot:
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2">
                          <strong>Mot arabe:</strong> {result.segment.ar}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2">
                          <strong>Translittération:</strong> {result.segment.tl || 'Non disponible'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2">
                          <strong>Traduction:</strong> {result.segment.en || 'Non disponible'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </React.Fragment>
            );
          })}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <Pagination 
                count={totalPages} 
                page={currentPage} 
                onChange={handlePageChange} 
                color="primary" 
                showFirstButton 
                showLastButton
              />
            </Box>
          )}
        </>
      ) : initialSearchTerm || (initialSura && initialAya) ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          Aucun résultat trouvé. Essayez d'autres termes de recherche.
        </Alert>
      ) : null}
    </Container>
  );
};

export default SearchPage;

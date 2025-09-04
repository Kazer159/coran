import React, { useState, useEffect } from 'react';
import useVerseDetails from '../hooks/useVerseDetails';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link as MuiLink,
  Snackbar,
  Zoom
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import verseService from '../api/verseService';
import suraService from '../api/suraService';
import VerseCard from '../components/common/VerseCard';

const BookmarksPage = () => {
  const theme = useTheme();
  const [bookmarkedVerses, setBookmarkedVerses] = useState([]);
  const [verseDetails, setVerseDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const { expandedVerses, toggleVerseWordDetails } = useVerseDetails();

  // Fonction pour charger un verset spécifique avec toutes les informations
  const loadVerseDetails = async (suraNumber, ayaNumber) => {
    try {
      // Récupérer les détails du verset
      const verseDetails = await verseService.getVerseByAya(suraNumber, ayaNumber);
      
      // Si le verset n'a pas été trouvé, créer des données par défaut
      if (!verseDetails) {
        return {
          _id: `${suraNumber}:${ayaNumber}`,
          sura: suraNumber,
          aya: ayaNumber,
          textAr: 'Texte arabe non disponible',
          textFr: `Verset ${ayaNumber} de la sourate ${suraNumber}`,
          suraName: '',
          suraNameFr: `Sourate ${suraNumber}`
        };
      }
      
      // Récupérer les détails de la sourate
      const suraDetails = await suraService.getSuraByNumber(suraNumber);
      
      // Combiner les informations exactement comme dans SuraDetailPage
      return {
        ...verseDetails,
        _id: `${suraNumber}:${ayaNumber}`,
        suraName: suraDetails?.name || '',
        suraNameFr: suraDetails?.nameFr || suraDetails?.nameTranslated || `Sourate ${suraNumber}`
      };
    } catch (error) {
      console.error(`Erreur lors du chargement du verset ${suraNumber}:${ayaNumber}:`, error);
      return {
        _id: `${suraNumber}:${ayaNumber}`,
        sura: suraNumber,
        aya: ayaNumber,
        textAr: 'Texte arabe non disponible',
        textFr: `Verset ${ayaNumber} de la sourate ${suraNumber}`,
        suraName: '',
        suraNameFr: `Sourate ${suraNumber}`,
        nameTranslated: `Sourate ${suraNumber}`
      };
    }
  };
  
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        setLoading(true);
        // Récupérer les signets depuis le localStorage
        const bookmarksString = localStorage.getItem('bookmarkedVerses');
        const bookmarks = bookmarksString ? JSON.parse(bookmarksString) : [];
        
        // Afficher le format réel des identifiants stockés
        console.log('Format des favoris dans localStorage:', bookmarks);
        
        setBookmarkedVerses(bookmarks);

        if (bookmarks.length > 0) {
          // Charger les détails des versets signets
          const details = await Promise.all(
            bookmarks.map(async (verseId) => {
              try {
                // Format attendu pour verseId: "sura:aya" (exemple: "1:7")
                const [suraNumber, ayaNumber] = verseId.split(':').map(Number);
                return await loadVerseDetails(suraNumber, ayaNumber);
              } catch (err) {
                console.error(`Erreur lors du chargement du verset ${verseId}:`, err);
                return null;
              }
            })
          );
          
          // Filtrer les résultats nuls en cas d'échec de chargement de certains versets
          setVerseDetails(details.filter(verse => verse !== null));
        }
      } catch (err) {
        console.error('Erreur lors du chargement des signets:', err);
        setError('Impossible de charger vos signets. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, []);

  // Fonction pour afficher un message dans la snackbar
  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // La fonctionnalité de basculement des détails (mot à mot) est maintenant gérée par le hook useVerseDetails

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const removeBookmark = (verseId) => {
    // Mettre à jour l'état
    const updatedBookmarks = bookmarkedVerses.filter(id => id !== verseId);
    setBookmarkedVerses(updatedBookmarks);
    
    // Mettre à jour le localStorage
    localStorage.setItem('bookmarkedVerses', JSON.stringify(updatedBookmarks));
    
    // Mettre à jour les détails affichés
    setVerseDetails(verseDetails.filter(verse => verse._id !== verseId));
    
    // Afficher notification
    showSnackbar('Verset retiré des favoris', 'success');
  };

  const clearAllBookmarks = () => {
    // Effacer tous les signets
    setBookmarkedVerses([]);
    setVerseDetails([]);
    localStorage.removeItem('bookmarkedVerses');
    showSnackbar('Tous les favoris ont été supprimés', 'info');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Snackbar pour notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Fil d'Ariane */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <MuiLink
          component={RouterLink}
          to="/"
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Accueil
        </MuiLink>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <BookmarkIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Favoris
        </Typography>
      </Breadcrumbs>

      {/* En-tête */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Mes Favoris
        </Typography>
        {bookmarkedVerses.length > 0 && (
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<DeleteIcon />}
            onClick={clearAllBookmarks}
          >
            Tout effacer
          </Button>
        )}
      </Box>

      {/* Contenu principal */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      ) : bookmarkedVerses.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
          <BookmarkBorderIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>Aucun signet enregistré</Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Vous n'avez pas encore ajouté de versets à vos favoris.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            component={RouterLink} 
            to="/suras"
            sx={{ mt: 2 }}
          >
            Explorer les sourates
          </Button>
        </Paper>
      ) : (
        <>
          {verseDetails.map((verse) => (
            <Zoom in={true} key={verse._id} style={{ transitionDelay: '100ms' }}>
              <Box>
                <VerseCard 
                verse={verse}
                isBookmarked={true}
                onRemove={removeBookmark}
                onToggleBookmark={() => {}} /* Fonction vide car déjà géré par onRemove */
                onToggleDetails={() => toggleVerseWordDetails(verse._id)} /* Active/désactive l'affichage des détails */
                showDetails={expandedVerses.includes(verse._id)}
                onShare={() => {
                  const shareText = `${verse.textAr}\n${verse.textFr}\n(Sourate ${verse.sura}, verset ${verse.aya})`;
                  const shareUrl = `${window.location.origin}/sura/${verse.sura}#${verse.aya}`;
                  
                  if (navigator.share) {
                    navigator.share({
                      title: `Sourate ${verse.sura}, verset ${verse.aya}`,
                      text: shareText,
                      url: shareUrl
                    })
                  } else {
                    navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
                      .then(() => showSnackbar('Verset copié dans le presse-papier', 'success'));
                  }
                }}
                showActions={true}
                theme={theme.palette.mode}
                fontSize={{
                  arabic: 1.8,
                  translation: 1
                }}
                displayMode="standard"
                showContextButton={true}
              />
              </Box>
            </Zoom>
          ))}
        </>
      )}
    </Container>
  );
};

export default BookmarksPage;

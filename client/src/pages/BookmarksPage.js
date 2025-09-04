import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Card, 
  CardContent,
  Button,
  IconButton,
  Divider,
  Grid,
  Chip,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link as MuiLink,
  Tooltip
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import verseService from '../api/verseService';
import suraService from '../api/suraService';

const BookmarksPage = () => {
  const theme = useTheme();
  const [bookmarkedVerses, setBookmarkedVerses] = useState([]);
  const [verseDetails, setVerseDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      
      // Combiner les informations
      return {
        ...verseDetails,
        _id: `${suraNumber}:${ayaNumber}`,
        suraName: suraDetails?.name || '',
        suraNameFr: suraDetails?.nameFr || `Sourate ${suraNumber}`
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
        suraNameFr: `Sourate ${suraNumber}`
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

  const removeBookmark = (verseId) => {
    // Mettre à jour l'état
    const updatedBookmarks = bookmarkedVerses.filter(id => id !== verseId);
    setBookmarkedVerses(updatedBookmarks);
    
    // Mettre à jour le localStorage
    localStorage.setItem('bookmarkedVerses', JSON.stringify(updatedBookmarks));
    
    // Mettre à jour les détails affichés
    setVerseDetails(verseDetails.filter(verse => verse._id !== verseId));
  };

  const clearAllBookmarks = () => {
    // Effacer tous les signets
    setBookmarkedVerses([]);
    setVerseDetails([]);
    localStorage.removeItem('bookmarkedVerses');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
          Favorie
        </Typography>
      </Breadcrumbs>

      {/* En-tête */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Mes Favories
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
        <Grid container spacing={3}>
          {verseDetails.map((verse) => (
            <Grid item xs={12} key={verse._id}>
              <Card 
                sx={{ 
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  '&:hover': {
                    boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
                    backgroundColor: alpha(theme.palette.primary.main, 0.02)
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Chip 
                        label={`Sourate ${verse.suraNameFr || verse.suraName || verse.sura} Verset ${verse.aya}`} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                        sx={{ fontSize: '0.75rem', maxWidth: '350px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        component={RouterLink}
                        to={`/sura/${verse.sura}`}
                        clickable
                      />
                    </Box>
                    <Tooltip title="Retirer des favoris">
                      <IconButton 
                        color="error" 
                        size="small" 
                        onClick={() => removeBookmark(verse._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography 
                        paragraph 
                        align="right" 
                        sx={{ 
                          fontFamily: '"Noto Naskh Arabic", sans-serif',
                          fontSize: '1.8rem',
                          lineHeight: 1.8,
                          mb: 2
                        }}
                      >
                        {verse.textAr}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Typography 
                        variant="body1" 
                        paragraph 
                        sx={{ fontStyle: 'italic' }}
                      >
                        {verse.textFr}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      component={RouterLink} 
                      to={`/sura/${verse.sura}#${verse.aya}`}
                    >
                      Voir en contexte
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default BookmarksPage;

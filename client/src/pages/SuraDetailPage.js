import React, { useState, useEffect } from 'react';
import useVerseDetails from '../hooks/useVerseDetails';
import { useParams, Link as RouterLink } from 'react-router-dom';
import './SuraDetailPage.css'; // Import des styles pour la surbrillance des versets
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Button,
  CircularProgress,
  Chip,
  IconButton,
  Pagination,
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Fade,
  Zoom,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Snackbar,
  Alert,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Slider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CloseIcon from '@mui/icons-material/Close';
import LightModeIcon from '@mui/icons-material/LightMode';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import TableRowsIcon from '@mui/icons-material/TableRows';
import ClearIcon from '@mui/icons-material/Clear';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import NightlightIcon from '@mui/icons-material/Nightlight';
import suraService from '../api/suraService';
import verseService from '../api/verseService';
import VerseCard from '../components/common/VerseCard';

const SuraDetailPage = () => {
  const { suraNumber } = useParams();
  const muiTheme = useTheme(); // Utiliser useTheme comme dans BookmarksPage
  
  // États de base
  const [sura, setSura] = useState(null);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWordDetails, setShowWordDetails] = useState(false);
  const { expandedVerses, toggleVerseWordDetails, isVerseExpanded, resetExpandedVerses, setVerseDetailsState } = useVerseDetails();
  const [currentPage, setCurrentPage] = useState(1);
  const versesPerPage = 20;
  
  // Nouveaux états pour les fonctionnalités améliorées
  const [displayMode, setDisplayMode] = useState('standard'); // standard, reading, side-by-side
  const [fontSize, setFontSize] = useState({
    arabic: 2, // en rem
    translation: 1 // en rem
  });
  const [bookmarkedVerses, setBookmarkedVerses] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [themeMode, setThemeMode] = useState('light'); // light, dark - état local maintenu pour la compatibilité

  useEffect(() => {
    const fetchSuraDetails = async () => {
      try {
        setLoading(true);
        
        // Récupérer les informations de la sourate
        const suraData = await suraService.getSuraByNumber(suraNumber);
        setSura(suraData);
        
        // Récupérer les versets de la sourate
        const versesData = await verseService.getVersesBySura(suraNumber);
        setVerses(versesData);
        
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des détails de la sourate:', err);
        setError('Erreur lors du chargement des données. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchSuraDetails();
  }, [suraNumber]);

  // Fonction utilitaire pour sauvegarder les préférences utilisateur
  const saveUserPreferences = (key, value) => {
    try {
      if (typeof value === 'object') {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        localStorage.setItem(key, value);
      }
      return true;
    } catch (e) {
      console.error(`Erreur lors de la sauvegarde de ${key}:`, e);
      showSnackbar('Erreur lors de la sauvegarde de vos préférences', 'error');
      return false;
    }
  };

  // Fonction utilitaire pour charger les préférences utilisateur
  const loadUserPreferences = () => {
    try {
      // Charger les signets
      const savedBookmarks = localStorage.getItem('bookmarkedVerses');
      if (savedBookmarks) {
        setBookmarkedVerses(JSON.parse(savedBookmarks));
      }
      
      // Charger la taille de police
      const savedFontSize = localStorage.getItem('fontSize');
      if (savedFontSize) {
        setFontSize(JSON.parse(savedFontSize));
      }
      
      // Charger le mode d'affichage
      const savedDisplayMode = localStorage.getItem('displayMode');
      if (savedDisplayMode) {
        setDisplayMode(savedDisplayMode);
      }
      
      // Charger le thème
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setThemeMode(savedTheme);
      }

      // Charger les versets étendus avec analyse mot à mot
      const savedExpandedVerses = localStorage.getItem('expandedVerses');
      if (savedExpandedVerses) {
        setVerseDetailsState(JSON.parse(savedExpandedVerses));
      }
      
      return true;
    } catch (e) {
      console.error('Erreur lors du chargement des préférences utilisateur:', e);
      return false;
    }
  };

  // Charger les préférences utilisateur au chargement
  useEffect(() => {
    loadUserPreferences();
  }, []);

  // Effet pour détecter et naviguer vers un verset spécifique via le fragment d'URL
  useEffect(() => {
    if (!loading && verses.length > 0) {
      // Récupérer le fragment d'URL (le numéro du verset après #)
      const ayaNumber = window.location.hash.replace('#', '');
      
      if (ayaNumber && !isNaN(ayaNumber)) {
        // Trouver l'élément du verset par son ID
        const verseElement = document.getElementById(`verse-${ayaNumber}`);
        
        if (verseElement) {
          // Calculer la page qui contient ce verset
          const verseIndex = verses.findIndex(v => v.aya.toString() === ayaNumber);
          if (verseIndex !== -1) {
            const targetPage = Math.floor(verseIndex / versesPerPage) + 1;
            
            // Changer de page si nécessaire
            if (targetPage !== currentPage) {
              setCurrentPage(targetPage);
            }
            
            // Petit délai pour s'assurer que le DOM est mis à jour
            setTimeout(() => {
              verseElement.scrollIntoView({ behavior: 'smooth' });
              // Ajouter un effet de surbrillance temporaire
              verseElement.classList.add('highlight-verse');
              setTimeout(() => {
                verseElement.classList.remove('highlight-verse');
              }, 2000);
            }, 300);
          }
        }
      }
    }
  }, [loading, verses, currentPage, versesPerPage]);

  // Pagination
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const indexOfLastVerse = currentPage * versesPerPage;
  const indexOfFirstVerse = indexOfLastVerse - versesPerPage;
  const currentVerses = verses.slice(indexOfFirstVerse, indexOfLastVerse);
  const pageCount = Math.ceil(verses.length / versesPerPage);

  // Navigation entre sourates
  const prevSura = Number(suraNumber) > 1 ? Number(suraNumber) - 1 : null;
  const nextSura = Number(suraNumber) < 114 ? Number(suraNumber) + 1 : null;

  // Gérer l'affichage global des détails de mots
  const handleToggleWordDetails = () => {
    setShowWordDetails(!showWordDetails);
    // Si on active globalement, tous les versets sont étendus
    if (!showWordDetails) {
      // Pour activer tous les versets, nous devons appeler toggleVerseWordDetails pour chaque verset
      verses.forEach(verse => {
        if (!isVerseExpanded(verse._id)) {
          toggleVerseWordDetails(verse._id);
        }
      });
    } else {
      // Si on désactive globalement, on réinitialise les versets étendus
      resetExpandedVerses();
    }
  };
  
  // La fonctionnalité de toggle est maintenant gérée par le hook useVerseDetails
  
  // Gestion des signets avec format standardisé 'sura:aya'
  const toggleBookmark = (verse) => {
    // Créer un identifiant standardisé au format 'sura:aya'
    const standardId = `${verse.sura}:${verse.aya}`;
    
    // Vérifier si le verset est déjà dans les favoris avec l'ID standardisé
    const isBookmarked = bookmarkedVerses.includes(standardId);
    
    const newBookmarks = isBookmarked
      ? bookmarkedVerses.filter(id => id !== standardId)
      : [...bookmarkedVerses, standardId];
    
    setBookmarkedVerses(newBookmarks);
    saveUserPreferences('bookmarkedVerses', newBookmarks);
    
    const action = isBookmarked ? 'retiré des' : 'ajouté aux';
    showSnackbar(`Verset ${verse.sura}:${verse.aya} ${action} signets`, 'success');
  };
  
  // Gestion du tiroir latéral
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  // Gestion des onglets
  const handleTabChange = (event, newValue) => {
    setDrawerTab(newValue);
  };
  
  // Gestion de la taille de police
  const changeFontSize = (type, increment) => {
    setFontSize(prev => {
      const newSize = {
        ...prev,
        [type]: Math.max(0.8, Math.min(3.5, prev[type] + increment))
      };
      saveUserPreferences('fontSize', newSize);
      return newSize;
    });
  };
  
  // Gestion du mode d'affichage
  const changeDisplayMode = (mode) => {
    setDisplayMode(mode);
    saveUserPreferences('displayMode', mode);
    showSnackbar(`Mode d'affichage changé: ${mode}`, 'info');
  };
  
  // Gestion du thème
  const toggleTheme = () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    saveUserPreferences('theme', newTheme);
    showSnackbar(`Thème ${newTheme === 'dark' ? 'sombre' : 'clair'} activé`, 'info');
  };
  
  // Gestion du snackbar
  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };
  
  // Partage du verset
  const shareVerse = (verse) => {
    const shareText = `${verse.textAr}\n${verse.textFr}\n(Sourate ${sura.nameSimple}, verset ${verse.aya})`;
    const shareUrl = `${window.location.origin}/sura/${suraNumber}#${verse.aya}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Sourate ${sura.nameSimple}, verset ${verse.aya}`,
        text: shareText,
        url: shareUrl
      }).catch(() => {
        // Fallback en cas d'erreur ou si l'API n'est pas supportée
        copyToClipboard(`${shareText} ${shareUrl}`);
      });
    } else {
      copyToClipboard(`${shareText} ${shareUrl}`);
    }
  };
  
  // Copier dans le presse-papier
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        showSnackbar('Texte copié dans le presse-papier', 'success');
      })
      .catch(() => {
        showSnackbar('Erreur lors de la copie du texte', 'error');
      });
  };

  // Fonction pour naviguer vers un verset spécifique
  const scrollToVerse = (ayaNumber) => {
    const verseElement = document.getElementById(`verse-${ayaNumber}`);
    if (verseElement) {
      verseElement.scrollIntoView({ behavior: 'smooth' });
      // Ajouter un effet de surbrillance temporaire
      verseElement.classList.add('highlight-verse');
      setTimeout(() => {
        verseElement.classList.remove('highlight-verse');
      }, 2000);
    }
  };

  // Fonction pour gérer le changement de taille de police
  const handleFontSizeChange = (type, newValue) => {
    setFontSize(prev => {
      const newSize = {
        ...prev,
        [type]: newValue
      };
      localStorage.setItem('fontSize', JSON.stringify(newSize));
      return newSize;
    });
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: muiTheme.palette.mode === 'dark' ? 'grey.900' : 'background.default',
      color: muiTheme.palette.mode === 'dark' ? 'white' : 'text.primary',
      position: 'relative'
    }}>
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
      
      {/* SpeedDial pour actions rapides */}
      <SpeedDial
        ariaLabel="Actions rapides"
        sx={{ 
          position: 'fixed',
          bottom: 16,
          right: 16 
        }}
        icon={<SpeedDialIcon />}
        onClose={() => setIsMenuOpen(false)}
        onOpen={() => setIsMenuOpen(true)}
        open={isMenuOpen}
      >
        <SpeedDialAction
          icon={muiTheme.palette.mode === 'dark' ? <LightModeIcon /> : <NightlightIcon />}
          tooltipTitle={muiTheme.palette.mode === 'dark' ? "Mode clair" : "Mode sombre"}
          onClick={toggleTheme}
        />
        <SpeedDialAction
          icon={<TextIncreaseIcon />}
          tooltipTitle="Taille de texte"
          onClick={() => changeFontSize('arabic', 0.1)}
        />
        <SpeedDialAction
          icon={<TextDecreaseIcon />}
          tooltipTitle="Diminuer la taille du texte"
          onClick={() => changeFontSize('arabic', -0.1)}
        />
        <SpeedDialAction
          icon={<TableRowsIcon />}
          tooltipTitle="Afficher le sommaire"
          onClick={toggleDrawer}
        />
      </SpeedDial>
      
      {/* Tiroir latéral pour navigation et options */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': { 
            width: { xs: '80%', sm: '350px' }, 
            boxSizing: 'border-box',
            bgcolor: muiTheme.palette.mode === 'dark' ? 'grey.900' : 'background.paper',
            color: muiTheme.palette.mode === 'dark' ? 'white' : 'text.primary',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {sura ? sura.nameTranslated : 'Navigation'}
          </Typography>
          <IconButton onClick={toggleDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>
          
        <Tabs value={drawerTab} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Navigation" />
          <Tab label="Signets" />
          <Tab label="Options" />
        </Tabs>
          
        {drawerTab === 0 && (
          <Box sx={{ p: 2, height: 'calc(100vh - 128px)', overflow: 'auto' }}>
            <Typography variant="subtitle1" gutterBottom>
              Navigation par groupe de 10 versets
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={1}>
              {verses.length > 0 && Array.from({ length: Math.ceil(verses.length / 10) }, (_, i) => i + 1).map((group) => (
                <Grid item xs={4} sm={4} key={group}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      const versePage = Math.ceil((group * 10) / versesPerPage);
                      setCurrentPage(versePage);
                      setDrawerOpen(false);
                      scrollToVerse(group * 10 - 9);
                    }}
                    sx={{ width: '100%', mb: 1 }}
                  >
                    {(group - 1) * 10 + 1}-{Math.min(group * 10, verses.length)}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Onglet Signets */}
        {drawerTab === 1 && (
          <Box sx={{ p: 2, height: 'calc(100vh - 128px)', overflow: 'auto' }}>
            <Typography variant="subtitle1" gutterBottom>
              Versets sauvegardés
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {bookmarkedVerses.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                Aucun signet enregistré.
              </Typography>
            ) : (
              <List>
                {verses
                  .filter(verse => bookmarkedVerses.includes(verse._id))
                  .map(verse => (
                    <ListItem key={verse._id} disablePadding>
                      <ListItemButton onClick={() => {
                        scrollToVerse(verse.aya);
                        setDrawerOpen(false);
                      }}>
                        <ListItemText 
                          primary={`${sura.number}:${verse.aya}`}
                          secondary={verse.textFr.length > 60 ? `${verse.textFr.substring(0, 60)}...` : verse.textFr}
                        />
                        <IconButton edge="end" onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(verse);
                        }}>
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </ListItemButton>
                    </ListItem>
                  ))}
              </List>
            )}
          </Box>
        )}

        {/* Onglet Options */}
        {drawerTab === 2 && (
          <Box sx={{ p: 2, height: 'calc(100vh - 128px)', overflow: 'auto' }}>
            <Typography variant="subtitle1" gutterBottom>
              Options d'affichage
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Mode d'affichage
            </Typography>
            <ToggleButtonGroup
              value={displayMode}
              exclusive
              onChange={(e, newMode) => {
                if (newMode !== null) changeDisplayMode(newMode);
              }}
              aria-label="Mode d'affichage"
              fullWidth
              sx={{ mb: 3 }}
            >
              <ToggleButton value="standard" aria-label="standard">
                <ViewAgendaIcon sx={{ mr: 1 }} /> Standard
              </ToggleButton>
              <ToggleButton value="reading" aria-label="lecture">
                <MenuBookIcon sx={{ mr: 1 }} /> Lecture
              </ToggleButton>
              <ToggleButton value="side-by-side" aria-label="côte à côte">
                <ViewColumnIcon sx={{ mr: 1 }} /> Côte à côte
              </ToggleButton>
            </ToggleButtonGroup>
            
            <Typography variant="subtitle2" gutterBottom>
              Taille du texte arabe
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextDecreaseIcon color="action" />
              <Slider
                value={fontSize.arabic}
                onChange={(e, newValue) => handleFontSizeChange('arabic', newValue)}
                min={1.2}
                max={3.5}
                step={0.1}
                valueLabelDisplay="auto"
                sx={{ mx: 2 }}
              />
              <TextIncreaseIcon color="action" />
            </Box>
            
            <Typography variant="subtitle2" gutterBottom>
              Taille de la traduction
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TextDecreaseIcon color="action" />
              <Slider
                value={fontSize.translation}
                onChange={(e, newValue) => handleFontSizeChange('translation', newValue)}
                min={0.8}
                max={2}
                step={0.1}
                valueLabelDisplay="auto"
                sx={{ mx: 2 }}
              />
              <TextIncreaseIcon color="action" />
            </Box>
            
            <FormControlLabel
              control={
                <Switch 
                  checked={showWordDetails} 
                  onChange={handleToggleWordDetails}
                />
              }
              label="Analyse mot par mot"
            />
          </Box>
        )}
      </Drawer>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : sura ? (
          <>
            {/* En-tête de la sourate */}
            <Paper sx={{ 
              p: 3, 
              mb: 4, 
              bgcolor: muiTheme.palette.mode === 'dark' ? 'grey.800' : 'background.paper',
              boxShadow: muiTheme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.5)' : undefined,
              position: 'relative'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Button
                  startIcon={<ArrowBackIcon />}
                  component={RouterLink}
                  to="/suras"
                  variant="outlined"
                  size="small"
                  sx={{ color: muiTheme.palette.mode === 'dark' ? 'common.white' : 'primary.main' }}
                >
                  Retour aux sourates
                </Button>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton 
                    onClick={toggleTheme} 
                    size="small"
                    color={muiTheme.palette.mode === 'dark' ? 'inherit' : 'default'}
                    sx={{ mr: 1 }}
                  >
                    {muiTheme.palette.mode === 'dark' ? <LightModeIcon /> : <NightlightIcon />}
                  </IconButton>
                  
                  <IconButton 
                    onClick={toggleDrawer} 
                    size="small" 
                    color="primary"
                  >
                    <MenuBookIcon />
                  </IconButton>
                </Box>
              </Box>
              
              <Fade in={true} timeout={800}>
                <Box>
                  <Typography variant="h4" component="h1" align="center">
                    Sourate {sura.number}. {sura.nameSimple}
                  </Typography>
                  
                  <Typography variant="h3" component="div" align="center" sx={{ 
                    my: 2, 
                    fontFamily: '"Noto Naskh Arabic", sans-serif',
                    fontSize: { xs: '2rem', md: '3rem' } 
                  }}>
                    {sura.nameArabic}
                  </Typography>
                  
                  <Typography variant="h6" component="div" align="center" gutterBottom>
                    {sura.nameTranslated}
                  </Typography>
                </Box>
              </Fade>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
                <Chip 
                  label={sura.revelationPlace === 'makkah' ? 'Révélée à la Mecque' : 'Révélée à Médine'} 
                  color={sura.revelationPlace === 'makkah' ? 'primary' : 'secondary'} 
                />
                <Chip label={`${sura.verseCount} versets`} variant="outlined" />
                <Chip label={`Ordre de révélation: ${sura.revelationOrder}`} variant="outlined" />
                <Chip label={`Pages ${sura.pageStart} - ${sura.pageEnd}`} variant="outlined" />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 2 }}>
                {prevSura && (
                  <Button
                    startIcon={<ArrowBackIcon />}
                    component={RouterLink}
                    to={`/sura/${prevSura}`}
                    variant="contained"
                    size="small"
                  >
                    Sourate précédente
                  </Button>
                )}
                
                {nextSura && (
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    component={RouterLink}
                    to={`/sura/${nextSura}`}
                    variant="contained"
                    size="small"
                  >
                    Sourate suivante
                  </Button>
                )}
              </Box>
            </Paper>
          
          {/* Bismillah */}
          {sura.bismillahPre && sura.number !== 1 && (
            <Typography 
              variant="h5" 
              component="div" 
              align="center" 
              sx={{ 
                mb: 4, 
                fontFamily: '"Noto Naskh Arabic", sans-serif',
                color: theme => theme.palette.text.secondary
              }}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </Typography>
          )}
          
          {/* Liste des versets */}
          {currentVerses.map((verse) => (
            <Zoom in={true} key={verse._id} style={{ transitionDelay: '100ms' }}>
              <Box id={`verse-${verse.aya}`}>
                <VerseCard
                  verse={{
                    ...verse,
                    suraName: sura.name,
                    suraNameFr: sura.nameFr || sura.nameTranslated
                  }}
                  showActions={true}
                  showDetails={expandedVerses.includes(verse._id)}
                  isBookmarked={bookmarkedVerses.includes(`${verse.sura}:${verse.aya}`)}
                  onToggleBookmark={() => toggleBookmark(verse)}
                  onToggleDetails={() => toggleVerseWordDetails(verse._id)}
                  onShare={() => shareVerse(verse)}
                  theme={muiTheme.palette.mode}
                  fontSize={fontSize}
                  displayMode={displayMode}
                  showContextButton={false}
                />
              </Box>
            </Zoom>
          ))}
          
          {/* Pagination */}
          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <Pagination 
                count={pageCount} 
                page={currentPage} 
                onChange={handlePageChange} 
                color="primary" 
                showFirstButton 
                showLastButton
              />
            </Box>
          )}
        </>
      ) : (
        <Typography variant="h6" align="center">
          Sourate non trouvée
        </Typography>
      )}
    </Container>
  </Box>
  );
};

export default SuraDetailPage;

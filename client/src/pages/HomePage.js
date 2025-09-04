import React, { useState, useEffect } from 'react';
import {
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Paper,
  useTheme,
  alpha,
  Fade,
  Chip,
  CircularProgress
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import LanguageIcon from '@mui/icons-material/Language';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import verseService from '../api/verseService';
// Import des styles de cartes personnalisés
import {
  accentTopCard,
  quoteStyle,
  sectionTitle,
  actionButton
} from '../components/common/CardStyles';

const HomePage = () => {
  const theme = useTheme();
  
  // État pour stocker le verset aléatoire
  const [randomVerse, setRandomVerse] = useState({
    sura: 48,
    aya: 23,
    textAr: "سُنَّةَ ٱللَّهِ ٱلَّتِى قَدْ خَلَتْ مِن قَبْلُ ۖ وَلَن تَجِدَ لِسُنَّةِ ٱللَّهِ تَبْدِيلًا",
    textFr: "Telle est la règle d'Allah établie depuis toujours. Et tu ne saurais trouver changement à la règle d'Allah."
  });
  const [loading, setLoading] = useState(false);
  
  // Charger un verset aléatoire au chargement de la page
  useEffect(() => {
    const fetchRandomVerse = async () => {
      setLoading(true);
      try {
        const verse = await verseService.getRandomVerse();
        setRandomVerse(verse);
      } catch (error) {
        console.error("Erreur lors du chargement du verset aléatoire:", error);
        // Le verset par défaut reste en place en cas d'erreur
      } finally {
        setLoading(false);
      }
    };
    
    fetchRandomVerse();
  }, []);
  
  return (
    <Box>
      {/* Section héro avec design amélioré */}
      <Paper
        sx={{
          position: 'relative',
          color: '#fff',
          mb: 6,
          borderRadius: 0,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `url(/hero-bg.jpg)`,
          py: { xs: 8, md: 12 },
          boxShadow: 'none',
          overflow: 'hidden'
        }}
      >
        {/* Overlay avec gradient */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            background: `linear-gradient(45deg, ${alpha(theme.palette.primary.dark, 0.9)}, ${alpha(theme.palette.primary.main, 0.65)} 70%, ${alpha(theme.palette.secondary.dark, 0.5)})`
          }}
        />
        
        {/* Motif géométrique subtil - remplacé par une classe CSS */}
        <Box
          className="geometric-pattern"
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            zIndex: 1
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Fade in={true} timeout={1000}>
            <Box>
              {/* Section de titre */}
              <Box sx={{ textAlign: 'center', mb: 5 }} className="islamic-border">
                {/* Espace réservé pour éléments décoratifs si nécessaire */}
              </Box>
              
              <Typography 
                variant="h5" 
                align="center" 
                color="inherit" 
                paragraph
                sx={{ 
                  maxWidth: '800px',
                  mx: 'auto',
                  lineHeight: 1.6,
                  mb: 4,
                  px: 2,
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                Explorez, analysez et découvrez le Coran à travers une interface moderne et intuitive.
                Recherche avancée, analyse linguistique et navigation facile.
              </Typography>
              
              {/* Boutons d'action avec meilleur design */}
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                justifyContent: 'center', 
                gap: 2,
                mt: 5 
              }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  component={RouterLink}
                  to="/suras"
                  startIcon={<MenuBookIcon />}
                  sx={{
                    ...actionButton(theme),
                    px: 3,
                    py: 1.5,
                    fontSize: '1.1rem'
                  }}
                >
                  Explorer les sourates
                </Button>
                
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  component={RouterLink}
                  to="/search"
                  startIcon={<SearchIcon />}
                  sx={{
                    ...actionButton(theme),
                    px: 3,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Recherche avancée
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Paper>

      {/* Séparateur décoratif avec motif calligraphique */}
      <Box className={theme.palette.mode === 'dark' ? 'calligraphy-divider calligraphy-divider--dark' : 'calligraphy-divider'} sx={{ my: 5, width: '100%' }} />
      
      {/* Fonctionnalités principales avec design amélioré */}
      <Container maxWidth="lg" sx={{ width: '100%' }}>
        <Typography 
          variant="h4" 
          component="h2" 
          align="center"
          sx={{ ...sectionTitle(theme), textAlign: 'center', '&::after': { left: '50%', transform: 'translateX(-50%)' } }}
        >
          Fonctionnalités principales
        </Typography>

        <Box sx={{ 
          mt: 4, 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          flexWrap: 'wrap',
          justifyContent: 'space-between'
        }}>
          {/* Première carte: Navigation par sourate */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            width: { xs: '100%', md: '23%' },
            minWidth: 0
          }}>
            <Card sx={{ 
              ...accentTopCard(theme),
              width: '100%',
              height: '100%',
              display: 'flex', 
              flexDirection: 'column',
            }} className="corner-decoration">
              <CardContent sx={{ p: 3, pb: 1, flexGrow: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 3,
                  color: theme.palette.primary.main 
                }}>
                  <MenuBookIcon sx={{ 
                    fontSize: 50,
                    padding: 1,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.primary.main, 0.1)
                  }} />
                </Box>
                <Typography variant="h5" component="div" align="center" gutterBottom sx={{ fontWeight: 500 }}>
                  Navigation par sourate
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                  Parcourez les 114 sourates du Coran avec une interface claire et intuitive.
                  Accédez facilement aux versets et à leurs traductions.
                </Typography>
              </CardContent>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                px: 3,
                pb: 3,
                mt: 'auto',
                '& .MuiButton-root': {
                  borderRadius: 4,
                  transition: 'all 0.2s ease',
                  fontWeight: 500,
                }
              }}>
                <Button 
                  component={RouterLink} 
                  to="/suras" 
                  variant="outlined" 
                  color="primary"
                  endIcon={<BookmarkIcon />}
                  sx={{ 
                    width: '100%',
                    '&:hover': { 
                      backgroundColor: alpha(theme.palette.primary.main, 0.08)
                    } 
                  }}
                >
                  Explorer les sourates
                </Button>
              </Box>
            </Card>
          </Box>

          {/* Deuxième carte: Recherche avancée */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            width: { xs: '100%', md: '23%' },
            minWidth: 0
          }}>
            <Card sx={{ 
              ...accentTopCard(theme),
              width: '100%',
              height: '100%',
              display: 'flex', 
              flexDirection: 'column',
              borderTopColor: theme.palette.secondary.main,
              transform: 'translateY(-8px)',
              boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                transform: 'translateY(-12px)',
              }
            }} className="corner-decoration">
              <CardContent sx={{ p: 3, pb: 1, flexGrow: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 3,
                  color: theme.palette.secondary.main
                }}>
                  <SearchIcon sx={{ 
                    fontSize: 50,
                    padding: 1,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.secondary.main, 0.1)
                  }} />
                </Box>
                <Typography variant="h5" component="div" align="center" gutterBottom sx={{ fontWeight: 500 }}>
                  Recherche avancée
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                  Recherchez des mots ou des phrases en arabe ou en français.
                  Filtrez par sourate, lieu de révélation et plus encore.
                </Typography>
              </CardContent>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                px: 3,
                pb: 3,
                mt: 'auto'
              }}>
                <Button 
                  component={RouterLink} 
                  to="/search" 
                  variant="contained" 
                  color="secondary"
                  endIcon={<SearchIcon />}
                  sx={{ 
                    width: '100%',
                    boxShadow: '0 4px 8px rgba(212, 175, 55, 0.3)'
                  }}
                >
                  Accéder à la recherche
                </Button>
              </Box>
            </Card>
          </Box>

          {/* Troisième carte: Analyse linguistique */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            width: { xs: '100%', md: '23%' },
            minWidth: 0
          }}>
            <Card sx={{ 
              ...accentTopCard(theme),
              width: '100%',
              height: '100%',
              display: 'flex', 
              flexDirection: 'column',
            }} className="corner-decoration">
              <CardContent sx={{ p: 3, pb: 1, flexGrow: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 3,
                  color: theme.palette.primary.main
                }}>
                  <LanguageIcon sx={{ 
                    fontSize: 50,
                    padding: 1,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.primary.main, 0.1)
                  }} />
                </Box>
                <Typography variant="h5" component="div" align="center" gutterBottom sx={{ fontWeight: 500 }}>
                  Analyse linguistique
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                  Explorez les racines des mots arabes et leurs occurrences dans le texte.
                  Découvrez des connexions linguistiques et thématiques.
                </Typography>
              </CardContent>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                px: 3,
                pb: 3,
                mt: 'auto'
              }}>
                <Button 
                  component={RouterLink} 
                  to="/search?mode=root" 
                  variant="outlined"
                  color="primary"
                  endIcon={<TravelExploreIcon />}
                  sx={{ 
                    width: '100%',
                    '&:hover': { 
                      backgroundColor: alpha(theme.palette.primary.main, 0.08)
                    } 
                  }}
                >
                  Explorer les racines
                </Button>
              </Box>
            </Card>
          </Box>
          
          {/* Quatrième carte: Favorie */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            width: { xs: '100%', md: '23%' },
            minWidth: 0
          }}>
            <Card sx={{ 
              ...accentTopCard(theme),
              width: '100%',
              height: '100%',
              display: 'flex', 
              flexDirection: 'column',
              borderTopColor: theme.palette.secondary.dark,
            }} className="corner-decoration">
              <CardContent sx={{ p: 3, pb: 1, flexGrow: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 3,
                  color: theme.palette.secondary.dark
                }}>
                  <BookmarkIcon sx={{ 
                    fontSize: 50,
                    padding: 1,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.secondary.dark, 0.1)
                  }} />
                </Box>
                <Typography variant="h5" component="div" align="center" gutterBottom sx={{ fontWeight: 500 }}>
                  Favorie
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                  Accédez rapidement à tous vos versets favoris et signets enregistrés.
                  Retrouvez facilement les passages que vous avez marqués.
                </Typography>
              </CardContent>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                px: 3,
                pb: 3,
                mt: 'auto'
              }}>
                <Button 
                  component={RouterLink} 
                  to="/bookmarks" 
                  variant="outlined"
                  color="secondary"
                  endIcon={<BookmarkIcon />}
                  sx={{ 
                    width: '100%',
                    '&:hover': { 
                      backgroundColor: alpha(theme.palette.secondary.main, 0.08)
                    } 
                  }}
                >
                  Accéder aux favoris
                </Button>
              </Box>
            </Card>
          </Box>
        </Box>
        
        {/* Citation du jour avec style amélioré */}
        <Box sx={{ my: 8 }}>
          <Fade in={true} timeout={800}>
            <Paper sx={{ 
              ...quoteStyle(theme),
              p: { xs: 3, md: 5 }, 
              position: 'relative',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderRadius: 2,
              overflow: 'hidden',
            }} className={theme.palette.mode === 'dark' ? 'arabesque-pattern arabesque-pattern--dark' : 'arabesque-pattern'}>
              {/* Utilisation du motif via la classe CSS au lieu d'une image */}

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={1}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    color: theme.palette.secondary.main
                  }}>
                    <FormatQuoteIcon sx={{ 
                      fontSize: { xs: 60, md: 70 },
                      opacity: 0.7,
                      transform: 'rotate(180deg)' 
                    }} />
                  </Box>
                </Grid>
                <Grid item xs={12} md={11}>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                      <CircularProgress size={40} color="secondary" />
                    </Box>
                  ) : (
                    <>
                      <Box className="verse-text" sx={{ 
                        p: 2, 
                        borderRadius: 1
                      }}>
                        <Typography 
                          className="arabic-text" 
                          variant="h4" 
                          gutterBottom 
                          sx={{ 
                            fontWeight: 'bold',
                            lineHeight: 2.2,
                            mb: 3,
                            color: theme.palette.primary.main
                          }}
                        >
                          {randomVerse.textAr}
                        </Typography>
                        <Typography variant="h6" paragraph sx={{ 
                          fontStyle: 'italic',
                          mb: 3,
                          color: theme.palette.text.primary,
                          fontWeight: 400,
                          lineHeight: 1.6
                        }}>
                          {randomVerse.textFr}
                        </Typography>
                      </Box>
                    </>
                  )}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Chip 
                        component={RouterLink}
                        to={`/sura/${randomVerse.sura}#${randomVerse.aya}`}
                        label={`${randomVerse.suraName || ''} (${randomVerse.sura})`}
                        color="primary" 
                        size="small" 
                        variant="outlined"
                        sx={{ 
                          mr: 1, 
                          fontWeight: 500, 
                          direction: 'rtl',
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.1)
                          }
                        }}
                        clickable
                      />
                      <Chip 
                        component={RouterLink}
                        to={`/sura/${randomVerse.sura}#${randomVerse.aya}`}
                        label={`Sourate ${randomVerse.suraNameFr || ''} ${randomVerse.sura} verset ${randomVerse.aya}`}
                        color="secondary" 
                        size="small" 
                        variant="outlined"
                        sx={{ 
                          mr: 1, 
                          fontWeight: 500,
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.secondary.main, 0.1)
                          }
                        }}
                        clickable
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Fade>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;

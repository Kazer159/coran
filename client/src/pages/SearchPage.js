import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  Card,
  CardContent,
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

// Fonction pour extraire les paramètres de recherche de l'URL
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchPage = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extraire les paramètres de recherche de l'URL
  const initialSearchTerm = query.get('q') || '';
  const initialSearchMode = query.get('mode') || 'text';
  const initialLanguage = query.get('lang') || 'all';
  const initialSura = query.get('sura') || '';
  const initialAya = query.get('aya') || '';
  
  // États pour les paramètres de recherche
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
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
  // Ce useEffect est délibérément configuré pour ne réagir qu'aux changements de l'URL
  // et non aux changements des valeurs initialSearchTerm, initialSura, initialAya
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (initialSearchTerm || (initialSura && initialAya)) {
      performSearch();
    }
  }, [location.search]);
  
  /* Note: Nous utilisons eslint-disable pour ce useEffect car nous voulons
     délibérément que la recherche ne se déclenche que lorsque l'URL change,
     et non lorsque les valeurs initiales ou la fonction performSearch changent */
  
  const performSearch = async () => {
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
        
        setResults(response.occurrences);
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
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    
    // Construction des paramètres de recherche pour l'URL
    const searchParams = new URLSearchParams();
    
    if (searchMode === 'text' || searchMode === 'root') {
      searchParams.set('q', searchTerm);
      searchParams.set('mode', searchMode);
      
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
          
          {results.map((result, index) => (
            <Card key={index} sx={{ mb: 3 }}>
              <CardContent>
                {/* Pour les résultats de recherche de texte */}
                {searchMode === 'text' && (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Chip 
                        label={`${result.sura}:${result.aya}`} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    </Box>
                    
                    <Typography 
                      paragraph 
                      align="right" 
                      sx={{ 
                        fontFamily: '"Noto Naskh Arabic", sans-serif',
                        fontSize: { xs: '1.5rem', md: '2rem' },
                        lineHeight: 1.8,
                        mt: 2,
                        direction: 'rtl'
                      }}
                    >
                      {result.textAr}
                    </Typography>
                    
                    <Typography paragraph>
                      {result.textFr}
                    </Typography>
                  </>
                )}
                
                {/* Pour les résultats de recherche par racine */}
                {searchMode === 'root' && (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Chip 
                        label={`${result.sura}:${result.aya}`} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                      <Chip 
                        label={`Racine: ${result.root}`} 
                        size="small" 
                        color="secondary" 
                      />
                    </Box>
                    
                    <Typography 
                      paragraph 
                      align="right" 
                      sx={{ 
                        fontFamily: '"Noto Naskh Arabic", sans-serif',
                        fontSize: { xs: '1.5rem', md: '2rem' },
                        lineHeight: 1.8,
                        mt: 2,
                        direction: 'rtl'
                      }}
                    >
                      {result.verseTextAr}
                      
                      {result.segment && (
                        <Box component="span" sx={{ 
                          color: 'primary.main', 
                          fontWeight: 'bold',
                          mx: 1
                        }}>
                          {` ${result.segment.ar} `}
                        </Box>
                      )}
                    </Typography>
                    
                    <Typography paragraph>
                      {result.verseTextFr}
                    </Typography>
                    
                    {result.segment && (
                      <Box sx={{
                        p: 2,
                        backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                        borderRadius: 1
                      }}>
                        <Typography variant="subtitle2" gutterBottom>
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
                              <strong>Translittération:</strong> {result.segment.tl}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="body2">
                              <strong>Traduction:</strong> {result.segment.en}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </>
                )}
                
                {/* Pour les résultats de recherche par référence */}
                {searchMode === 'reference' && (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Chip 
                        label={`${result.sura}:${result.aya}`} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    </Box>
                    
                    <Typography 
                      paragraph 
                      align="right" 
                      sx={{ 
                        fontFamily: '"Noto Naskh Arabic", sans-serif',
                        fontSize: { xs: '1.5rem', md: '2rem' },
                        lineHeight: 1.8,
                        mt: 2,
                        direction: 'rtl'
                      }}
                    >
                      {result.textAr}
                    </Typography>
                    
                    <Typography 
                      paragraph 
                      align="left" 
                      sx={{ 
                        fontStyle: 'italic',
                        fontSize: '0.9rem',
                        color: theme => theme.palette.text.secondary
                      }}
                    >
                      {result.textTl}
                    </Typography>
                    
                    <Typography paragraph>
                      {result.textFr}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
          
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

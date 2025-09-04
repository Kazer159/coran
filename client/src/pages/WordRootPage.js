import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Pagination,
  Grid,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import wordService from '../api/wordService';

const WordRootPage = () => {
  const { root } = useParams();
  const [occurrences, setOccurrences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  
  useEffect(() => {
    const fetchWordOccurrences = async () => {
      try {
        setLoading(true);
        const response = await wordService.getWordOccurrencesWithContext(
          root,
          currentPage,
          10
        );
        
        setOccurrences(response.occurrences);
        setTotalPages(response.totalPages);
        setTotalResults(response.totalResults);
        setError(null);
      } catch (err) {
        console.error(`Erreur lors de la récupération des occurrences de la racine "${root}":`, err);
        if (err.response && err.response.status === 404) {
          setError(`Aucune occurrence trouvée pour la racine "${root}".`);
        } else {
          setError('Erreur lors du chargement des données. Veuillez réessayer plus tard.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWordOccurrences();
  }, [root, currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            component={RouterLink}
            to="/search?mode=root"
            variant="outlined"
            size="small"
          >
            Retour à la recherche
          </Button>
        </Box>
        
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Racine: <span style={{ fontFamily: '"Noto Naskh Arabic", sans-serif' }}>{root}</span>
        </Typography>
        
        {!loading && !error && (
          <Typography variant="subtitle1" align="center">
            {totalResults} occurrence{totalResults > 1 ? 's' : ''} trouvée{totalResults > 1 ? 's' : ''}
          </Typography>
        )}
      </Paper>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <>
          {occurrences.map((occurrence, index) => (
            <Card key={index} sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Chip 
                    label={`${occurrence.sura}:${occurrence.aya}`} 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                    component={RouterLink}
                    to={`/sura/${occurrence.sura}#${occurrence.aya}`}
                    clickable
                  />
                </Box>
                
                {/* Texte arabe du verset */}
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
                  {occurrence.verseTextAr}
                </Typography>
                
                {/* Traduction française */}
                <Typography paragraph>
                  {occurrence.verseTextFr}
                </Typography>
                
                {/* Détails du mot */}
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{
                  p: 2,
                  backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  borderRadius: 1
                }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Détails du mot:
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4} md={3}>
                      <Typography variant="body2">
                        <strong>Position:</strong> {occurrence.position}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={8} md={9}>
                      <Typography variant="body2">
                        <strong>Mot arabe:</strong>{' '}
                        <span style={{ fontFamily: '"Noto Naskh Arabic", sans-serif', fontSize: '1.2rem' }}>
                          {occurrence.segment ? occurrence.segment.ar : ''}
                        </span>
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2">
                        <strong>Translittération:</strong> {occurrence.segment ? occurrence.segment.tl : ''}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2">
                        <strong>Traduction:</strong> {occurrence.segment ? occurrence.segment.en : ''}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
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
      )}
    </Container>
  );
};

export default WordRootPage;

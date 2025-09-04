import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  CardActionArea,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Chip,
  Divider,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import suraService from '../api/suraService';

const SuraListPage = () => {
  const [suras, setSuras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('number');
  const [filterPlace, setFilterPlace] = useState('all');

  useEffect(() => {
    const fetchSuras = async () => {
      try {
        setLoading(true);
        let data;
        
        if (sortOrder === 'revelation') {
          data = await suraService.getSurasByRevelationOrder();
        } else {
          data = await suraService.getAllSuras();
        }
        
        setSuras(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des sourates:', err);
        setError('Erreur lors du chargement des sourates. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchSuras();
  }, [sortOrder]);

  // Filtrage des sourates en fonction de la recherche et du lieu de révélation
  const filteredSuras = suras.filter(sura => {
    const matchesSearchTerm = 
      sura.nameArabic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sura.nameSimple.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sura.nameTranslated.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(sura.number).includes(searchTerm);
    
    const matchesPlace = 
      filterPlace === 'all' || 
      sura.revelationPlace.toLowerCase() === filterPlace.toLowerCase();
    
    return matchesSearchTerm && matchesPlace;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e, newValue) => {
    if (newValue !== null) {
      setSortOrder(newValue);
    }
  };

  const handlePlaceChange = (e) => {
    setFilterPlace(e.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Liste des Sourates
      </Typography>
      
      {/* Filtres et tris */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <TextField
          label="Rechercher"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="filter-place-label">Lieu</InputLabel>
          <Select
            labelId="filter-place-label"
            id="filter-place"
            value={filterPlace}
            onChange={handlePlaceChange}
            label="Lieu"
          >
            <MenuItem value="all">Tous</MenuItem>
            <MenuItem value="makkah">Mecque</MenuItem>
            <MenuItem value="madinah">Médine</MenuItem>
          </Select>
        </FormControl>
        
        <ToggleButtonGroup
          value={sortOrder}
          exclusive
          onChange={handleSortChange}
          aria-label="ordre de tri"
          size="small"
        >
          <ToggleButton value="number" aria-label="ordre numérique">
            Ordre coranique
          </ToggleButton>
          <ToggleButton value="revelation" aria-label="ordre de révélation">
            Ordre de révélation
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : (
        <Box sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'flex-start'
        }}>
          {filteredSuras.map((sura) => (
            <Box 
              key={sura._id} 
              sx={{ 
                width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)' },
                display: 'flex',
                minWidth: 0
              }}
            >
              <Card sx={{ width: '100%', height: '100%' }}>
                <CardActionArea 
                  component={RouterLink} 
                  to={`/sura/${sura.number}`}
                  sx={{ height: '100%' }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h5" component="div" align="left">
                        {sura.number}. {sura.nameSimple}
                      </Typography>
                      <Chip 
                        size="small" 
                        label={sura.revelationPlace === 'makkah' ? 'Mecque' : 'Médine'}
                        color={sura.revelationPlace === 'makkah' ? 'primary' : 'secondary'}
                      />
                    </Box>
                    
                    <Typography variant="h6" component="div" align="center" sx={{ my: 2, fontFamily: '"Noto Naskh Arabic", sans-serif', fontSize: '1.5rem' }}>
                      {sura.nameArabic}
                    </Typography>
                    
                    <Typography color="text.secondary">
                      {sura.nameTranslated}
                    </Typography>
                    
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {sura.verseCount} versets
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ordre de révélation: {sura.revelationOrder}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          ))}
        </Box>
      )}
      
      {filteredSuras.length === 0 && !loading && !error && (
        <Typography align="center" sx={{ py: 4 }}>
          Aucune sourate ne correspond à votre recherche.
        </Typography>
      )}
    </Container>
  );
};

export default SuraListPage;

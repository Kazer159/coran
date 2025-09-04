import React from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

const NotFoundPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Page non trouvée
        </Typography>
        <Typography variant="body1" paragraph>
          La page que vous recherchez n'existe pas ou a été déplacée.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            color="primary"
            startIcon={<HomeIcon />}
            size="large"
          >
            Retour à l'accueil
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFoundPage;

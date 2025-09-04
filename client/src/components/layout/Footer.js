import React from 'react';
import { Box, Container, Typography, Link, Divider } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ 
      py: 3, 
      mt: 'auto',
      backgroundColor: (theme) => theme.palette.mode === 'light' 
        ? theme.palette.grey[200] 
        : theme.palette.grey[800] 
    }}>
      <Container maxWidth="lg">
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            {new Date().getFullYear()}
            {' '}
            <Link color="inherit" href="/">
              Coran Explorer
            </Link>
            {' - Application d\'étude du Coran'}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            mt: { xs: 2, sm: 0 } 
          }}>
            <Link href="#" color="inherit" sx={{ mx: 1 }}>
              À propos
            </Link>
            <Link href="#" color="inherit" sx={{ mx: 1 }}>
              Contact
            </Link>
            <Link href="#" color="inherit" sx={{ mx: 1 }}>
              Confidentialité
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

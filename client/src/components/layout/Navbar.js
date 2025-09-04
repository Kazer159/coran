import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  Switch,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fade,
  Divider,
  Tooltip
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LanguageIcon from '@mui/icons-material/Language';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Logo text avec style calligraphique
  const logoText = "قرآن";
  
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Accueil', icon: <HomeIcon />, path: '/' },
    { text: 'Sourates', icon: <MenuBookIcon />, path: '/suras' },
    { text: 'Favoris', icon: <BookmarkIcon />, path: '/bookmarks' },
    { text: 'Recherche', icon: <SearchIcon />, path: '/search' },
    { text: 'Langue', icon: <LanguageIcon />, path: '/language' }
  ];

  // Vérifier si un menu item est actif
  const isActive = (path) => location.pathname === path;

  const drawer = (
    <Box
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      sx={{
        width: 280,
        '& .MuiListItem-root': {
          transition: 'background-color 0.3s ease, color 0.3s ease',
        },
        '& .MuiListItemIcon-root': {
          color: 'inherit',
          transition: 'color 0.3s ease',
        }
      }}
    >
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Typography 
          variant="h5" 
          className="arabic-text" 
          sx={{ 
            color: theme.palette.primary.main, 
            fontWeight: 'bold',
            fontSize: '2rem'
          }}
        >
          {logoText}
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            ml: 1.5,
            fontWeight: 'bold',
            color: theme.palette.secondary.main
          }}
        >
          Explorer
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItem 
              button 
              component={RouterLink} 
              to={item.path} 
              key={item.text}
              selected={active}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 1,
                color: active ? theme.palette.primary.main : 'inherit',
                backgroundColor: active ? 
                  (theme.palette.mode === 'dark' ? 'rgba(0, 105, 92, 0.2)' : 'rgba(0, 105, 92, 0.1)') : 
                  'transparent',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' ? 
                    'rgba(0, 105, 92, 0.3)' : 
                    'rgba(0, 105, 92, 0.15)'
                }
              }}
            >
              <ListItemIcon sx={{ color: active ? theme.palette.primary.main : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontWeight: active ? 'bold' : 'regular',
                }}
              />
            </ListItem>
          );
        })}
        <Divider sx={{ my: 1.5 }} />
        <ListItem sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ListItemIcon>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </ListItemIcon>
            <Typography variant="body2">
              {darkMode ? 'Mode clair' : 'Mode sombre'}
            </Typography>
          </Box>
          <Switch
            checked={darkMode}
            onChange={toggleDarkMode}
            color="primary"
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      elevation={darkMode ? 2 : 1}
      sx={{
        background: darkMode 
          ? 'linear-gradient(to right, #00695c, #004d40)'
          : 'linear-gradient(to right, #00695c, #439889)',
        transition: 'background 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <Toolbar sx={{ py: 0.5 }}>
        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ 
                mr: 1,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'rotate(180deg)' },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  borderTopRightRadius: 16,
                  borderBottomRightRadius: 16,
                }
              }}
            >
              {drawer}
            </Drawer>
          </>
        ) : null}
        
        {/* Logo et titre */}
        <Box 
          component={RouterLink} 
          to="/" 
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            mr: 2,
            transition: 'opacity 0.2s',
            '&:hover': { opacity: 0.9 },
          }}
        >
          <Typography 
            className="arabic-text" 
            sx={{ 
              color: theme.palette.secondary.main,
              fontSize: '1.8rem',
              fontWeight: 'bold',
              mr: 0.5,
            }}
          >
            {logoText}
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'white', 
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            Explorer
          </Typography>
        </Box>

        {/* Espace flexible */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Menu items pour desktop */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Tooltip title={item.text} arrow key={item.text}>
                  <Button 
                    component={RouterLink} 
                    to={item.path}
                    color="inherit"
                    startIcon={item.icon}
                    sx={{ 
                      mx: 0.7,
                      px: 1.5,
                      py: 0.8,
                      borderRadius: 1,
                      position: 'relative',
                      transition: 'background-color 0.2s ease',
                      fontWeight: active ? 'bold' : 'medium',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&::after': active ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        width: '50%',
                        height: '3px',
                        backgroundColor: theme.palette.secondary.main,
                        transform: 'translateX(-50%)',
                        borderTopLeftRadius: '3px',
                        borderTopRightRadius: '3px',
                        transition: 'width 0.3s ease',
                      } : {},
                      '&:hover::after': active ? {
                        width: '70%',
                      } : {},
                    }}
                  >
                    {item.text}
                  </Button>
                </Tooltip>
              );
            })}
            
            <Tooltip title={darkMode ? "Mode clair" : "Mode sombre"} arrow>
              <IconButton 
                onClick={toggleDarkMode} 
                color="inherit"
                sx={{ 
                  ml: 1.5,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                  }
                }}
              >
                <Fade in={true}>
                  {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </Fade>
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

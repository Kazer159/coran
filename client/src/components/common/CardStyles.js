// Styles réutilisables pour les cartes et composants communs
import { alpha } from '@mui/material/styles';

// Style de base pour les cartes avec bordures élégantes et ombres légères
export const cardBaseStyle = (theme) => ({
  borderRadius: 2,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
  overflow: 'hidden',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
  },
  background: theme.palette.mode === 'dark' 
    ? theme.palette.background.paper 
    : theme.palette.background.paper,
});

// Style pour les cartes avec accent sur le bord supérieur
export const accentTopCard = (theme) => ({
  ...cardBaseStyle(theme),
  borderTop: `4px solid ${theme.palette.primary.main}`,
});

// Style pour les cartes avec accent sur le bord gauche
export const accentLeftCard = (theme) => ({
  ...cardBaseStyle(theme),
  borderLeft: `4px solid ${theme.palette.primary.main}`,
});

// Style pour les conteneurs de versets coraniques
export const verseContainer = (theme) => ({
  borderRadius: 2,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: theme.palette.mode === 'dark' 
    ? alpha(theme.palette.background.paper, 0.7)
    : alpha(theme.palette.background.default, 0.7),
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  borderLeft: `3px solid ${theme.palette.secondary.main}`,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 16,
    left: -3,
    width: 3,
    height: 40,
    backgroundColor: theme.palette.primary.main,
  }
});

// Style pour les boutons d'action
export const actionButton = (theme) => ({
  borderRadius: theme.shape.borderRadius,
  transition: 'background-color 0.2s ease, transform 0.1s ease',
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  }
});

// Style pour les badges et tags
export const tagStyle = (theme) => ({
  borderRadius: 12,
  padding: '3px 10px',
  fontSize: '0.75rem',
  fontWeight: 600,
  display: 'inline-flex',
  alignItems: 'center',
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  margin: '0 4px 4px 0',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
});

// Style pour les éléments de citation
export const quoteStyle = (theme) => ({
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2, 3),
  margin: theme.spacing(2, 0),
  backgroundColor: alpha(theme.palette.secondary.main, 0.05),
  borderLeft: `4px solid ${theme.palette.secondary.main}`,
  position: 'relative',
  '&::before': {
    content: '"\\201C"', // Unicode pour guillemet ouvrant
    fontFamily: 'serif',
    fontSize: '3rem',
    position: 'absolute',
    left: theme.spacing(1),
    top: theme.spacing(-1),
    color: alpha(theme.palette.secondary.main, 0.2),
  }
});

// Style pour les séparateurs avec motif islamique subtil
export const decorativeDivider = (theme) => ({
  position: 'relative',
  height: '1px',
  backgroundColor: theme.palette.divider,
  margin: theme.spacing(4, 'auto'),
  width: '80%',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '40px',
    height: '40px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundImage: `radial-gradient(circle, ${theme.palette.secondary.main} 2px, transparent 2.5px)`,
    backgroundSize: '10px 10px',
    borderRadius: '50%',
    backgroundColor: theme.palette.background.default,
  }
});

// Style pour les titres de sections
export const sectionTitle = (theme) => ({
  position: 'relative',
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(3),
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '60px',
    height: '3px',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '1.5px',
  }
});

// Style pour les badges numériques de versets
export const verseNumber = (theme) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  fontSize: '0.9rem',
  marginRight: theme.spacing(1),
});

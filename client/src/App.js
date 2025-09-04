import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useState } from 'react';
import './App.css';

// Composants
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import SuraListPage from './pages/SuraListPage';
import SuraDetailPage from './pages/SuraDetailPage';
import SearchPage from './pages/SearchPage';
import WordRootPage from './pages/WordRootPage';
import BookmarksPage from './pages/BookmarksPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  // État pour le thème clair/sombre
  const [darkMode, setDarkMode] = useState(false);

  // Création du thème
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#00695c', // turquoise foncé (remplace le bleu)
        light: '#439889',
        dark: '#004d40',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#d4af37', // or/ambre (remplace le vert)
        light: '#ffdf6b',
        dark: '#9c8024',
        contrastText: '#000000',
      },
      accent: {
        main: '#8d6e63', // brun pour les éléments tertiaires
        light: '#be9c91',
        dark: '#5f4339',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#e0e0e0' : '#212121',
        secondary: darkMode ? '#a0a0a0' : '#757575',
      },
    },
    typography: {
      fontFamily: 'Roboto, "Amiri", "Scheherazade New", sans-serif',
    },
    direction: 'ltr',
    shape: {
      borderRadius: 8,
    },
    shadows: [
      'none',
      '0px 2px 4px rgba(0,0,0,0.1)',
      // ... garder les autres shadows par défaut
      ...Array(23).fill('').map((_, i) => i === 0 ? 'none' : undefined),
    ],
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/suras" element={<SuraListPage />} />
              <Route path="/sura/:suraNumber" element={<SuraDetailPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/word/:root" element={<WordRootPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

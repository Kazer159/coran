const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Configuration des variables d'environnement
dotenv.config({ path: path.join(__dirname, '../.env') });

// Initialisation de l'application Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
const suraRoutes = require('./routes/suraRoutes');
const verseRoutes = require('./routes/verseRoutes');
const wordRoutes = require('./routes/wordRoutes');

app.use('/api/suras', suraRoutes);
app.use('/api/verses', verseRoutes);
app.use('/api/words', wordRoutes);

// Route par défaut pour tester l'API
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API Quran Explorer' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Une erreur est survenue',
    message: err.message
  });
});

// Configuration du port et connexion à la base de données
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/quran-explorer';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connecté à la base de données MongoDB');
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erreur lors de la connexion à MongoDB:', err);
  });

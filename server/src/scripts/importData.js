const fs = require('fs');
const path = require('path');
const readline = require('readline');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Modèles
const Sura = require('../models/Sura');
const Verse = require('../models/Verse');
const Word = require('../models/Word');

// Configuration de l'environnement
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/quran-explorer';

// Chemins vers les fichiers de données
const DATA_DIR = process.env.DATA_DIR || '/home/bachir/SynologyDrive/PROGRAMME/coran/Coran/Coran';
const SURAS_FILE = path.join(DATA_DIR, 'suras', 'documents.jsonl');
const VERSES_FILE = path.join(DATA_DIR, 'verses', 'documents.jsonl');
const WORDS_FILE = path.join(DATA_DIR, 'wordIndex', 'documents.jsonl');

// Fonction pour importer un fichier JSONL dans MongoDB
async function importJSONL(filePath, Model, batchSize = 100) {
  console.log(`Importation de ${filePath}...`);
  
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let batch = [];
  let count = 0;

  for await (const line of rl) {
    try {
      const data = JSON.parse(line);
      batch.push(data);
      
      if (batch.length >= batchSize) {
        await Model.insertMany(batch);
        count += batch.length;
        console.log(`${count} documents importés`);
        batch = [];
      }
    } catch (err) {
      console.error('Erreur lors du traitement de la ligne:', err);
    }
  }

  // Importer les éléments restants
  if (batch.length > 0) {
    await Model.insertMany(batch);
    count += batch.length;
    console.log(`${count} documents importés au total`);
  }

  console.log(`Importation de ${filePath} terminée.`);
}

// Fonction principale
async function importData() {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connecté à MongoDB');

    // Suppression des collections existantes
    console.log('Suppression des collections existantes...');
    await Promise.all([
      Sura.deleteMany({}),
      Verse.deleteMany({}),
      Word.deleteMany({})
    ]);
    console.log('Collections supprimées');

    // Import des données
    console.log('Importation des sourates...');
    await importJSONL(SURAS_FILE, Sura);
    
    console.log('Importation des versets...');
    await importJSONL(VERSES_FILE, Verse);
    
    console.log('Importation des mots...');
    await importJSONL(WORDS_FILE, Word);

    console.log('Importation terminée avec succès!');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
    process.exit(1);
  }
}

importData();

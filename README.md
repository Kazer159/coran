# Quran Explorer

![GitHub repo size](https://img.shields.io/github/repo-size/Kazer159/coran)
![GitHub last commit](https://img.shields.io/github/last-commit/Kazer159/coran)

Application web d'exploration et d'analyse des données coraniques basée sur le stack MERN (MongoDB, Express, React, Node.js). Ce projet fournit une interface moderne pour explorer le texte coranique, ses traductions et effectuer des analyses linguistiques.

## Fonctionnalités

- Liste et détail des 114 sourates du Coran
- Affichage des versets avec traduction française et translittération
- Recherche textuelle en arabe et français
- Analyse linguistique mot par mot des versets
- Recherche par racine arabe et visualisation des occurrences
- Navigation par référence (sourate/verset)
- Interface responsive avec mode sombre/clair

## Prérequis

- Node.js (v14 ou supérieur)
- MongoDB (v4 ou supérieur)
- npm (v6 ou supérieur)

## Installation

1. Cloner le dépôt
```bash
git clone https://github.com/Kazer159/coran.git quran-explorer
cd quran-explorer
```

2. Installer les dépendances
```bash
npm run install-all
```

3. Configuration
   - Créer un fichier `.env` dans le dossier `client` avec:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```
   - Vérifier le fichier `.env` dans le dossier `server` avec:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/quran-explorer
   DATA_DIR=/chemin/vers/dossier/donnees
   NODE_ENV=development
   ```
   Note: Remplacer `/chemin/vers/dossier/donnees` par le chemin absolu vers le dossier `Coran` qui contient les données JSONL (suras, verses, wordIndex).

## Importation des données

1. Démarrer MongoDB
```bash
sudo systemctl start mongod
# ou
brew services start mongodb-community
```

2. Importer les données JSONL dans MongoDB
```bash
npm run import-data
```

## Démarrage de l'application

1. Démarrer le frontend et le backend simultanément
```bash
npm run dev
```

2. Accéder à l'application
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## Structure du projet

```
quran-explorer/
├── client/                  # Frontend React
│   ├── public/              # Fichiers statiques
│   └── src/                 # Code source React
│       ├── api/             # Services API
│       ├── components/      # Composants React
│       ├── pages/           # Pages de l'application
│       └── App.js           # Composant racine
├── server/                  # Backend Node.js/Express
│   └── src/
│       ├── controllers/     # Contrôleurs API
│       ├── models/          # Modèles Mongoose
│       ├── routes/          # Routes API Express
│       ├── scripts/         # Scripts utilitaires
│       └── server.js        # Point d'entrée du serveur
└── package.json            # Scripts racine
```

## API Endpoints

### Sourates
- `GET /api/suras` - Liste toutes les sourates
- `GET /api/suras/:number` - Récupère une sourate par numéro
- `GET /api/suras/revelation-place/:place` - Filtre les sourates par lieu de révélation
- `GET /api/suras/revelation-order` - Liste les sourates par ordre de révélation

### Versets
- `GET /api/verses` - Liste les versets (paginé)
- `GET /api/verses/sura/:suraNumber` - Récupère les versets d'une sourate
- `GET /api/verses/sura/:suraNumber/aya/:ayaNumber` - Récupère un verset spécifique
- `GET /api/verses/search` - Recherche dans les versets

### Mots
- `GET /api/words` - Liste les mots indexés (paginé)
- `GET /api/words/root/:root` - Recherche par racine arabe
- `GET /api/words/root/:root/context` - Récupère les occurrences d'une racine avec contexte

## Technologies utilisées

### Frontend
- React
- React Router
- Material-UI
- Axios

### Backend
- Node.js
- Express
- Mongoose/MongoDB
- Morgan (logging)
- CORS

## Licence

Ce projet est sous licence MIT.

## Dépôt GitHub

Ce projet est hébergé sur GitHub à l'adresse suivante: [https://github.com/Kazer159/coran](https://github.com/Kazer159/coran)

## Déploiement

Pour déployer votre propre version de ce projet sur GitHub:

1. Créez un fork du dépôt
2. Clonez-le sur votre machine locale
3. Faites vos modifications
4. Poussez vos changements:
   ```bash
   git add .
   git commit -m "Description des changements"
   git push origin master
   ```

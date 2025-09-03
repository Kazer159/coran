# Guide d'utilisation - Quran Explorer

Ce guide vous explique comment utiliser l'application Quran Explorer pour explorer les données coraniques.

## Démarrage

Avant de pouvoir utiliser l'application, vous devez :

1. Installer MongoDB sur votre système
   ```bash
   # Sur Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install -y mongodb

   # Sur macOS avec Homebrew
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. Démarrer le service MongoDB
   ```bash
   # Sur Ubuntu/Debian
   sudo systemctl start mongodb

   # Sur macOS
   brew services start mongodb-community
   ```

3. Importer les données dans MongoDB
   ```bash
   cd quran-explorer
   npm run import-data
   ```

4. Démarrer l'application
   ```bash
   npm run dev
   ```

5. Accéder à l'application dans votre navigateur : http://localhost:3000

## Fonctionnalités principales

### 1. Page d'accueil

La page d'accueil présente une vue d'ensemble de l'application et des liens vers les fonctionnalités principales.

### 2. Navigation dans les sourates

Accédez à la liste des sourates via le menu "Sourates" ou le bouton "Explorer les sourates" sur la page d'accueil.

Sur la page de liste des sourates, vous pouvez :
- Filtrer les sourates par nom
- Filtrer par lieu de révélation (La Mecque ou Médine)
- Trier par ordre coranique ou ordre de révélation
- Cliquer sur une sourate pour voir ses détails

### 3. Exploration des versets

Sur la page de détail d'une sourate, vous pouvez :
- Voir tous les versets de la sourate
- Naviguer entre les sourates avec les boutons "Sourate précédente" et "Sourate suivante"
- Activer l'option "Afficher l'analyse mot par mot" pour voir le détail linguistique de chaque verset
- Naviguer entre les pages de versets avec la pagination (pour les longues sourates)

### 4. Recherche

Accédez à la fonction de recherche via le menu "Recherche" en haut de l'écran.

Trois modes de recherche sont disponibles :

#### a. Recherche par texte
- Entrez un mot ou une expression en arabe ou français
- Choisissez la langue de recherche (arabe, français ou les deux)
- Les résultats affichent les versets correspondants avec le contexte

#### b. Recherche par racine
- Entrez une racine arabe (comme كتب ou سلم)
- Les résultats affichent tous les versets contenant des mots dérivés de cette racine
- Les mots correspondants sont mis en évidence

#### c. Recherche par référence
- Entrez un numéro de sourate et de verset (comme 2:255 pour Al-Baqara, verset 255)
- Le verset exact correspondant sera affiché

### 5. Analyse des racines

Pour une analyse approfondie d'une racine :
- Utilisez la recherche par racine
- Cliquez sur une racine dans l'analyse mot par mot d'un verset
- La page d'analyse de racine affiche toutes les occurrences dans le Coran avec contexte

## Astuces d'utilisation

- Utilisez le bouton de thème (icône soleil/lune) pour basculer entre le mode clair et sombre.
- Sur mobile, le menu est accessible via l'icône de menu en haut à gauche.
- Les numéros de sourate:verset sont cliquables et vous mènent directement au verset correspondant.
- Pour une recherche efficace de racines arabes, utilisez la forme de base (généralement 3 lettres).

## Dépannage

Si vous rencontrez des problèmes :

1. **L'application ne démarre pas** : Vérifiez que MongoDB est bien démarré avec `sudo systemctl status mongodb`.

2. **Erreurs d'importation des données** : Vérifiez que le chemin vers les données JSONL est correct dans le fichier `.env` du serveur.

3. **Interface vide ou erreurs dans la console** : Assurez-vous que toutes les dépendances sont installées avec `npm run install-all`.

4. **API inaccessible** : Vérifiez que le serveur backend est démarré sur le port 5000 et que le fichier `.env` du client pointe vers l'URL correcte.

## Extensions futures

Vous pourriez étendre l'application avec ces fonctionnalités :
- Lecture audio des versets
- Ajout de favoris personnalisés
- Visualisations statistiques des occurrences de mots
- Thèmes et catégories de versets
- Analyse grammaticale plus détaillée

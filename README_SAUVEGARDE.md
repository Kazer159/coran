# Guide de Sauvegarde et Restauration - Quran Explorer

Ce document fournit les instructions détaillées pour sauvegarder et restaurer l'application Quran Explorer.

## Table des matières
1. [Sauvegarde de l'application](#sauvegarde-de-lapplication)
   - [Méthode manuelle](#méthode-manuelle)
   - [Méthode automatisée](#méthode-automatisée)
2. [Restauration de l'application](#restauration-de-lapplication)
   - [Préparation](#préparation)
   - [Restauration des fichiers](#restauration-des-fichiers)
   - [Installation des dépendances](#installation-des-dépendances)
   - [Configuration de l'environnement](#configuration-de-lenvironnement)
   - [Démarrage de l'application](#démarrage-de-lapplication)
3. [Sauvegarde de la base de données](#sauvegarde-de-la-base-de-données)
4. [Restauration de la base de données](#restauration-de-la-base-de-données)
5. [Résolution des problèmes courants](#résolution-des-problèmes-courants)

## Sauvegarde de l'application

### Méthode manuelle

Pour sauvegarder manuellement l'application, suivez ces étapes:

1. Ouvrez un terminal et naviguez jusqu'au répertoire racine du projet:
   ```bash
   cd /chemin/vers/quran-explorer
   ```

2. Créez un répertoire pour stocker les sauvegardes si nécessaire:
   ```bash
   mkdir -p ~/backups
   ```

3. Créez une archive tar de l'application en excluant les répertoires non essentiels:
   ```bash
   tar -czvf ~/backups/quran-explorer-backup-$(date +%Y%m%d).tar.gz \
   --exclude='node_modules' \
   --exclude='.git' \
   --exclude='*/build' \
   --exclude='*/node_modules' \
   .
   ```

Cette commande crée une archive compressée nommée `quran-explorer-backup-YYYYMMDD.tar.gz` dans le répertoire `~/backups/`.

### Méthode automatisée

Vous pouvez créer un script de sauvegarde automatisé en créant un fichier `backup.sh`:

```bash
#!/bin/bash

# Définir les variables
PROJECT_DIR="/chemin/vers/quran-explorer"
BACKUP_DIR="$HOME/backups"
DATE=$(date +%Y%m%d)
BACKUP_FILE="$BACKUP_DIR/quran-explorer-backup-$DATE.tar.gz"

# Créer le répertoire de sauvegarde s'il n'existe pas
mkdir -p "$BACKUP_DIR"

# Se déplacer dans le répertoire du projet
cd "$PROJECT_DIR"

# Créer l'archive de sauvegarde
tar -czvf "$BACKUP_FILE" \
--exclude='node_modules' \
--exclude='.git' \
--exclude='*/build' \
--exclude='*/node_modules' \
.

echo "Sauvegarde terminée: $BACKUP_FILE"

# Optionnel: supprimer les sauvegardes de plus de 30 jours
find "$BACKUP_DIR" -name "quran-explorer-backup-*.tar.gz" -type f -mtime +30 -delete
```

Rendez le script exécutable:
```bash
chmod +x backup.sh
```

Exécutez le script pour créer une sauvegarde:
```bash
./backup.sh
```

Vous pouvez également programmer une sauvegarde automatique avec cron:
```bash
# Pour éditer la table cron
crontab -e

# Ajouter cette ligne pour exécuter la sauvegarde tous les jours à 2h du matin
0 2 * * * /chemin/vers/backup.sh
```

## Restauration de l'application

### Préparation

1. Assurez-vous que vous disposez des prérequis suivants:
   - Node.js (version recommandée: 14.x ou supérieure)
   - npm (version recommandée: 6.x ou supérieure)
   - MongoDB (si applicable)
   - Git (optionnel)

2. Créez un répertoire pour la restauration:
   ```bash
   mkdir -p /chemin/vers/restauration
   ```

### Restauration des fichiers

1. Copiez votre fichier de sauvegarde dans le répertoire de restauration:
   ```bash
   cp ~/backups/quran-explorer-backup-YYYYMMDD.tar.gz /chemin/vers/restauration/
   ```

2. Naviguez vers le répertoire de restauration:
   ```bash
   cd /chemin/vers/restauration
   ```

3. Extrayez les fichiers de l'archive:
   ```bash
   tar -xzvf quran-explorer-backup-YYYYMMDD.tar.gz
   ```

### Installation des dépendances

1. Installez les dépendances au niveau racine du projet:
   ```bash
   npm install
   ```

2. Installez les dépendances du client:
   ```bash
   cd client
   npm install
   ```

3. Installez les dépendances du serveur:
   ```bash
   cd ../server
   npm install
   ```

### Configuration de l'environnement

1. Vérifiez les fichiers `.env` dans le répertoire racine, client et serveur, et assurez-vous que les configurations sont correctes pour votre nouvel environnement:

   - Dans le répertoire racine, vérifiez le fichier `.env` (s'il existe)
   - Dans le répertoire client, vérifiez `client/.env`
   - Dans le répertoire serveur, vérifiez `server/.env`

2. Exemple de configuration typique pour le serveur (`server/.env`):
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/quran_explorer
   NODE_ENV=development
   ```

3. Exemple de configuration pour le client (`client/.env`):
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Démarrage de l'application

1. Revenez au répertoire racine du projet:
   ```bash
   cd ..
   ```

2. Démarrez l'application en mode développement:
   ```bash
   npm run dev
   ```
   
   Ou démarrez le client et le serveur séparément:
   ```bash
   # Dans un terminal
   cd server
   npm start
   
   # Dans un autre terminal
   cd client
   npm start
   ```

3. Vérifiez que l'application est accessible à l'adresse http://localhost:3000 (ou un autre port si configuré différemment).

## Sauvegarde de la base de données

Si votre application utilise MongoDB, vous pouvez sauvegarder la base de données avec mongodump:

```bash
# Sauvegarde de la base de données
mongodump --db quran_explorer --out ~/backups/mongodb-backup-$(date +%Y%m%d)

# Compression de la sauvegarde
tar -czvf ~/backups/mongodb-backup-$(date +%Y%m%d).tar.gz ~/backups/mongodb-backup-$(date +%Y%m%d)
rm -rf ~/backups/mongodb-backup-$(date +%Y%m%d)
```

## Restauration de la base de données

Pour restaurer la base de données MongoDB:

```bash
# Extraction de la sauvegarde
tar -xzvf ~/backups/mongodb-backup-YYYYMMDD.tar.gz -C ~/backups/

# Restauration de la base de données
mongorestore --db quran_explorer ~/backups/mongodb-backup-YYYYMMDD/quran_explorer
```

## Résolution des problèmes courants

### Problèmes de dépendances

Si vous rencontrez des problèmes liés aux dépendances après la restauration:

```bash
# Nettoyez le cache npm
npm cache clean --force

# Supprimez les répertoires node_modules
rm -rf node_modules
rm -rf client/node_modules
rm -rf server/node_modules

# Réinstallez les dépendances
npm install
cd client && npm install
cd ../server && npm install
```

### Problèmes de base de données

Si la connexion à la base de données échoue:

1. Vérifiez que MongoDB est en cours d'exécution:
   ```bash
   sudo systemctl status mongodb
   ```

2. Assurez-vous que l'URI MongoDB dans `server/.env` est correct.

3. Vérifiez les journaux du serveur pour plus de détails sur les erreurs de connexion.

### Problèmes de démarrage du client

Si le client ne démarre pas correctement:

1. Vérifiez que `REACT_APP_API_URL` dans `client/.env` pointe vers la bonne adresse du serveur.

2. Essayez de reconstruire le client:
   ```bash
   cd client
   npm run build
   ```

---

Pour toute assistance supplémentaire, veuillez consulter la documentation du projet ou contacter l'équipe de développement.

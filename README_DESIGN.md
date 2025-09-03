# Guide de Design - Quran Explorer

## Palette de couleurs

La palette de couleurs de Quran Explorer est inspirée de l'art et de l'architecture islamique traditionnelle, offrant une expérience visuelle à la fois élégante et respectueuse.

### Couleurs principales
- **Primaire** : `#00695c` (turquoise foncé)
  - Utilisée pour les éléments principaux d'interaction (boutons, liens, icônes)
  - Représente la sérénité et la profondeur
- **Secondaire** : `#d4af37` (or/ambre)
  - Utilisée pour les accents et points d'attention
  - Symbolise la sagesse et la préciosité du savoir
- **Accent** : `#8d6e63` (brun)
  - Utilisée pour les éléments tertiaires et décoratifs
  - Évoque les manuscrits anciens

### Mode clair vs Mode sombre
- **Mode clair**
  - Fond principal : `#f5f5f5` avec motifs subtils
  - Texte principal : `#212121`
  - Texte secondaire : `#757575`
- **Mode sombre**
  - Fond principal : `#121212`
  - Éléments secondaires : `#1e1e1e`
  - Texte principal : `#e0e0e0`
  - Texte secondaire : `#a0a0a0`

## Typographie

La typographie de Quran Explorer est optimisée pour une lisibilité maximale, particulièrement pour le texte coranique.

### Polices
- **Texte arabe** : "Amiri" et "Scheherazade New"
  - Optimisées pour la calligraphie arabe traditionnelle
  - Taille de base : 22px (texte coranique)
- **Texte latin** : "Roboto"
  - Titres : Roboto Medium/Bold
  - Corps de texte : Roboto Regular
  - Taille de base : 16px

### Hiérarchie typographique
- **Texte coranique** : plus grand, mise en évidence
- **Traductions** : légèrement plus petit, style différencié
- **Annotations** : taille réduite, couleur secondaire

## Composants UI

### Barre de navigation
- Design minimaliste avec logo calligraphique
- Transitions douces entre les états (hover, active)
- Indicateur de page actuelle subtilement mis en évidence

### Cartes et conteneurs
- Ombres légères pour une sensation de profondeur (`box-shadow: 0 2px 4px rgba(0,0,0,0.1)`)
- Bordures arrondies (`border-radius: 8px`)
- Animation au survol pour une expérience interactive

### Boutons
- Primaires : fond de couleur primaire, texte blanc
- Secondaires : bordure de couleur secondaire, texte de couleur secondaire
- États de survol avec transitions douces
- Icônes cohérentes avec le texte

### Citations et versets
- Cadres spéciaux avec bordures décoratives subtiles
- Fond légèrement différencié
- Espace généreux pour une lecture confortable

## Motifs et décorations

Des motifs géométriques islamiques subtils sont utilisés dans:
- Séparateurs de contenu
- Arrière-plans de sections spéciales
- Bordures décoratives pour les citations importantes

## Images et médias
- Images d'arrière-plan de haute qualité liées à la calligraphie et l'architecture islamique
- Gradients subtils pour les overlays (`linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.5))`)
- Optimisation des images pour les performances

## Accessibilité
- Contraste élevé entre texte et fond (WCAG AA/AAA)
- Tailles de texte ajustables
- Éléments interactifs clairement identifiables
- Support complet du mode sombre

## Responsive Design
- Mise en page fluide s'adaptant à toutes les tailles d'écran
- Points de rupture optimisés pour mobile, tablette et desktop
- Expérience tactile optimisée sur appareils mobiles

---

Ce guide définit les standards visuels et d'interaction pour maintenir une expérience utilisateur cohérente et agréable à travers l'application Quran Explorer.

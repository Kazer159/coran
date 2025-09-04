import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Button,
  Divider,
  Tooltip,
  useTheme
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * Composant réutilisable pour afficher un verset du Coran
 */
const VerseCard = ({
  verse,
  showActions = true,
  showDetails = false,
  isBookmarked = false,
  onToggleBookmark,
  onToggleDetails,
  onRemove,
  onShare,
  theme = 'light',
  fontSize = {
    arabic: 1.8,
    translation: 1
  },
  displayMode = 'standard', // 'standard', 'reading', 'side-by-side'
  showContextButton = true
}) => {
  const muiTheme = useTheme();
  const navigate = useNavigate();
  
  // Fonction pour partager un verset
  const handleShare = (e) => {
    e.stopPropagation();
    if (onShare) {
      onShare(verse);
    } else {
      const shareText = `${verse.textAr}
${verse.textFr}
(Sourate ${verse.sura} ${verse.suraNameFr || verse.suraName || ''}, verset ${verse.aya})`;
      const shareUrl = `${window.location.origin}/sura/${verse.sura}#${verse.aya}`;
      
      if (navigator.share) {
        navigator.share({
          title: `Sourate ${verse.sura} ${verse.suraNameFr || verse.suraName || ''}, verset ${verse.aya}`,
          text: shareText,
          url: shareUrl
        }).catch(() => {
          copyToClipboard(`${shareText} ${shareUrl}`);
        });
      } else {
        copyToClipboard(`${shareText} ${shareUrl}`);
      }
    }
  };

  // Fonction pour copier dans le presse-papiers
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Texte copié dans le presse-papier');
      })
      .catch((err) => {
        console.error('Erreur lors de la copie du texte:', err);
      });
  };

  // Fonction pour naviguer vers le verset dans son contexte
  const viewInContext = () => {
    navigate(`/sura/${verse.sura}#${verse.aya}`);
  };

  // Déterminer l'ID du verset (format standardisé)
  const verseId = `${verse.sura}:${verse.aya}`;

  return (
    <Card
      id={`verse-${verse.aya}`}
      sx={{
        mb: 3,
        bgcolor: theme === 'dark' ? 'grey.800' : 'background.paper',
        boxShadow: theme === 'dark' ? '0 2px 10px rgba(0,0,0,0.4)' : undefined,
        borderLeft: isBookmarked ? '4px solid' : 'none',
        borderColor: 'primary.main',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: `0 0 0 1px ${muiTheme.palette.primary.main}`,
          backgroundColor: muiTheme.palette.action.hover
        }
      }}
    >
      <CardContent>
        {/* En-tête du verset avec numéro et actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Chip
              label={`Sourate ${verse.sura} ${verse.suraNameFr || verse.suraName || ''} Verset ${verse.aya}`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ 
                fontSize: '0.75rem', 
                maxWidth: '350px', 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis' 
              }}
              component={RouterLink}
              to={`/sura/${verse.sura}`}
              clickable
            />
          </Box>

          {showActions && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {/* Bouton pour ajouter/supprimer des favoris */}
              {onToggleBookmark && (
                <Tooltip title={isBookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}>
                  <IconButton 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(verse);
                    }}
                  >
                    {isBookmarked ? (
                      <BookmarkIcon fontSize="small" color="primary" />
                    ) : (
                      <BookmarkBorderIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              )}

              {/* Bouton pour supprimer (utilisé dans la page des favoris) */}
              {onRemove && (
                <Tooltip title="Retirer des favoris">
                  <IconButton 
                    color="error" 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(verseId);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              {/* Bouton pour afficher les détails (analyse mot à mot) */}
              {onToggleDetails && (
                <Button 
                  size="small" 
                  variant={showDetails ? "contained" : "outlined"}
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleDetails(verse._id);
                  }}
                  sx={{ fontSize: '0.75rem', minWidth: '80px' }}
                >
                  Mot à mot
                </Button>
              )}
            </Box>
          )}

          {/* Actions supplémentaires */}
          {showActions && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {/* Bouton pour partager */}
              <Tooltip title="Partager">
                <IconButton size="small" onClick={handleShare}>
                  <ShareIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              {/* Bouton pour voir le contexte */}
              <Tooltip title="Voir le contexte">
                <IconButton 
                  size="small" 
                  component={RouterLink} 
                  to={`/verse/${verse._id}/context`}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        {/* Contenu du verset */}
        <Box sx={{
          mt: 2,
          display: displayMode === 'side-by-side' ? 'flex' : 'block',
          gap: 3,
          flexDirection: { xs: 'column', md: 'row' },
        }}>
          {/* Texte arabe */}
          <Box sx={{
            flex: displayMode === 'side-by-side' ? 1 : 'auto',
            order: { xs: 1, md: 2 }
          }}>
            <Typography
              paragraph
              align="right"
              sx={{
                fontFamily: '"Noto Naskh Arabic", sans-serif',
                fontSize: `${fontSize.arabic}rem`,
                lineHeight: 1.8,
                mt: 1
              }}
            >
              {verse.textAr}
            </Typography>
          </Box>

          {displayMode !== 'reading' && (
            <Box sx={{
              flex: displayMode === 'side-by-side' ? 1 : 'auto',
              order: { xs: 2, md: 1 }
            }}>
              {/* Translittération si disponible */}
              {verse.textTl && (
                <Typography
                  paragraph
                  align="left"
                  sx={{
                    fontStyle: 'italic',
                    fontSize: '0.9rem',
                    color: theme === 'dark' ? 'grey.400' : 'text.secondary',
                    display: displayMode === 'side-by-side' ? { xs: 'none', lg: 'block' } : 'block'
                  }}
                >
                  {verse.textTl}
                </Typography>
              )}

              {/* Traduction française */}
              <Typography
                paragraph
                sx={{
                  fontSize: `${fontSize.translation}rem`,
                  mt: 1
                }}
              >
                {verse.textFr}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Détails des mots si l'option est activée pour ce verset */}
        {showDetails && verse.segments && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Analyse mot par mot:
            </Typography>
            {/* Débogage pour voir la structure des données */}
            {console.log('Structure des segments reçus:', JSON.stringify(verse.segments))}
            
            {/* Vérifie si nous avons des segments à afficher */}
            {verse.segments && verse.segments.length > 0 ? (
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                justifyContent: 'center'
              }}>
                {verse.segments.map((segment, index) => {
                  console.log(`Segment ${index}:`, segment);
                  return (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: { xs: '45%', sm: '30%', md: '22%', lg: '18%' },
                        mb: 2,
                        p: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        bgcolor: theme === 'dark' ? 'rgba(66, 66, 66, 0.6)' : 'rgba(250, 250, 250, 0.8)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                        '&:hover': {
                          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                          bgcolor: theme === 'dark' ? 'rgba(80, 80, 80, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                        }
                      }}
                    >
                      {/* Mot arabe */}
                      <Typography align="center" sx={{ 
                        fontFamily: '"Noto Naskh Arabic", sans-serif', 
                        fontSize: '1.3rem',
                        fontWeight: 500,
                        color: theme === 'dark' ? 'primary.light' : 'primary.main',
                        mb: 0.5
                      }}>
                        {segment.ar || '?'}
                      </Typography>
                      
                      {/* Traduction sous le mot arabe (utilise 'en' car c'est ce qui existe dans le schéma) */}
                      <Typography variant="body2" align="center" sx={{ 
                        fontWeight: 500,
                        color: theme === 'dark' ? 'info.light' : 'info.dark',
                        mb: 1,
                        borderBottom: '1px dashed',
                        borderColor: 'divider',
                        pb: 0.5
                      }}>
                        {segment.en || 'Traduction non disponible'}
                      </Typography>
                      
                      {/* Translittération en dernier (utilise 'tl' car c'est ce qui existe dans le schéma) */}
                      <Typography variant="caption" align="center" sx={{ 
                        fontStyle: 'italic',
                        color: theme === 'dark' ? 'grey.400' : 'text.secondary'
                      }}>
                        {segment.tl || 'Translittération non disponible'}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Typography color="text.secondary" align="center">
                Aucune donnée mot à mot disponible pour ce verset
              </Typography>
            )}
          </Box>
        )}

        {/* Bouton pour voir en contexte (principalement pour la page des favoris) */}
        {showContextButton && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={viewInContext}
            >
              Voir en contexte
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default VerseCard;

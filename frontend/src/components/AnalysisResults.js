import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider,
  Chip,
  Stack,
  useTheme
} from '@mui/material';
import {
  SentimentSatisfiedAlt as PositiveIcon,
  SentimentDissatisfied as NegativeIcon,
  SentimentNeutral as NeutralIcon,
  Timer as TimerIcon,
  TextSnippet as TextIcon,
  FormatListNumbered as ListIcon,
  Star as StarIcon
} from '@mui/icons-material';

const AnalysisCard = ({ title, value, icon, color }) => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: theme.shape.borderRadius,
        flex: 1,
        minWidth: 180,
        borderLeft: `4px solid ${theme.palette[color].main}`
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {React.cloneElement(icon, { 
          color: color,
          sx: { mr: 1.5, fontSize: 28 }
        })}
        <Typography variant="subtitle2" color="textSecondary">
          {title}
        </Typography>
      </Box>
      <Typography variant="h5" fontWeight={600}>
        {value}
      </Typography>
    </Paper>
  );
};


const SentimentDisplay = ({ sentiment, score }) => {
  const theme = useTheme();
  
  const getSentimentDetails = () => {
    switch (sentiment) {
      case 'positive':
        return {
          icon: <PositiveIcon />,
          color: 'success',
          text: 'Positive',
          bgColor: 'rgba(76, 175, 80, 0.1)'
        };
      case 'negative':
        return {
          icon: <NegativeIcon />,
          color: 'error',
          text: 'Negative',
          bgColor: 'rgba(244, 67, 54, 0.1)'
        };
      default:
        return {
          icon: <NeutralIcon />,
          color: 'warning',
          text: 'Neutral',
          bgColor: 'rgba(255, 152, 0, 0.1)'
        };
    }
  };
  
  const details = getSentimentDetails();
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: details.bgColor,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Box sx={{ mr: 2 }}>
        {React.cloneElement(details.icon, { 
          sx: { fontSize: 40, color: theme.palette[details.color].main }
        })}
      </Box>
      <Box>
        <Typography variant="h6" fontWeight={600}>
          {details.text} Sentiment
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Score: {score.toFixed(2)}
        </Typography>
      </Box>
    </Paper>
  );
};

export default function AnalysisResults({ analysis }) {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Analysis Results
      </Typography>
      
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <AnalysisCard 
          title="Word Count" 
          value={analysis.wordCount} 
          icon={<TextIcon />}
          color="primary"
        />
        <AnalysisCard 
          title="Sentences" 
          value={analysis.sentenceCount} 
          icon={<ListIcon />}
          color="secondary"
        />
        <AnalysisCard 
          title="Reading Time" 
          value={`${analysis.readingTime} min`} 
          icon={<TimerIcon />}
          color="info"
        />
      </Stack>
      
      <SentimentDisplay 
        sentiment={analysis.sentiment} 
        score={analysis.sentimentScore} 
      />
      
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mt: 3,
          borderRadius: theme.shape.borderRadius,
          backgroundColor: 'rgba(63, 81, 181, 0.05)'
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Key Phrases
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {analysis.keyPhrases.map((phrase, index) => (
            <Chip
              key={index}
              label={phrase}
              color="primary"
              variant="outlined"
              icon={<StarIcon />}
              sx={{
                borderRadius: 4,
                px: 1,
                py: 1.5
              }}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
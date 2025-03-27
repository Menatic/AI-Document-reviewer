import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Paper, Divider, Chip, Grid, CircularProgress, Alert } from '@mui/material';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

const AnalysisView = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await axios.get(`/api/analyze/${id}`);
        setAnalysis(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load analysis');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  const renderSentimentIcon = (score) => {
    if (score > 0.2) return <SentimentVerySatisfiedIcon color="success" />;
    if (score < -0.2) return <SentimentDissatisfiedIcon color="error" />;
    return <SentimentNeutralIcon color="warning" />;
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!analysis) return <Alert severity="info">No analysis data available</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Document Analysis
      </Typography>

      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Document Metrics
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Timeline>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color="primary" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography>Word Count: {analysis.wordCount}</Typography>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color="primary" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography>Sentences: {analysis.sentenceCount}</Typography>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color="primary" />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography>Estimated Reading Time: {analysis.readingTime} min</Typography>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </Paper>
        </Grid>

        {/* Sentiment Analysis */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sentiment Analysis
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {renderSentimentIcon(analysis.sentiment.score)}
              <Typography>
                Overall sentiment: {analysis.sentiment.label} (score: {analysis.sentiment.score.toFixed(2)})
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Key Phrases */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Key Phrases
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {analysis.keyPhrases.map((phrase, index) => (
                <Chip key={index} label={phrase.term} color="secondary" />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Named Entities */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Named Entities
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1">People:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {analysis.entities.people.map((person, index) => (
                <Chip key={`person-${index}`} label={person} />
              ))}
            </Box>
            <Typography variant="subtitle1">Organizations:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {analysis.entities.organizations.map((org, index) => (
                <Chip key={`org-${index}`} label={org} color="info" />
              ))}
            </Box>
            <Typography variant="subtitle1">Locations:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {analysis.entities.places.map((place, index) => (
                <Chip key={`place-${index}`} label={place} color="warning" />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Document Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Document Summary
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography paragraph>
              {analysis.summary}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalysisView;

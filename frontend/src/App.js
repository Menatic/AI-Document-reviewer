import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  CssBaseline, 
  Container,
  ThemeProvider,
  createTheme,
  Fade,
  Zoom,
  CircularProgress, // Add this import
  Alert // Add this import
} from '@mui/material';
import DocumentUpload from './components/DocumentUpload';
import AnalysisResults from './components/AnalysisResults';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 600,
      letterSpacing: '0.5px',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUploadStart = () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
  };

  const handleUploadComplete = (result) => {
    setLoading(false);
    
    if (!result) {
      setError('No response received from server');
      return;
    }

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.analysis) {
      setAnalysis(result.analysis);
    } else {
      setError('Analysis data missing from response');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          py: 8
        }}
      >
        <Container maxWidth="md">
          <Fade in timeout={500}>
            <Paper
              elevation={6}
              sx={{
                p: 4,
                borderRadius: theme.shape.borderRadius,
                background: theme.palette.background.paper,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}
            >
              <Typography
                variant="h3"
                component="h1"
                align="center"
                gutterBottom
                sx={{
                  mb: 4,
                  color: theme.palette.primary.main,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                AI Document Reviewer
              </Typography>
              
              <Typography
                variant="subtitle1"
                align="center"
                color="textSecondary"
                paragraph
                sx={{ mb: 4 }}
              >
                Upload your documents for instant analysis including sentiment, key phrases, and more
              </Typography>

              <DocumentUpload 
                onUploadStart={handleUploadStart}
                onUploadComplete={handleUploadComplete}
              />
              
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <Zoom in>
                    <Box sx={{ textAlign: 'center' }}>
                      <CircularProgress size={60} thickness={4} />
                      <Typography variant="body1" sx={{ mt: 2 }}>
                        Analyzing your document...
                      </Typography>
                    </Box>
                  </Zoom>
                </Box>
              )}
              
              {error && (
                <Fade in timeout={500}>
                  <Alert severity="error" sx={{ my: 3 }}>
                    {error}
                  </Alert>
                </Fade>
              )}
              
              {analysis && (
                <Fade in timeout={800}>
                  <Box sx={{ mt: 4 }}>
                    <AnalysisResults analysis={analysis} />
                  </Box>
                </Fade>
              )}
            </Paper>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;

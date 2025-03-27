import React from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Button, 
  Typography, 
  CircularProgress, // Add this import
  Alert,
  Box,
  useTheme
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import axios from 'axios';

export default function DocumentUpload({ onUploadStart, onUploadComplete }) {
  const theme = useTheme();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (!acceptedFiles || acceptedFiles.length === 0) {
        setError('No files were selected');
        return;
      }
      
      setLoading(true);
      setError(null);
      if (onUploadStart) onUploadStart();
      
      const formData = new FormData();
      formData.append('document', acceptedFiles[0]);

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/upload`, 
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            timeout: 30000
          }
        );
        
        if (!response.data || !response.data.analysis) {
          throw new Error('Invalid response structure from server');
        }
        
        if (onUploadComplete) onUploadComplete(response.data);
      } catch (error) {
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Upload failed due to unknown error';
        setError(errorMessage);
        if (onUploadComplete) onUploadComplete(null);
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        p: 4,
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backgroundColor: isDragActive ? 'rgba(63, 81, 181, 0.05)' : 'transparent',
        '&:hover': {
          borderColor: theme.palette.primary.main,
          backgroundColor: 'rgba(63, 81, 181, 0.03)'
        }
      }}
    >
      <input {...getInputProps()} />
      <CloudUpload 
        fontSize="large" 
        color={isDragActive ? 'primary' : 'action'} 
        sx={{ fontSize: 48, mb: 2 }}
      />
      <Typography variant="h6" gutterBottom>
        {isDragActive ? 'Drop the document here' : 'Drag & drop a document, or click to select'}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Supported formats: PDF, DOCX, TXT (Max 10MB)
      </Typography>
      
      <Button 
        variant="contained" 
        color="primary"
        size="large"
        startIcon={loading ? null : <CloudUpload />}
        disabled={loading}
        sx={{
          px: 4,
          py: 1.5,
          borderRadius: 50,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: theme.shadows[2],
          '&:hover': {
            boxShadow: theme.shadows[4]
          }
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Select File'
        )}
      </Button>
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mt: 3,
            borderRadius: theme.shape.borderRadius
          }}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
}

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Stack,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setMessage('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleSubmit = async () => {
    if (!file) {
      setMessage('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setMessage(data.message || 'Upload failed');
    } catch (error) {
      console.error('Error uploading file', error);
      setMessage('Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        color: '#333333',
        textAlign: 'center',
        flexDirection: 'column',
        padding: 3,
      }}
    >
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #cccccc',
          borderRadius: '8px',
          padding: '40px',
          backgroundColor: isDragActive ? '#f9f9f9' : '#ffffff',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease-in-out',
          maxWidth: 500,
          maxHeight: 300,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <input {...getInputProps()} />
        {!file ? (
          <>
            <CloudUploadIcon sx={{ fontSize: 60, color: '#cccccc' }} />
            <Typography variant="body1" sx={{ marginTop: 5, color: '#666666' }}>
              Drag and Drop a File Here, or Click to Select One
            </Typography>
          </>
        ) : (
          <Typography
            variant="body1"
            sx={{ marginTop: 2, color: '#333333', fontWeight: 'bold' }}
          >
            Selected File: {file.name}
          </Typography>
        )}
      </Box>

      {/* Upload Button */}
      <Stack direction="column" spacing={2} alignItems="center" sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{
            width: '200px',
            backgroundColor: 'primary',
            '&:hover': { backgroundColor: 'primary.dark' },
          }}
          onClick={handleSubmit}
          disabled={isUploading || !file}
        >
          {isUploading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            'Upload'
          )}
        </Button>

        {/* Optional: Message */}
        {message && (
          <Typography
            variant="body2"
            sx={{
              color: message.includes('Error') ? '#ff4d4d' : '#28a745',
              marginTop: 2,
            }}
          >
            {message}
          </Typography>
        )}
      </Stack>

      {/* Footer Text */}
      <Typography
        variant="caption"
        sx={{
          marginTop: 4,
          maxWidth: 600,
          fontSize: '0.8rem',
          color: '#888888',
        }}
      >
        By submitting data above, you are agreeing to our{' '}
        <a href="#" style={{ color: '#007bff', textDecoration: 'none' }}>
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" style={{ color: '#007bff', textDecoration: 'none' }}>
          Privacy Notice
        </a>
        , and to the sharing of your sample submission with the security
        community. Please do not submit any personal information; we are not
        responsible for the contents of your submission.
      </Typography>
    </Box>
  );
};

export default FileUpload;

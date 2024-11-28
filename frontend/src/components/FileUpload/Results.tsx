import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Divider,
  Button,
} from '@mui/material';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ProgressProvider from '../../context/ProgressProvider';

const ResultsPage: React.FC = () => {
  const { fileID } = useParams<{ fileID: string }>();
  const [fileDetails, setFileDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        setLoading(true); // Ensure loading is true before fetch starts
        const response = await fetch(`/api/file/${fileID}`);
        const data = await response.json();

        if (response.ok) {
          setTimeout(() => {
            setFileDetails(data);
            setLoading(false); // Set loading to false after updating fileDetails
            setError(null);
          }, 500); // Optional delay for animation
        } else {
          setError(data.error || 'Failed to fetch file details.');
          setLoading(false);
        }
      } catch (err) {
        setError('An error occurred while fetching file details.');
        setLoading(false);
      }
    };

    fetchFileDetails();
  }, [fileID]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          textAlign: 'center',
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 1000,
          width: '100%',
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          File Analysis Results
        </Typography>
        <Divider sx={{ marginBottom: 3 }} />

        <Grid container spacing={4}>
          <Grid
            item
            xs={12}
            sm={4}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 5,
            }}
          >
            <Box sx={{ width: 120, height: 120 }}>
              <ProgressProvider
                valueStart={0}
                valueEnd={fileDetails?.prediction_confidence}
              >
                {(value) => (
                  <CircularProgressbar
                    value={value}
                    text={`${value}%`}
                    counterClockwise={true}
                    styles={buildStyles({
                      textColor: '#000',
                      pathColor:
                        fileDetails?.prediction_label === 'Malware'
                          ? '#ff4d4d'
                          : '#4caf50',
                      trailColor: '#d6d6d6',
                    })}
                  />
                )}
              </ProgressProvider>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 'bold', marginTop: 1 }}
                align="center"
              >
                Confidence
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={8}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="subtitle1" fontWeight="bold">
                  File Name:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  {fileDetails?.file_name}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Uploaded On:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  {new Date(fileDetails?.created_at).toLocaleString()}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Scan Result:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="body1"
                  color={
                    fileDetails?.prediction_label === 'Malware'
                      ? 'error'
                      : 'primary'
                  }
                >
                  {fileDetails?.prediction_label}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Family:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{fileDetails?.family}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ marginY: 3 }} />

        {/* Back Button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
          >
            Back to Main Page
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ResultsPage;

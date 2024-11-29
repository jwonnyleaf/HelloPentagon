import React, { useEffect, useRef, useState } from 'react';
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
  TextField,
  Avatar,
} from '@mui/material';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ProgressProvider from '../../context/ProgressProvider';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const ResultsPage: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<
    { sender: string; message: string }[]
  >([]);
  const [chatInput, setChatInput] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const { fileID } = useParams<{ fileID: string }>();
  const [fileDetails, setFileDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [recommendationFetched, setRecommendationFetched] = useState(false);
  const [recommendationResponse, setRecommendationResponse] = useState<
    string | null
  >(null);

  const tempStr =
    'Based on the analysis provided, here are my recommendations: 1. **Recommendation**: Quarantine the File - **Justification**: The file has a confidence score of 75.96, indicating a significant likelihood of being malicious. The detection status "Needs Attention" suggests that the file poses a potential threat. Additionally, the malware family type is identified as a "backdoor," which is particularly concerning as it can allow unauthorized access to your system. 2. **Additional Precautions**: - **Conduct a Full System Scan**: Use updated antivirus or anti-malware software to perform a comprehensive scan of your system to detect any other potentially malicious files or activities. - **Update Security Software**: Ensure that your antivirus and anti-malware software are up-to-date with the latest definitions to improve detection and prevention capabilities. - **Review System Logs**: Check system and network logs for any unusual activity that might indicate that the backdoor has been exploited. - **Change Passwords**: As a precaution, change passwords for any accounts that might have been accessed from the affected system. - **Backup Important Data**: Regularly back up important files to an external drive or secure cloud storage to prevent data loss in case of further infection or attack. - **Educate Users**: Remind all users of the importance of not downloading or executing unknown files and to be cautious of email attachments and links from unknown sources. These steps will help mitigate the risk and protect your system from potential exploitation by the detected backdoor malware.';

  const formatAPIResponse = (response: string) => {
    let formattedResponse = response.replace(/- /g, '\n  * ');
    formattedResponse = formattedResponse.replace(/(\d\.)\s/g, '\n$1 ');
    console.log(formattedResponse);
    return formattedResponse;
  };

  const queryInitialRecommendation = async () => {
    if (!fileDetails || recommendationFetched || loadingChat) return;

    setLoadingChat(true);
    try {
      const payload = {
        query: 'What recommendations do you have based on this analysis?',
        malwareDetails: {
          confidence: fileDetails.prediction_confidence || 0,
          label: fileDetails.prediction_label || 'Unknown',
          family: fileDetails.family || 'Unknown',
        },
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setRecommendationResponse(data.response);
        setRecommendationFetched(true);
      } else {
        setRecommendationResponse(
          'Failed to fetch the recommendation. Try again later!'
        );
      }
    } catch (err) {
      setRecommendationResponse(
        'An error occurred while fetching the recommendation.'
      );
    } finally {
      setLoadingChat(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', message: userMessage },
    ]);

    setChatInput('');
    setLoadingChat(true);

    try {
      const payload = {
        query: userMessage,
        malwareDetails: {
          confidence: fileDetails?.prediction_confidence || 0,
          label: fileDetails?.prediction_label || 'Unknown',
          family: fileDetails?.family || 'Unknown',
        },
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setChatMessages((prev) => [
          ...prev,
          { sender: 'AI', message: data.response },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'AI',
            message: 'Failed to fetch a response. Please try again.',
          },
        ]);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'AI',
          message:
            'An error occurred. Please check your connection and try again.',
        },
      ]);
    } finally {
      setLoadingChat(false);
    }
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        console.log({ fileID });
        setLoading(true);
        const response = await fetch(`/api/file/${fileID}`);
        const data = await response.json();

        if (response.ok) {
          setTimeout(() => {
            setFileDetails(data);
            setLoading(false);
            setError(null);
          }, 500);
        } else {
          setError(data.error || 'Failed to fetch file details.');
          setLoading(false);
        }
      } catch (err) {
        setError('An error occurred while fetching file details.');
        setLoading(false);
      }
    };
    if (fileDetails || !fileID) return;
    fetchFileDetails();
  }, [fileID]);

  useEffect(() => {
    if (fileDetails && !recommendationFetched && !loadingChat) {
      queryInitialRecommendation();
    }
  }, [fileDetails, recommendationFetched, loadingChat]);

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
        gap: 8,
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

        <Paper
          elevation={3}
          sx={{ padding: 4, marginTop: 2, minHeight: '300px' }}
        >
          <Typography variant="h5" gutterBottom>
            Recommendation
          </Typography>
          {loadingChat ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100px',
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              <Typography variant="body1" component="div">
                <ReactMarkdown>
                  {recommendationResponse || 'No recommendation available yet.'}
                </ReactMarkdown>
              </Typography>
            </Box>
          )}
        </Paper>

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
      <Paper elevation={3} sx={{ width: '25vw', padding: 4 }}>
        <Typography variant="h5" gutterBottom>
          Pentagon AI Chat
        </Typography>
        <Box
          ref={chatBoxRef}
          sx={{
            width: '100%',
            height: '60vh',
            overflowY: 'auto',
            marginBottom: 2,
            padding: 2,
          }}
        >
          {chatMessages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: 1,
                marginBottom: 2,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: msg.sender === 'user' ? '#087E8B' : '#f5f5f5',
                  color: msg.sender === 'user' ? '#fff' : '#000',
                }}
              >
                {msg.sender === 'user' ? 'U' : 'AI'}
              </Avatar>

              <Typography
                variant="body1"
                sx={{
                  display: 'inline-block',
                  padding: 2,
                  borderRadius: 2,
                  background:
                    msg.sender === 'user'
                      ? 'linear-gradient(to right top, #087e8b, #1c7c87, #287a84, #307880, #37767d)'
                      : '#eeeeee',
                  color: msg.sender === 'user' ? '#fff' : '#000',
                  maxWidth: '80%',
                  wordWrap: 'break-word',
                  boxShadow: '0px 3px 6px rgba(0,0,0,0.1)',
                }}
              >
                {msg.message}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your question..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={loadingChat}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            disabled={loadingChat}
            sx={{ marginLeft: 2 }}
          >
            {loadingChat ? <CircularProgress size={20} /> : 'Send'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ResultsPage;

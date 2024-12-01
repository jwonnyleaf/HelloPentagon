import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Stack } from '@mui/material';
import { useAuth } from '../../context/AuthProvider';
import { useSocket } from '../../context/SocketProvider';

type Alert = {
  id: number;
  file_id: number;
  file_name: string;
  title: string;
  message: string;
  created_at: string;
};

const Alerts: React.FC = () => {
  const { userID } = useAuth();
  const socket = useSocket();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const fetchAlerts = async () => {
    try {
      const response = await fetch(`/api/notifications/${userID}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setAlerts(data);
      } else {
        console.error('Expected an array but received:', data);
        setAlerts([]);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setAlerts([]);
    }
  };

  const dismissAlert = async (alertID: number) => {
    try {
      await fetch(`/api/notifications/${alertID}/dismiss`, { method: 'PUT' });
      fetchAlerts();
      console.log('Alert dismissed');
      socket.emit('update_alerts');
    } catch (error) {
      console.error('Error dismissing alert:', error);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          marginBottom: 4,
          fontWeight: 'bold',
        }}
      >
        Alerts
      </Typography>
      {alerts.length === 0 ? (
        <Typography
          sx={{
            textAlign: 'center',
            fontSize: '1.2rem',
            color: 'gray',
            marginTop: 4,
          }}
        >
          No active alerts at the moment.
        </Typography>
      ) : (
        <Stack spacing={3}>
          {alerts.map((alert) => (
            <Paper
              key={alert.id}
              elevation={3}
              sx={{
                padding: 3,
                borderRadius: '16px',
                backgroundColor: '#f9f9f9',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', marginBottom: 2, color: '#087E8B' }}
              >
                {alert.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{ marginBottom: 2, lineHeight: 1.6 }}
              >
                {alert.message}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ marginBottom: 3 }}
              >
                File: <strong>{alert.file_name}</strong> (ID: {alert.file_id})
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => dismissAlert(alert.id)}
                sx={{
                  backgroundColor: '#087E8B',
                  ':hover': {
                    backgroundColor: '#065a60',
                  },
                  textTransform: 'capitalize',
                  fontWeight: 'bold',
                }}
              >
                Dismiss
              </Button>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default Alerts;

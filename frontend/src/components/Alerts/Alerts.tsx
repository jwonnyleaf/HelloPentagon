import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useAuth } from '../../context/AuthProvider';

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
    } catch (error) {
      console.error('Error dismissing alert:', error);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Alerts
      </Typography>
      {alerts.length === 0 ? (
        <Typography>No active alerts</Typography>
      ) : (
        alerts.map((alert) => (
          <Paper key={alert.id} sx={{ padding: 2, marginBottom: 2 }}>
            <Typography variant="h6">{alert.title}</Typography>
            <Typography variant="body1">{alert.message}</Typography>
            <Typography variant="body2" color="textSecondary">
              File: {alert.file_name} (ID: {alert.file_id})
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => dismissAlert(alert.id)}
            >
              Dismiss
            </Button>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default Alerts;

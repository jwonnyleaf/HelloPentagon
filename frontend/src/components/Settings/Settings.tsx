import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import { useSnackbar } from '../../context/SnackbarProvider';
import { useAuth } from '../../context/AuthProvider';

const Settings: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const handleLogout = () => {
    logout();
    showSnackbar('Logged Out Successfully', 'success');
    navigate('/login');
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Button
        variant="contained"
        color="error"
        onClick={handleLogout}
        sx={{ marginTop: 2 }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Settings;

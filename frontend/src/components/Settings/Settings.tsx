import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../context/SnackbarProvider';
import { useAuth } from '../../context/AuthProvider';

const Settings: React.FC = () => {
  const { logout, userID, email, username, level, setLevel } = useAuth();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const [newPassword, setNewPassword] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(level || 'Beginner');
  const [saving, setSaving] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const handleLogout = () => {
    logout();
    showSnackbar('Logged Out Successfully', 'success');
    navigate('/login');
  };

  const handleChangeLevel = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/set-level', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userID, level: selectedLevel }),
      });

      if (response.ok) {
        setLevel(selectedLevel);
        showSnackbar('Proficiency Level Updated Successfully', 'success');
      } else {
        showSnackbar('Failed to Update', 'error');
      }
    } catch (error) {
      showSnackbar('An error occurred while updating the level', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        showSnackbar('Password Updated Successfully', 'success');
        setNewPassword('');
        setIsEditingPassword(false);
      } else {
        showSnackbar(data.error || 'Failed to update', 'error');
      }
    } catch (error) {
      showSnackbar('An error occurred while updating the password', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      sx={{
        padding: 4,
        maxWidth: 1000,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>

      {/* Account Information */}
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>
          Account Information
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <Typography variant="body1">
          <strong>Full Name:</strong> {username}
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          <strong>Email:</strong> {email}
        </Typography>
        <Box
          sx={{ display: 'flex', alignItems: 'center', marginTop: 2, gap: 2 }}
        >
          <Typography variant="body1">
            <strong>Password:</strong> ******
          </Typography>
          {isEditingPassword ? (
            <></>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setIsEditingPassword(true)}
              sx={{ flexShrink: 0 }}
            >
              Change Password
            </Button>
          )}
        </Box>
        {isEditingPassword && (
          <Box sx={{ marginTop: 2 }}>
            <TextField
              fullWidth
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleChangePassword}
              disabled={saving || !newPassword}
            >
              {saving ? 'Updating...' : 'Update Password'}
            </Button>
          </Box>
        )}
      </Paper>

      {/* Proficiency Level */}
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>
          Proficiency Level
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <FormControl fullWidth>
          <InputLabel>Level</InputLabel>
          <Select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            fullWidth
          >
            <MenuItem value="Beginner">Beginner</MenuItem>
            <MenuItem value="Intermediate">Intermediate</MenuItem>
            <MenuItem value="Expert">Expert</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleChangeLevel}
          disabled={saving}
          sx={{ marginTop: 2 }}
        >
          {saving ? 'Saving...' : 'Update Level'}
        </Button>
      </Paper>

      {/* Logout Button */}
      <Button
        variant="contained"
        color="error"
        onClick={handleLogout}
        sx={{ display: 'block', marginTop: 3 }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Settings;

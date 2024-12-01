import {
  Box,
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import Navbar from '../Navbar/Navbar';
import { useState } from 'react';

// Import Pages
import Overview from './Overview';
import FileUpload from '../FileUpload/FileUpload';
import History from '../History/History';
import Alerts from '../Alerts/Alerts';
import Settings from '../Settings/Settings';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useAuth } from '../../context/AuthProvider';
import { useSnackbar } from '../../context/SnackbarProvider';

const Dashboard: React.FC = () => {
  const { userID, email, username, level, setLevel } = useAuth();
  const setup = level === null;
  const showSnackbar = useSnackbar();
  const [activeContent, setActiveContent] = useState('Overview');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [openDialog, setOpenDialog] = useState(setup);
  const contentMapping: Record<string, JSX.Element> = {
    Overview: <Overview onNavItemClick={setActiveContent} />,
    'File Upload': <FileUpload />,
    History: <History />,
    Alerts: <Alerts />,
    Settings: <Settings />,
  };

  const handleSaveLevel = async (level: string) => {
    try {
      const response = await fetch('/api/set-level', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userID, level: level }),
      });

      if (response.ok) {
        setOpenDialog(false);
        setLevel(level);
        showSnackbar('Proficiency Saved', 'success');
      } else {
        showSnackbar('Something went wrong.', 'error');
      }
    } catch (error) {
      console.error('Error saving level:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar
        email={email}
        username={username}
        activePage={activeContent}
        onNavItemClick={setActiveContent}
      />
      <Box sx={{ flex: 1, padding: 3 }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ marginBottom: '16px' }}
        >
          <Link
            underline="hover"
            color="inherit"
            onClick={() => setActiveContent('Overview')}
            sx={{ cursor: 'pointer' }}
          >
            Home
          </Link>
          <Typography color="text.primary">{activeContent}</Typography>
        </Breadcrumbs>

        <Box sx={{ mt: 3 }}>{contentMapping[activeContent]}</Box>

        {/* Overlay Popup */}
        <Dialog
          open={openDialog}
          onClose={() => {}}
          disableEscapeKeyDown
          aria-labelledby="setup-level-dialog"
        >
          <DialogTitle id="setup-level-dialog">
            Select Your Proficiency Level
          </DialogTitle>
          <DialogContent>
            <Typography>
              Welcome to the Pentagon platform! Please select your proficiency
              level to personalize your experience.
            </Typography>
            <Box sx={{ marginTop: 2 }}>
              <Select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                displayEmpty
                fullWidth
              >
                <MenuItem value="" disabled>
                  Choose a level
                </MenuItem>
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Expert">Expert</MenuItem>
              </Select>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                if (selectedLevel) {
                  handleSaveLevel(selectedLevel);
                }
              }}
              disabled={!selectedLevel}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Dashboard;

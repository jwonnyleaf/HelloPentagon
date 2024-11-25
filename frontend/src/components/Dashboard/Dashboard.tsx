import {
  Box,
  Breadcrumbs,
  Drawer,
  Link,
  Toolbar,
  Typography,
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

const Dashboard: React.FC = () => {
  const { email, username, logout } = useAuth();
  const [activeContent, setActiveContent] = useState('Overview');
  const contentMapping: Record<string, JSX.Element> = {
    Overview: <Overview onNavItemClick={setActiveContent} />,
    'File Upload': <FileUpload />,
    History: <History />,
    Alerts: <Alerts />,
    Settings: <Settings logout={logout} />,
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
      </Box>
    </Box>
  );
};

export default Dashboard;

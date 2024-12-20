import {
  Avatar,
  Badge,
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';

// Constants
import { drawerWidth } from '../../constants';

// Images
import FileAnalysisCardIMG from '@assets/images/fileanalysisimage.png';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import ShieldIcon from '@mui/icons-material/Shield';
import HistoryIcon from '@mui/icons-material/History';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAuth } from '../../context/AuthProvider';
import { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketProvider';

interface NavbarProps {
  email: string | null;
  username: string | null;
  onNavItemClick: (contentKey: string) => void;
  activePage: string;
}

const Navbar: React.FC<NavbarProps> = ({
  email,
  username,
  onNavItemClick,
  activePage,
}) => {
  const { userID } = useAuth();
  const socket = useSocket();
  const [alertCount, setAlertCount] = useState(0);

  const fetchAlertCount = async () => {
    try {
      const response = await fetch(`/api/notifications/${userID}/count`);
      const data = await response.json();
      setAlertCount(data.count || 0);
    } catch (error) {
      console.error('Error fetching alert count:', error);
      setAlertCount(0);
    }
  };

  useEffect(() => {
    fetchAlertCount();

    socket.on('update_alerts', () => {
      fetchAlertCount();
    });
  }, [socket]);

  const navItems = [
    { label: 'Overview', icon: <HomeIcon />, contentKey: 'Overview' },
    { label: 'History', icon: <HistoryIcon />, contentKey: 'History' },
    {
      label: 'Alerts',
      icon: <NotificationsIcon />,
      contentKey: 'Alerts',
      badge: alertCount,
    },
    { label: 'Settings', icon: <SettingsIcon />, contentKey: 'Settings' },
  ];

  const getInitials = (name: string | null): string => {
    if (!name) return '';

    const words = name.split(' ');
    const initials = words.map((word) => word.charAt(0).toUpperCase());
    return initials.slice(0, 2).join('');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: '#F8F9FA',
        }}
      >
        {/* Toolbar Section */}
        <Toolbar>
          <Typography
            variant="h6"
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavItemClick('Overview')}
            noWrap
          >
            <ShieldIcon fontSize="large" color="primary" />
            <p className="font-rubikmono text-2xl tracking-wider text-cyan">
              PENTAGON
            </p>
          </Typography>
        </Toolbar>
        <Divider sx={{ marginY: '8px', backgroundColor: '#ccc' }} />

        {/* Navigation Section */}
        <List sx={{ paddingX: '1rem', flexGrow: 1 }}>
          {navItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => onNavItemClick(item.contentKey as string)}
                disableRipple
                className="gap-4"
                sx={{
                  borderRadius: '16px',
                  padding: '14px',
                  backgroundColor:
                    activePage === item.contentKey ? 'white' : 'transparent',
                  boxShadow:
                    activePage === item.contentKey
                      ? '0px 4px 12px rgba(0, 0, 0, 0.1)'
                      : 'none',
                  color: activePage === item.contentKey ? '#333' : 'inherit',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: activePage === item.contentKey ? 'white' : 'inherit',
                    backgroundColor:
                      activePage === item.contentKey ? '#087E8B' : 'white',
                    borderRadius: '14px',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 'auto',
                  }}
                >
                  {item.badge ? (
                    <Badge badgeContent={item.badge}>{item.icon}</Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    variant: 'h6',
                    sx: {
                      color:
                        activePage === item.contentKey ? 'black' : '#b8c1cd',
                      fontSize: '1rem',
                      fontFamily: 'Montserrat',
                      fontWeight: 700,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Account Section */}
        <Box
          sx={{
            backgroundColor: '#5A4FCF',
            backgroundImage: `url(${FileAnalysisCardIMG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            margin: '1rem',
            height: '200px',
          }}
        >
          <Avatar
            sx={{
              backgroundColor: '#fff',
              width: 48,
              height: 48,
            }}
          >
            <Typography sx={{ color: 'black', fontWeight: 700 }}>
              {getInitials(username)}
            </Typography>
          </Avatar>
          <Box>
            <Typography
              variant="body1"
              sx={{
                fontFamily: 'Montserrat',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'white',
              }}
            >
              {username}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'Montserrat',
                fontSize: '1.25rem',
                color: 'white',
                opacity: 0.8,
              }}
            >
              {email}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Navbar;

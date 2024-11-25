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

interface NavbarProps {
  onNavItemClick: (contentKey: string) => void;
  activePage: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavItemClick, activePage }) => {
  const navItems = [
    { label: 'Overview', icon: <HomeIcon />, contentKey: 'Overview' },
    { label: 'History', icon: <HistoryIcon />, contentKey: 'History' },
    {
      label: 'Alerts',
      icon: <NotificationsIcon />,
      contentKey: 'Alerts',
      badge: 3,
    },
    { label: 'Settings', icon: <SettingsIcon />, contentKey: 'Settings' },
  ];

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
          backgroundColor: 'white',
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
            <Typography sx={{ color: 'black', fontWeight: 700 }}>JD</Typography>
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
              John Doe
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
              johndoe@tamu.edu
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Navbar;

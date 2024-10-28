import {
  Badge,
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
      <div className="bg-white h-full py-5">
        <Toolbar className="text-cyan">
          <Typography
            variant="h6"
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavItemClick('Overview')}
            noWrap
          >
            <ShieldIcon fontSize="large" />
            <p className="font-rubikmono text-2xl tracking-wider">PENTAGON</p>
          </Typography>
        </Toolbar>
        <Divider sx={{ marginY: '8px', backgroundColor: '#ccc' }} />
        <List sx={{ paddingX: '1rem' }}>
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
      </div>
    </Drawer>
  );
};

export default Navbar;

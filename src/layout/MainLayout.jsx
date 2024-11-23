import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import LogoutIcon from '@mui/icons-material/Logout';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const storedData = JSON.parse(localStorage.getItem("user"));

  // Declare accessPermissions outside the block
  let accessPermissions = [];

  if (storedData.userType === "admin") {
    accessPermissions = ["admin", "user"]; // Array of permissions for admin
  } else {
    accessPermissions = ["user"]; // Array of permissions for user
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

    // Handle open modal (triggered when the user clicks the logout button)
    const handleOpenModal = () => {
      setOpenModal(true);
    };
  
    // Handle close modal without logging out
    const handleCloseModal = () => {
      setOpenModal(false);
    };
  
    // Handle logout functionality
    const handleLogout = () => {
      // Remove token and user from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
  
      // Redirect to the homepage or login page after logout
      navigate('/');
    };

  return (
    <>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Sugar Montoring System
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
         <List>
            <ListItem disablePadding sx={{ display: 'block' }} >
                <ListItemButton
                sx={[
                    {
                    minHeight: 48,
                    px: 2.5,
                    },
                    open
                    ? {
                        justifyContent: 'initial',
                        }
                    : {
                        justifyContent: 'center',
                        },
                ]}
                onClick={() => handleNavigation('/dashboard')}
                >
                <ListItemIcon
                    sx={[
                    {
                        minWidth: 0,
                        justifyContent: 'center',
                    },
                    open
                        ? {
                            mr: 3,
                        }
                        : {
                            mr: 'auto',
                        },
                    ]}
                >
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText
                    primary="Dashboard"
                    sx={[
                    open
                        ? {
                            opacity: 1,
                        }
                        : {
                            opacity: 0,
                        },
                    ]}
                />
                </ListItemButton>
            </ListItem>

            {accessPermissions.includes("admin") && ( // Only render if the user has "admin" permission
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                        justifyContent: 'initial',
                      }
                    : {
                        justifyContent: 'center',
                      },
                ]}
                onClick={() => handleNavigation('/dashboard/users')}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                    },
                    open
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: 'auto',
                        },
                  ]}
                >
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Users"
                  sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          )}
          {accessPermissions.includes("user") && ( 
            <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                sx={[
                    {
                    minHeight: 48,
                    px: 2.5,
                    },
                    open
                    ? {
                        justifyContent: 'initial',
                        }
                    : {
                        justifyContent: 'center',
                        },
                ]}
                onClick={() => handleNavigation('/dashboard/monitoring')}
                >
                <ListItemIcon
                    sx={[
                    {
                        minWidth: 0,
                        justifyContent: 'center',
                    },
                    open
                        ? {
                            mr: 3,
                        }
                        : {
                            mr: 'auto',
                        },
                    ]}
                >
                    <MonitorHeartIcon />
                </ListItemIcon>
                <ListItemText
                    primary="Daily Monitoring"
                    sx={[
                    open
                        ? {
                            opacity: 1,
                        }
                        : {
                            opacity: 0,
                        },
                    ]}
                />
                </ListItemButton>
            </ListItem>
            )}
            <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                sx={[
                    {
                    minHeight: 48,
                    px: 2.5,
                    },
                    open
                    ? {
                        justifyContent: 'initial',
                        }
                    : {
                        justifyContent: 'center',
                        },
                ]}
                onClick={() => handleNavigation('/dashboard/sugarConverter')}
                >
                <ListItemIcon
                    sx={[
                    {
                        minWidth: 0,
                        justifyContent: 'center',
                    },
                    open
                        ? {
                            mr: 3,
                        }
                        : {
                            mr: 'auto',
                        },
                    ]}
                >
                    <CalculateIcon />
                </ListItemIcon>
                <ListItemText
                    primary="Sugar Converter"
                    sx={[
                    open
                        ? {
                            opacity: 1,
                        }
                        : {
                            opacity: 0,
                        },
                    ]}
                />
                </ListItemButton>
            </ListItem>
            </List>
        <Divider />
        <List>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                px: 2.5,
                justifyContent: open ? 'initial' : 'center',
              }}
              onClick={handleOpenModal}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: 'center',
                  mr: open ? 3 : 'auto',  // Align icon based on open state
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                sx={{
                  opacity: open ? 1 : 0,
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />

         {/* Confirmation Modal */}
      </Box>
    </Box>
    <Dialog open={openModal} onClose={handleCloseModal}>
    <DialogTitle>Are you sure you want to log out?</DialogTitle>
    <DialogContent>
      <p>If you log out, you will need to log in again to access your account.</p>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseModal} variant="contained" color="error">
        Cancel
      </Button>
      <Button onClick={handleLogout} variant="contained" color="success">
        Log Out
      </Button>
    </DialogActions>
  </Dialog>
</>
  );
}

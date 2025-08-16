import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Avatar, 
  Menu, 
  MenuItem, 
  IconButton,
  Chip,
  Divider
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  AdminPanelSettings as AdminIcon,
  ExitToApp as LogoutIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ 
  children, 
  title = 'AI Pills Platform' 
}) => {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    handleMenuClose();
  };

  const getPageTitle = () => {
    const path = router.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/admin')) return 'Admin Panel';
    return title;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          {/* Logo/Title */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Pills Platform
          </Typography>

          {/* Page Title */}
          <Typography variant="subtitle1" sx={{ mr: 3, opacity: 0.9 }}>
            {getPageTitle()}
          </Typography>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
            {/* Dashboard Button */}
            <Button
              color="inherit"
              startIcon={<DashboardIcon />}
              onClick={() => handleNavigation('/dashboard')}
              variant={router.pathname.startsWith('/dashboard') ? 'outlined' : 'text'}
              sx={{ 
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': { borderColor: 'rgba(255,255,255,0.5)' }
              }}
            >
              Dashboard
            </Button>

            {/* Admin Panel Button (only for admins) */}
            {isAdmin && (
              <Button
                color="inherit"
                startIcon={<AdminIcon />}
                onClick={() => handleNavigation('/admin')}
                variant={router.pathname.startsWith('/admin') ? 'outlined' : 'text'}
                sx={{ 
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': { borderColor: 'rgba(255,255,255,0.5)' }
                }}
              >
                Admin
              </Button>
            )}
          </Box>

          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Admin Badge */}
            {isAdmin && (
              <Chip
                label="Admin"
                size="small"
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontSize: '0.75rem'
                }}
              />
            )}

            {/* User Avatar and Menu */}
            <IconButton
              onClick={handleMenuOpen}
              sx={{ 
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <Avatar sx={{ width: 32, height: 32, backgroundColor: 'primary.dark' }}>
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                sx: { minWidth: 200, mt: 1 }
              }}
            >
              {/* User Info */}
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {user?.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
                {isAdmin && (
                  <Chip
                    label="Administrator"
                    size="small"
                    color="primary"
                    sx={{ mt: 0.5, fontSize: '0.7rem' }}
                  />
                )}
              </Box>
              
              <Divider />

              {/* Navigation Items */}
              <MenuItem onClick={() => handleNavigation('/dashboard')}>
                <DashboardIcon sx={{ mr: 1, fontSize: 20 }} />
                Dashboard
              </MenuItem>

              {isAdmin && (
                <MenuItem onClick={() => handleNavigation('/admin')}>
                  <AdminIcon sx={{ mr: 1, fontSize: 20 }} />
                  Admin Panel
                </MenuItem>
              )}

              <Divider />

              {/* Logout */}
              <MenuItem 
                onClick={logout}
                sx={{ color: 'error.main' }}
              >
                <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, backgroundColor: 'grey.50' }}>
        {children}
      </Box>
    </Box>
  );
};

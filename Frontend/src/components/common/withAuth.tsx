import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

interface WithAuthOptions {
  requireAdmin?: boolean;
  redirectTo?: string;
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const { requireAdmin = false, redirectTo = '/auth/login' } = options;

  const AuthenticatedComponent: React.FC<P> = (props) => {
    const { user, loading, isAuthenticated, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!isAuthenticated) {
          // Not authenticated, redirect to login
          router.push(redirectTo);
          return;
        }

        if (requireAdmin && !isAdmin) {
          // Requires admin but user is not admin, redirect to dashboard
          router.push('/dashboard');
          return;
        }
      }
    }, [loading, isAuthenticated, isAdmin, router]);

    // Show loading spinner while checking authentication
    if (loading) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: 2
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Checking authentication...
          </Typography>
        </Box>
      );
    }

    // Show loading if redirecting
    if (!isAuthenticated || (requireAdmin && !isAdmin)) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: 2
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Redirecting...
          </Typography>
        </Box>
      );
    }

    // User is authenticated and has required permissions
    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

  return AuthenticatedComponent;
}

// Convenience HOCs for common use cases
export const withUserAuth = <P extends object>(Component: React.ComponentType<P>) =>
  withAuth(Component, { requireAdmin: false });

export const withAdminAuth = <P extends object>(Component: React.ComponentType<P>) =>
  withAuth(Component, { requireAdmin: true });

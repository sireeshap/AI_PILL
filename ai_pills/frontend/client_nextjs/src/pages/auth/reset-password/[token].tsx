// In ai_pills/frontend/client_nextjs/src/pages/auth/reset-password/[token].tsx
import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container, TextField, Button, Typography, Box, Paper, Alert } from '@mui/material'; // Added Alert
import Link from 'next/link'; // Corrected import

const ResetPasswordPage: NextPage = () => {
  const router = useRouter();
  const { token } = router.query; // Get token from URL query parameter (string | string[] | undefined)

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    if (!token || Array.isArray(token)) {
        setError("Invalid or missing reset token.");
        return;
    }

    console.log('Reset password attempt for token:', token, 'with new password.');
    // Placeholder for API call to backend (e.g., /api/v1/auth/reset-password)
    // Example:
    // try {
    //   const response = await fetch('/api/proxy/api/v1/auth/reset-password', { // Example proxy URL
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ token: token, new_password: password })
    //   });
    //   if (response.ok) {
    //     setMessage('Your password has been reset successfully! You can now sign in with your new password.');
    //     // Optionally redirect to login after a delay
    //     // setTimeout(() => router.push('/auth/login'), 3000);
    //   } else {
    //     const errorData = await response.json();
    //     setError(errorData.detail || 'Failed to reset password. The link may be invalid or expired.');
    //   }
    // } catch (err) {
    //   setError('An error occurred. Please try again.');
    //   console.error('Reset password request error:', err);
    // }
    // For placeholder:
    setMessage(`(Placeholder) Password for token ${token} would be reset.`);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Reset Your Password
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, mb: 2, textAlign: 'center' }}>
          Enter your new password below.
        </Typography>

        {/* Displaying token for dev purposes, remove in prod or handle appropriately */}
        {token && !Array.isArray(token) && <Typography variant="caption" sx={{mb:1}}>Dev: Resetting for token: {token.substring(0,10)}...</Typography>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="New Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error} // Show error state if passwords don't match initially
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!error && password !== confirmPassword} // Show error if they don't match after trying to submit
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>
          )}
          {message && (
            <Alert severity="success" sx={{ mt: 2, width: '100%' }}>{message}</Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!!message} // Disable if success message is shown
          >
            Reset Password
          </Button>
          {message && (
             <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt:1 }}>
                <Link href="/auth/login" passHref>
                <Button variant="outlined">
                    Proceed to Sign In
                </Button>
                </Link>
            </Box>
          )}
          {!message && (
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Link href="/auth/login" passHref>
                <Typography component="span" variant="body2" sx={{ cursor: 'pointer', color: 'primary.main' }}> {/* Changed to span */}
                    Back to Sign In
                </Typography>
                </Link>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPasswordPage;

// In ai_pills/frontend/client_nextjs/src/pages/auth/forgot-password.tsx
import React, { useState } from 'react';
import { NextPage } from 'next';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import Link from 'next/link'; // Corrected import

const ForgotPasswordPage: NextPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); // For user feedback

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(''); // Clear previous messages
    
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('If an account with that email exists, a password reset link has been sent.');
        console.log('Password reset link request successful:', data);
      } else {
        setMessage(data.detail || 'Failed to send reset link. Please try again.');
        console.error('Password reset link request failed:', data);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error('Password reset link request error:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Forgot Your Password?
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, mb: 2, textAlign: 'center' }}>
          No worries! Enter your email address below, and we'll send you a link to reset your password.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {message && (
            <Typography color={message.startsWith('(Placeholder)') ? "textSecondary" : "error"} sx={{ mt: 2, textAlign: 'center' }}>
              {message}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Send Reset Link
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Link href="/auth/login" passHref>
              <Typography component="span" variant="body2" sx={{ cursor: 'pointer', color: 'primary.main' }}> {/* Changed to span */}
                Back to Sign In
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;

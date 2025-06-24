// In ai_pills/frontend/client_nextjs/src/pages/auth/register.tsx
import React, { useState } from 'react';
import { NextPage } from 'next';
import { Container, TextField, Button, Typography, Box, Paper, CircularProgress, Alert } from '@mui/material'; // Added CircularProgress, Alert
import Link from 'next/link';
import { useRouter } from 'next/router'; // Added useRouter

const RegisterPage: NextPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json(); // Attempt to parse JSON for both success and error

      if (response.ok) {
        console.log('Registration successful:', data);
        setMessage('Registration successful! Please proceed to login.');
        // Optionally redirect to login after a delay or on button click
        // setTimeout(() => router.push('/auth/login'), 3000);
      } else {
        setError(data.detail || 'Registration failed. Please try again.');
        console.error('Registration failed:', data);
      }
    } catch (err) {
      console.error('Registration request error:', err);
      setError('An unexpected error occurred during registration. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mt: 2, width: '100%' }}>{message}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading || !!message} // Disable if loading or if registration was successful
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Link href="/auth/login" passHref>
              <Typography component="span" variant="body2" sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': {textDecoration: 'underline'} }}>
                Already have an account? Sign in
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;

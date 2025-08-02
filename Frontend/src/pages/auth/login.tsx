// In ai_pills/frontend/client_nextjs/src/pages/auth/login.tsx
import React, { useState } from 'react';
import { NextPage } from 'next';
import { Container, TextField, Button, Typography, Box, Paper, CircularProgress, Alert } from '@mui/material'; // Added CircularProgress, Alert
import Link from 'next/link';
import { useRouter } from 'next/router'; // Added useRouter

const LoginPage: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    // In a real app, use environment variables for API base URL
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, // FastAPI's OAuth2PasswordRequestForm expects form data
        body: new URLSearchParams({ username: email, password: password }), // 'username' field in form can be email or actual username
      });

      const data = await response.json(); // Try to parse JSON regardless of response.ok for error messages

      if (response.ok) {
        console.log('Login successful:', data);
        if (data.access_token) {
          localStorage.setItem('accessToken', data.access_token); // Store token
          // alert('Login Successful! Token stored. Redirecting to dashboard...'); // Placeholder
          router.push('/dashboard'); // Redirect to dashboard
        } else {
          setError("Login successful but no token received.");
          console.error("Login successful but no token received.", data);
        }
      } else {
        setError(data.detail || 'Login failed. Please check your credentials.');
        console.error('Login failed:', data);
      }
    } catch (err) {
      console.error('Login request error:', err);
      setError('An unexpected error occurred during login. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address or Username"
            name="email"
            autoComplete="email"
            autoFocus
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Link href="/auth/forgot-password" passHref>
              <Typography component="span" variant="body2" sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': {textDecoration: 'underline'} }}>
                Forgot password?
              </Typography>
            </Link>
            <Link href="/auth/register" passHref>
              <Typography component="span" variant="body2" sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': {textDecoration: 'underline'} }}>
                {"Don't have an account? Sign Up"}
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;

// In ai_pills/frontend/client_nextjs/src/pages/dashboard/index.tsx
import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { Container, Typography, Button, List, Box, CircularProgress, Alert, Paper } from '@mui/material';
import Link from 'next/link';
import AgentListItem, { Agent } from '../../components/dashboard/AgentListItem'; // Agent interface is now updated
import { fetchClient } from '../../services/api';
import { useRouter } from 'next/router';
import Head from 'next/head';


const DashboardPage: NextPage = () => {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAgents = async () => {
      setLoading(true);
      setError(null);
      try {
        // Check for token before making API call
        if (!localStorage.getItem('accessToken')) {
            setError("Authentication required. Please log in.");
            setLoading(false);
            // Consider a brief delay before redirecting to allow user to see message
            setTimeout(() => router.push('/auth/login'), 2000);
            return;
        }
        // Actual API call to GET /api/v1/agents (FastAPI backend)
        const fetchedAgents = await fetchClient<Agent[]>('/agents/', { method: 'GET' });
        setAgents(fetchedAgents);
      } catch (err: any) {
        console.error('Failed to fetch agents:', err);
        let errorMessage = err.message || 'Failed to fetch agents.';
        if (err.message && (err.message.includes('401') || err.message.includes('Not authenticated') || err.message.includes('Could not validate credentials'))) {
            errorMessage = 'Session expired or invalid. Redirecting to login...';
            setTimeout(() => router.push('/auth/login'), 2000);
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, [router]); // Add router to dependency array

  const handleEditAgent = (id: string | number) => {
    console.log('Edit agent:', id);
    // router.push(`/dashboard/edit/${id}`); // Example navigation
    alert(`Placeholder: Navigate to edit page for agent ${id}`);
  };

  const handleDeleteAgent = async (id: string | number) => {
    console.log('Attempting to delete agent:', id);
    if (!window.confirm(`Are you sure you want to delete this agent (ID: ${id})?`)) return;

    setError(null); // Clear previous errors
    try {
      await fetchClient<void>(`/agents/${id}`, { method: 'DELETE' });
      setAgents(prevAgents => prevAgents.filter(agent => agent.id !== id));
      alert('Agent deleted successfully.');
    } catch (err: any) {
      console.error('Failed to delete agent:', err);
      setError(err.message || 'Failed to delete agent.');
      if (err.message && (err.message.includes('401') || err.message.includes('Not authenticated'))) {
         // alert('Session expired or invalid. Please log in again.');
         // router.push('/auth/login');
      }
    }
  };

  return (
    <>
    <Head>
        <title>Developer Dashboard - AI Pills</title>
    </Head>
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={0} sx={{ p: {xs:2, sm:3}, mb: 3, backgroundColor: 'transparent' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h4" component="h1" sx={{fontWeight: 'bold'}}>
            Developer Dashboard
          </Typography>
          <Link href="/dashboard/upload" passHref>
            <Button variant="contained" color="primary">
              Upload New Agent
            </Button>
          </Link>
        </Box>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your AI agents, view their status, and access upload tools.
        </Typography>
      </Paper>

      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress size={50} /></Box>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {!loading && !error && agents.length === 0 && (
        <Paper elevation={1} sx={{ p:3, textAlign: 'center', mt: 3 }}>
            <Typography variant="h6">No Agents Found</Typography>
            <Typography variant="body1" color="text.secondary" sx={{mt:1}}>
            You haven't uploaded any agents yet. Click "Upload New Agent" to get started.
            </Typography>
        </Paper>
      )}

      {!loading && !error && agents.length > 0 && (
        <List sx={{width: '100%'}}>
          {agents.map((agent) => (
            <AgentListItem
              key={agent.id}
              agent={agent}
              onEdit={handleEditAgent}
              onDelete={handleDeleteAgent}
            />
          ))}
        </List>
      )}
    </Container>
    </>
  );
};

export default DashboardPage;

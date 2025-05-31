// In ai_pills/frontend/client_nextjs/src/pages/index.tsx
import React, { useState, useEffect } from 'react';
import { NextPage, GetStaticProps } from 'next';
import {
    Container, Typography, Grid, Box, TextField, InputAdornment,
    CircularProgress, Alert, Paper, Button as MuiButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AgentCard, { PublicAgent } from '../components/agents/AgentCard';
import Link from 'next/link';
import { API_BASE_URL } from '../services/api'; // Import API_BASE_URL for direct fetch in GSP
import Head from 'next/head';


interface HomePageProps {
  agents: PublicAgent[];
  error?: string;
}

const HomePage: NextPage<HomePageProps> = ({ agents: initialAgents, error: initialError }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAgents, setFilteredAgents] = useState<PublicAgent[]>(initialAgents || []);
  const [loading, setLoading] = useState<boolean>(false); // For client-side search loading

  useEffect(() => {
    if (!initialAgents) { // If initialAgents is null/undefined (e.g. due to error in GSP)
        setFilteredAgents([]);
        return;
    }
    if (!searchTerm.trim()) {
      setFilteredAgents(initialAgents);
      return;
    }
    setLoading(true);
    const lowerSearchTerm = searchTerm.toLowerCase();
    const timer = setTimeout(() => {
      const results = initialAgents.filter(agent =>
        agent.name.toLowerCase().includes(lowerSearchTerm) ||
        agent.description.toLowerCase().includes(lowerSearchTerm) ||
        (agent.tags && agent.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm))) ||
        agent.developer_username.toLowerCase().includes(lowerSearchTerm) // Changed from developerUsername
      );
      setFilteredAgents(results);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, initialAgents]);

  if (initialError) {
    return (
        <Container sx={{ py: 8, textAlign: 'center' }}>
            <Head><title>Error - AI Pills</title></Head>
            <Alert severity="error" sx={{justifyContent: 'center'}}>Error loading agents: {initialError}</Alert>
        </Container>
    );
  }

  // This case handles if GSP returns empty props but no error (e.g. API returns empty list successfully)
  // or if initialAgents is somehow null/undefined without an error.
  if (!initialAgents && !loading && !initialError) {
    return (
        <Container sx={{ py: 8, textAlign: 'center' }}>
             <Head><title>AI Agent Marketplace - AI Pills</title></Head>
            <Typography>No agents available at the moment. Please check back later!</Typography>
        </Container>
    );
  }


  return (
    <>
    <Head>
        <title>AI Agent Marketplace - AI Pills</title>
        <meta name="description" content="Discover and download innovative AI agents from developers around the world." />
    </Head>
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: {xs: 2, sm: 4}, backgroundColor: 'transparent', mb:4 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Discover AI Agents
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Browse and find innovative AI agents uploaded by developers around the world.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 5, flexWrap: 'wrap' }}>
          <Link href="/auth/login" passHref><MuiButton variant="outlined" color="primary">Login</MuiButton></Link>
          <Link href="/auth/register" passHref><MuiButton variant="outlined" color="secondary">Register</MuiButton></Link>
          <Link href="/dashboard" passHref><MuiButton variant="contained" color="primary">My Dashboard</MuiButton></Link>
          <Link href="/admin" passHref><MuiButton variant="contained" color="error">Admin Panel</MuiButton></Link>
        </Box>

        <Box sx={{ mb: 5, display: 'flex', justifyContent: 'center' }}>
          <TextField
            fullWidth
            sx={{ maxWidth: 700 }}
            variant="outlined"
            placeholder="Search agents by name, tag, description, or developer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 }
            }}
          />
        </Box>
      </Paper>

      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress size={50} /></Box>}

      {!loading && filteredAgents.length === 0 && (
        <Typography variant="h6" align="center" color="text.secondary" sx={{my:5}}>
            {searchTerm ? "No agents found matching your search." : "No agents currently listed. Check back soon!"}
        </Typography>
      )}

      {!loading && filteredAgents.length > 0 && (
        <Grid container spacing={3}>
          {filteredAgents.map((agent) => (
            <Grid item key={agent.id} xs={12} sm={6} md={4}>
              <AgentCard agent={agent} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/public/agents/`);

    if (!res.ok) {
      let errorDetail = `Failed to fetch agents. Status: ${res.status}`;
      try {
        const errorData = await res.json();
        errorDetail = errorData.detail || errorDetail;
      } catch (e) { /* Ignore if error response is not JSON */ }
      throw new Error(errorDetail);
    }
    const agentsData: PublicAgent[] = await res.json();

    return {
      props: {
        agents: agentsData,
      },
      revalidate: 300, // Re-generate the page every 5 minutes
    };
  } catch (error: any) {
    console.error("Error in getStaticProps for HomePage:", error);
    return {
      props: {
        agents: [],
        error: error.message || "An unknown error occurred while fetching agents.",
      },
    };
  }
};

export default HomePage;

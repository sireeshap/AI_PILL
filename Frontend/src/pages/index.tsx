// In ai_pills/frontend/client_nextjs/src/pages/index.tsx
import React, { useState, useEffect } from 'react';
import { NextPage, GetStaticProps } from 'next';
import {
    Container, Typography, Grid, Box, TextField, InputAdornment,
    CircularProgress, Alert, Paper, Button as MuiButton, AppBar, Toolbar, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AgentCard, { PublicAgent } from '../components/agents/AgentCard';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../services/api';
import Head from 'next/head';


interface HomePageProps {
  // Remove props since we're not using getStaticProps anymore
}

const HomePage: NextPage<HomePageProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAgents, setFilteredAgents] = useState<PublicAgent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [allAgents, setAllAgents] = useState<PublicAgent[]>([]);
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  // Client-side data fetching
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/public/agents/`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch agents. Status: ${res.status}`);
        }
        
        const agents = await res.json();
        setAllAgents(agents);
        setFilteredAgents(agents);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching agents:', err);
        setError(err.message || 'Failed to load agents');
        setAllAgents([]);
        setFilteredAgents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAgents(allAgents);
      return;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    const timer = setTimeout(() => {
      const results = allAgents.filter(agent =>
        agent.name.toLowerCase().includes(lowerSearchTerm) ||
        agent.description.toLowerCase().includes(lowerSearchTerm) ||
        (agent.tags && agent.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm)))
      );
      setFilteredAgents(results);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, allAgents]);

  if (error) {
    return (
        <Container sx={{ py: 8, textAlign: 'center' }}>
            <Head><title>Error - AI Pills</title></Head>
            <Alert severity="error" sx={{justifyContent: 'center'}}>Error loading agents: {error}</Alert>
        </Container>
    );
  }

  // Show loading state
  if (loading) {
    return (
        <Container sx={{ py: 8, textAlign: 'center' }}>
             <Head><title>AI Agent Marketplace - AI Pills</title></Head>
            <CircularProgress size={50} />
            <Typography sx={{ mt: 2 }}>Loading agents...</Typography>
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
          {!authLoading && (
            <>
              {!isAuthenticated ? (
                <>
                  <Link href="/auth/login" passHref>
                    <MuiButton variant="contained" color="primary" startIcon={<LoginIcon />}>
                      Login
                    </MuiButton>
                  </Link>
                  <Link href="/auth/register" passHref>
                    <MuiButton variant="outlined" color="primary">
                      Register
                    </MuiButton>
                  </Link>
                </>
              ) : (
                <>
                  <MuiButton 
                    variant="contained" 
                    color="primary" 
                    startIcon={<DashboardIcon />}
                    onClick={() => router.push('/dashboard')}
                  >
                    My Dashboard
                  </MuiButton>
                  {isAdmin && (
                    <MuiButton 
                      variant="contained" 
                      color="secondary" 
                      startIcon={<AdminPanelSettingsIcon />}
                      onClick={() => router.push('/admin')}
                    >
                      Admin Panel
                    </MuiButton>
                  )}
                </>
              )}
            </>
          )}
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
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 3 
        }}>
          {filteredAgents.map((agent) => (
            <Box key={agent.id}>
              <AgentCard agent={agent} />
            </Box>
          ))}
        </Box>
      )}
    </Container>
    </>
  );
};

// Temporarily remove getStaticProps to fix the build issue
// We'll use client-side data fetching instead
// export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
//   try {
//     const res = await fetch(`${API_BASE_URL}/public/agents/`);

//     if (!res.ok) {
//       let errorDetail = `Failed to fetch agents. Status: ${res.status}`;
//       try {
//         const errorData = await res.json();
//         errorDetail = errorData.detail || errorDetail;
//       } catch (e) { /* Ignore if error response is not JSON */ }
//       throw new Error(errorDetail);
//     }
//     const agentsData: PublicAgent[] = await res.json();

//     return {
//       props: {
//         agents: agentsData,
//       },
//       revalidate: 300, // Re-generate the page every 5 minutes
//     };
//   } catch (error: any) {
//     console.error("Error in getStaticProps for HomePage:", error);
//     return {
//       props: {
//         agents: [],
//         error: error.message || "An unknown error occurred while fetching agents.",
//       },
//     };
//   }
// };

export default HomePage;

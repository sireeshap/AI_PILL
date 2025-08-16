// In ai_pills/frontend/client_nextjs/src/pages/dashboard/index.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { NextPage } from 'next';
import { 
  Container, 
  Typography, 
  Button, 
  List, 
  Box, 
  CircularProgress, 
  Alert, 
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Collapse,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AddIcon from '@mui/icons-material/Add';
import AgentListItem, { Agent } from '../../components/dashboard/AgentListItem';
import { AgentUploadDrawer } from '../../features/agent-upload';
import { AuthenticatedLayout } from '../../components/common/AuthenticatedLayout';
import { withUserAuth } from '../../components/common/withAuth';
import { fetchClient } from '../../services/api';
import { useRouter } from 'next/router';
import Head from 'next/head';


const DashboardPage: NextPage = () => {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibilityFilter, setVisibilityFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [agentTypeFilter, setAgentTypeFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // Upload drawer state
  const [isUploadDrawerOpen, setIsUploadDrawerOpen] = useState<boolean>(false);

  // Get unique values for filter options
  const uniqueTags = useMemo(() => {
    const allTags = agents.flatMap(agent => agent.tags || []);
    return [...new Set(allTags)].sort();
  }, [agents]);

  const uniqueAgentTypes = useMemo(() => {
    const allTypes = agents.map(agent => agent.agent_type).filter(Boolean);
    return [...new Set(allTypes)].sort();
  }, [agents]);

  // Filtered agents based on search and filters
  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      // Search query filter (searches in name, description, and tags)
      const matchesSearch = searchQuery === '' || 
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (agent.description && agent.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (agent.tags && agent.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));

      // Visibility filter
      const matchesVisibility = visibilityFilter === 'all' || 
        agent.visibility === visibilityFilter ||
        (visibilityFilter === 'private' && (agent.status === 'private' || agent.visibility === 'private')) ||
        (visibilityFilter === 'public' && (agent.status === 'public' || agent.visibility === 'public'));

      // Tag filter
      const matchesTag = tagFilter === 'all' || 
        (agent.tags && agent.tags.includes(tagFilter));

      // Agent type filter
      const matchesAgentType = agentTypeFilter === 'all' || 
        agent.agent_type === agentTypeFilter;

      return matchesSearch && matchesVisibility && matchesTag && matchesAgentType;
    });
  }, [agents, searchQuery, visibilityFilter, tagFilter, agentTypeFilter]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setVisibilityFilter('all');
    setTagFilter('all');
    setAgentTypeFilter('all');
    // Optionally hide filters panel when clearing all
    if (!searchQuery && visibilityFilter === 'all' && tagFilter === 'all' && agentTypeFilter === 'all') {
      setShowFilters(false);
    }
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery !== '' || visibilityFilter !== 'all' || tagFilter !== 'all' || agentTypeFilter !== 'all';

  useEffect(() => {
    const loadAgents = async () => {
      setLoading(true);
      setError(null);
      try {
        // Actual API call to GET /api/v1/agents (FastAPI backend)
        const fetchedAgents = await fetchClient<Agent[]>('/agents/', { method: 'GET' });
        setAgents(fetchedAgents);
      } catch (err: any) {
        console.error('Failed to fetch agents:', err);
        let errorMessage = err.message || 'Failed to fetch agents.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, []); // Remove router dependency since auth is handled by HOC

  const handleEditAgent = (id: string | number) => {
    console.log('Edit agent:', id);
    // Navigate to edit page
    router.push(`/dashboard/edit/${id}`);
  };

  const handleDeleteAgent = async (id: string | number) => {
    console.log('Attempting to delete agent:', id);
    
    // Find the agent by ID to get its name
    const agent = agents.find(a => a.id === id);
    const agentName = agent ? agent.name : `Agent ${id}`;
    
    if (!window.confirm(`Are you sure you want to delete "${agentName}"? This action cannot be undone.`)) return;

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

  // Handle agent creation callback from drawer
  const handleAgentCreated = () => {
    setIsUploadDrawerOpen(false);
    // Refresh the agents list
    const loadAgents = async () => {
      try {
        const fetchedAgents = await fetchClient<Agent[]>('/agents/', { method: 'GET' });
        setAgents(fetchedAgents);
      } catch (err: any) {
        console.error('Failed to refresh agents:', err);
      }
    };
    loadAgents();
  };

  return (
    <AuthenticatedLayout>
      <Head>
        <title>Developer Dashboard - AI Pills</title>
      </Head>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={0} sx={{ p: {xs:2, sm:3}, mb: 3, backgroundColor: 'transparent' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h4" component="h1" sx={{fontWeight: 'bold'}}>
            Developer Dashboard
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsUploadDrawerOpen(true)}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Upload New Agent
          </Button>
        </Box>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your AI agents, view their status, and access upload tools.
        </Typography>
      </Paper>

      {/* Search and Filter Section */}
      <Paper elevation={1} sx={{ mb: 3, overflow: 'hidden' }}>
        {/* Always visible search bar and filter toggle */}
        <Box sx={{ p: 3, pb: showFilters ? 2 : 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Search Agents
            </Typography>
            <Button
              variant={showFilters ? "contained" : "outlined"}
              size="small"
              startIcon={<FilterListIcon />}
              endIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{ 
                ml: 2,
                transition: 'all 0.3s ease-in-out',
                minWidth: 120,
                '& .MuiButton-endIcon': {
                  transition: 'transform 0.3s ease-in-out',
                  transform: showFilters ? 'rotate(0deg)' : 'rotate(0deg)',
                },
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: showFilters ? 3 : 2,
                },
              }}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            {hasActiveFilters && !showFilters && (
              <Chip
                label={`${[searchQuery, visibilityFilter !== 'all' ? visibilityFilter : null, tagFilter !== 'all' ? tagFilter : null, agentTypeFilter !== 'all' ? agentTypeFilter : null].filter(Boolean).length} active`}
                size="small"
                color="primary"
                sx={{ 
                  ml: 1,
                  animation: 'pulse 0.5s ease-in-out',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                    '100%': { transform: 'scale(1)' },
                  },
                }}
              />
            )}
            {hasActiveFilters && (
              <IconButton
                size="small"
                onClick={clearFilters}
                title="Clear All Filters"
                sx={{ ml: 1 }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          {/* Always visible search bar */}
          <TextField
            fullWidth
            placeholder="Search agents by name, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery('')}
                    sx={{ p: 0.5 }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                transition: 'all 0.3s ease',
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                },
              },
            }}
          />
        </Box>

        {/* Collapsible filter controls */}
        <Collapse 
          in={showFilters} 
          timeout={300}
          sx={{
            '& .MuiCollapse-wrapper': {
              transition: 'height 0.3s ease-in-out',
            },
          }}
        >
          <Box sx={{ px: 3, pb: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              flexWrap: 'wrap',
              alignItems: 'center',
              mb: 2
            }}>
              {/* Visibility Filter */}
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Visibility</InputLabel>
                <Select
                  value={visibilityFilter}
                  label="Visibility"
                  onChange={(e) => setVisibilityFilter(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="private">Private</MenuItem>
                </Select>
              </FormControl>

              {/* Agent Type Filter */}
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Agent Type</InputLabel>
                <Select
                  value={agentTypeFilter}
                  label="Agent Type"
                  onChange={(e) => setAgentTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  {uniqueAgentTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Tag Filter */}
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Tag</InputLabel>
                <Select
                  value={tagFilter}
                  label="Tag"
                  onChange={(e) => setTagFilter(e.target.value)}
                >
                  <MenuItem value="all">All Tags</MenuItem>
                  {uniqueTags.map((tag) => (
                    <MenuItem key={tag} value={tag}>
                      {tag}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Clear filters button */}
              <Button
                variant="outlined"
                size="small"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                sx={{ 
                  ml: 'auto',
                  opacity: hasActiveFilters ? 1 : 0.5,
                  transition: 'opacity 0.3s ease'
                }}
              >
                Clear All
              </Button>
            </Box>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1, 
                alignItems: 'center',
                p: 2,
                backgroundColor: 'action.hover',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1, fontWeight: 500 }}>
                  Active filters:
                </Typography>
                {searchQuery && (
                  <Chip
                    label={`Search: "${searchQuery}"`}
                    size="small"
                    onDelete={() => setSearchQuery('')}
                    color="primary"
                    variant="filled"
                    sx={{ 
                      animation: 'fadeIn 0.3s ease-in',
                      '@keyframes fadeIn': {
                        from: { opacity: 0, transform: 'scale(0.8)' },
                        to: { opacity: 1, transform: 'scale(1)' },
                      },
                    }}
                  />
                )}
                {visibilityFilter !== 'all' && (
                  <Chip
                    label={`Visibility: ${visibilityFilter}`}
                    size="small"
                    onDelete={() => setVisibilityFilter('all')}
                    color="secondary"
                    variant="filled"
                    sx={{ 
                      animation: 'fadeIn 0.3s ease-in',
                      '@keyframes fadeIn': {
                        from: { opacity: 0, transform: 'scale(0.8)' },
                        to: { opacity: 1, transform: 'scale(1)' },
                      },
                    }}
                  />
                )}
                {tagFilter !== 'all' && (
                  <Chip
                    label={`Tag: ${tagFilter}`}
                    size="small"
                    onDelete={() => setTagFilter('all')}
                    color="info"
                    variant="filled"
                    sx={{ 
                      animation: 'fadeIn 0.3s ease-in',
                      '@keyframes fadeIn': {
                        from: { opacity: 0, transform: 'scale(0.8)' },
                        to: { opacity: 1, transform: 'scale(1)' },
                      },
                    }}
                  />
                )}
                {agentTypeFilter !== 'all' && (
                  <Chip
                    label={`Type: ${agentTypeFilter}`}
                    size="small"
                    onDelete={() => setAgentTypeFilter('all')}
                    color="success"
                    variant="filled"
                    sx={{ 
                      animation: 'fadeIn 0.3s ease-in',
                      '@keyframes fadeIn': {
                        from: { opacity: 0, transform: 'scale(0.8)' },
                        to: { opacity: 1, transform: 'scale(1)' },
                      },
                    }}
                  />
                )}
              </Box>
            )}
          </Box>
        </Collapse>
      </Paper>

      {/* Results Summary */}
      {!loading && !error && agents.length > 0 && (
        <Box sx={{ mb: 2, px: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredAgents.length} of {agents.length} agents
            {hasActiveFilters && ' (filtered)'}
          </Typography>
        </Box>
      )}

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

      {!loading && !error && agents.length > 0 && filteredAgents.length === 0 && (
        <Paper elevation={1} sx={{ p:3, textAlign: 'center', mt: 3 }}>
            <Typography variant="h6">No Agents Match Your Search</Typography>
            <Typography variant="body1" color="text.secondary" sx={{mt:1}}>
            Try adjusting your search terms or filters to find agents.
            </Typography>
            {hasActiveFilters && (
              <Button 
                variant="outlined" 
                onClick={clearFilters} 
                sx={{ mt: 2 }}
                startIcon={<ClearIcon />}
              >
                Clear All Filters
              </Button>
            )}
        </Paper>
      )}

      {!loading && !error && filteredAgents.length > 0 && (
        <List sx={{width: '100%'}}>
          {filteredAgents.map((agent) => (
            <AgentListItem
              key={agent.id}
              agent={agent}
              onEdit={handleEditAgent}
              onDelete={handleDeleteAgent}
            />
          ))}
        </List>
      )}
      
      {/* Upload Agent Drawer */}
      <AgentUploadDrawer
        open={isUploadDrawerOpen}
        onClose={() => setIsUploadDrawerOpen(false)}
        onAgentCreated={handleAgentCreated}
      />
    </Container>
    </AuthenticatedLayout>
  );
};

export default withUserAuth(DashboardPage);

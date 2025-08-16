// In ai_pills/frontend/client_nextjs/src/pages/admin/index.tsx
import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { Container, Typography, Box, Tabs, Tab, CircularProgress, Alert, Paper, Button } from '@mui/material'; 
import AdminUserList, { AdminUser } from '../../components/admin/AdminUserList';
import AdminAgentList, { AdminAgent } from '../../components/admin/AdminAgentList';
import { AuthenticatedLayout } from '../../components/common/AuthenticatedLayout';
import { withAdminAuth } from '../../components/common/withAuth';
import PeopleIcon from '@mui/icons-material/People';
import ExtensionIcon from '@mui/icons-material/Extension';
import { fetchClient } from '../../services/api';
import { useRouter } from 'next/router';
import Head from 'next/head';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`admin-tabpanel-${index}`} aria-labelledby={`admin-tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 3, pb: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

const AdminPage: NextPage = () => {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [agents, setAgents] = useState<AdminAgent[]>([]);
  const [loading, setLoading] = useState({ users: true, agents: true });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true; // To prevent state updates on unmounted component

    const fetchAdminData = async () => {
      setError(null); // Clear previous errors at the start of new fetch operations
      // Fetch Users
      setLoading(prev => ({ ...prev, users: true }));
      try {
        const fetchedUsers = await fetchClient<AdminUser[]>('/admin/users', { method: 'GET' });
        if (active) setUsers(fetchedUsers);
      } catch (err: any) {
        console.error('Failed to fetch admin users:', err);
        if (active) setError(prev => prev ? `${prev}\nUsers: ${err.message}` : `Users: ${err.message}`);
      } finally {
        if (active) setLoading(prev => ({ ...prev, users: false }));
      }

      // Fetch Agents
      setLoading(prev => ({ ...prev, agents: true }));
      try {
        const fetchedAgents = await fetchClient<AdminAgent[]>('/admin/agents', { method: 'GET' });
        if (active) setAgents(fetchedAgents);
      } catch (err: any) {
        console.error('Failed to fetch admin agents:', err);
        if (active) setError(prev => prev ? `${prev}\nAgents: ${err.message}` : `Agents: ${err.message}`);
      } finally {
        if (active) setLoading(prev => ({ ...prev, agents: false }));
      }
    };

    fetchAdminData();
    return () => { active = false; }; // Cleanup function
  }, []); // Remove router dependency since auth is handled by HOC

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // setError(null); // Optionally clear errors when changing tabs if they are specific to tab content
  };

  const handleUpdateUserStatus = async (userId: string, newStatus: AdminUser['status']) => {
    setError(null);
    console.log(`Admin: Attempting to update user ${userId} to status ${newStatus}`);
    try {
      // Note: FastAPI UserPublic model doesn't have 'status'. This call is conceptual on backend.
      // The response might not reflect the 'status' field unless UserPublic is updated.
      const updatedUser = await fetchClient<AdminUser>(`/admin/users/${userId}/status`, {
        method: 'PUT',
        body: { status: newStatus },
      });
      // Optimistically update with newStatus, as backend UserPublic might not have status.
      // Or, if backend UserPublic is updated to include status, use updatedUser.status
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus /* or updatedUser.status */ } : u));
      alert(`User ${userId} status conceptually updated to ${newStatus}. Backend model may need 'status' field.`);
    } catch (err: any) {
      console.error('Failed to update user status:', err);
      setError(`User status update failed: ${err.message}`);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setError(null);
    if (!window.confirm(`Are you sure you want to delete user ${userId}? This action cannot be undone.`)) return;
    console.log(`Admin: Attempting to delete user ${userId}`);
    try {
      await fetchClient<void>(`/admin/users/${userId}`, { method: 'DELETE' });
      setUsers(prev => prev.filter(u => u.id !== userId));
      alert('User deleted successfully.');
    } catch (err: any) {
      console.error('Failed to delete user:', err);
      setError(`User deletion failed: ${err.message}`);
    }
  };

  const handleUpdateAgentStatus = async (agentId: string, newStatus: AdminAgent['status']) => {
    setError(null);
    console.log(`Admin: Attempting to update agent ${agentId} to status ${newStatus}`);
    try {
      const updatedAgent = await fetchClient<AdminAgent>(`/admin/agents/${agentId}/status`, {
        method: 'PUT',
        body: { status: newStatus },
      });
      setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status: updatedAgent.status } : a));
    } catch (err: any) {
      console.error('Failed to update agent status:', err);
      setError(`Agent status update failed: ${err.message}`);
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    setError(null);
    if (!window.confirm(`Are you sure you want to delete agent ${agentId}? This action cannot be undone.`)) return;
    console.log(`Admin: Attempting to delete agent ${agentId}`);
    try {
      await fetchClient<void>(`/admin/agents/${agentId}`, { method: 'DELETE' });
      setAgents(prev => prev.filter(a => a.id !== agentId));
      alert('Agent deleted successfully.');
    } catch (err: any) {
      console.error('Failed to delete agent:', err);
      setError(`Agent deletion failed: ${err.message}`);
    }
  };

  return (
    <AuthenticatedLayout>
      <Head>
        <title>Admin Panel - AI Pills</title>
      </Head>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={0} sx={{ p: {xs:2, sm:3}, mb: 3, backgroundColor: 'transparent' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{fontWeight: 'bold'}}>
            Admin Panel
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
            Manage users and AI agents on the platform. Use these tools with caution.
        </Typography>
      </Paper>
      {error && <Alert severity="error" sx={{ mb: 2, whiteSpace: 'pre-line' }} onClose={() => setError(null)}>{error}</Alert>}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin panel tabs" variant="scrollable" scrollButtons="auto">
            <Tab icon={<PeopleIcon />} iconPosition="start" label="Manage Users" {...a11yProps(0)} />
            <Tab icon={<ExtensionIcon />} iconPosition="start" label="Manage AI Agents" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          {loading.users ? <Box sx={{display:'flex', justifyContent:'center', p:3}}><CircularProgress /></Box>
                         : (!error || !error.includes("Users:")) && // Only show user list if no user-specific error part
                            <AdminUserList users={users} onUpdateStatus={handleUpdateUserStatus} onDeleteUser={handleDeleteUser} />
          }
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {loading.agents ? <Box sx={{display:'flex', justifyContent:'center', p:3}}><CircularProgress /></Box>
                          : (!error || !error.includes("Agents:")) && // Only show agent list if no agent-specific error part
                            <AdminAgentList agents={agents} onUpdateStatus={handleUpdateAgentStatus} onDeleteAgent={handleDeleteAgent} />
          }
        </TabPanel>
      </Box>
    </Container>
    </AuthenticatedLayout>
  );
};

export default withAdminAuth(AdminPage);

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

// Import Auth Components
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import ResetPasswordPage from './components/auth/ResetPasswordPage';

// Import Dashboard Component
import DashboardPage from './components/dashboard/DashboardPage';

// Import Public Agent Page Components
import HomePage from './components/HomePage'; // Renamed Home to HomePage
import AgentDetailPage from './components/AgentDetailPage';

// Import Admin Component
import AdminPage from './components/admin/AdminPage';

function App() {
  return (
    <Router>
      <div className="App">
        {/* <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/admin">Admin</Link>
            </li>{' '}
            <li><Link to="/forgot-password">Forgot Password</Link></li> 
          </ul>
        </nav> */}  
        {/* Note: In a real app, /dashboard and /admin should be protected routes */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/agents/:agentId" element={<AgentDetailPage />} />{' '}
          {/* New Agent Detail Route */}
          <Route path="/admin" element={<AdminPage />} />{' '}
          {/* Added Admin Route */}
          <Route path="/" element={<HomePage />} />{' '}
          {/* Root path now uses HomePage */}
        </Routes>
      </div>
    </Router>
  );
}

// Simple Home component (now replaced by HomePage) is removed.

export default App;

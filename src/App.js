import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Callback from './components/Callback';
import Dashboard from './components/Dashboard';

const App = () => {
  const isAuthenticated = () => {
    return !!localStorage.getItem('spotify_token');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route 
          path="/dashboard" 
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
};

export default App; 
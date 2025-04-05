import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const Callback = () => {
  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Extraire le token
      const token = hash
        .substring(1)
        .split("&")
        .find(elem => elem.startsWith("access_token"))
        ?.split("=")[1];

      if (token) {
        // Sauvegarder le token
        localStorage.setItem("spotify_token", token);
        // Rediriger vers le dashboard
        window.location.href = '/dashboard';
      } else {
        // Si pas de token, retour à la page de login
        window.location.href = '/';
      }
    }
  }, []);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#121212',
      color: 'white'
    }}>
      <div>Connexion en cours...</div>
    </div>
  );
};

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
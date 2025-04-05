import React from 'react';
import { useNavigate } from 'react-router-dom';

// Configuration Spotify
const CLIENT_ID = 'cc7bb357846a4f41bf3f7ed5e710ac43';
// IMPORTANT: Cette URL doit être exactement la même dans le Spotify Dashboard
const REDIRECT_URI = 'https://funny-elf-e06f65.netlify.app/callback';
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read'
];

// Construction de l'URL d'authentification avec state pour la sécurité
const generateRandomString = length => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

const state = generateRandomString(16);

// Construction de l'URL d'authentification
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=${SCOPES.join('%20')}&state=${state}&show_dialog=true`;

const Login = () => {
  const handleLogin = () => {
    // Nettoyer le localStorage avant la nouvelle connexion
    localStorage.clear(); // Nettoyage complet du localStorage
    sessionStorage.clear(); // Nettoyage du sessionStorage aussi
    
    // Sauvegarder l'état pour la vérification
    localStorage.setItem('spotify_auth_state', state);
    
    // Rediriger vers Spotify
    window.location.href = AUTH_URL;
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <img 
          src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png" 
          alt="Spotify Logo" 
          style={styles.logo} 
        />
        <h1 style={styles.title}>Bienvenue sur Spotify Stats</h1>
        <p style={styles.description}>
          Découvrez vos artistes et morceaux préférés basés sur votre historique d'écoute
        </p>
        <button 
          onClick={handleLogin}
          style={styles.button}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1ed760'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#1DB954'}
        >
          Se connecter avec Spotify
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    backgroundColor: '#121212',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'
  },
  content: {
    textAlign: 'center',
    padding: '20px',
    maxWidth: '600px'
  },
  logo: {
    width: '200px',
    marginBottom: '30px'
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '20px',
    fontWeight: '700'
  },
  description: {
    fontSize: '1.2rem',
    marginBottom: '40px',
    color: '#b3b3b3'
  },
  button: {
    backgroundColor: '#1DB954',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '500px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  }
};

export default Login; 
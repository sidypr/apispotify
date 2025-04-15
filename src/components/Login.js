import React from 'react';
import { useNavigate } from 'react-router-dom';

// Configuration Spotify
const CLIENT_ID = '93325500c897490aac9b1e6222db7e3a';
const REDIRECT_URI = 'https://tourmaline-licorice-6a583d.netlify.app/callback';

// URL d'authentification
const AUTH_URL = 'https://accounts.spotify.com/authorize' +
  '?client_id=' + CLIENT_ID +
  '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
  '&response_type=token' +
  '&scope=' + encodeURIComponent('user-read-private user-read-email user-top-read user-read-playback-state user-modify-playback-state user-read-currently-playing');

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Nettoyer le localStorage
    localStorage.clear();
    // Rediriger vers Spotify
    window.location.href = AUTH_URL;
  };

  const handleDemoLogin = () => {
    // Mode démo
    localStorage.setItem('demo_mode', 'true');
    navigate('/dashboard');
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
        <div style={styles.buttonContainer}>
          <button 
            onClick={handleLogin}
            style={styles.button}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1ed760'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#1DB954'}
          >
            Se connecter avec Spotify
          </button>
          <button 
            onClick={handleDemoLogin}
            style={styles.demoButton}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#535353'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#282828'}
          >
            Voir la Démo
          </button>
        </div>
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
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
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
  },
  demoButton: {
    backgroundColor: '#282828',
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
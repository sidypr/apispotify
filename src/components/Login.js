import React from 'react';

// Mise à jour de l'URL de redirection pour le déploiement Netlify
const redirectUri = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/callback'
  : 'https://funny-elf-e06f65.netlify.app/callback';

// Construction de l'URL d'authentification avec la bonne redirection
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=cc7bb357846a4f41bf3f7ed5e710ac43&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=user-read-private%20user-read-email%20user-top-read`;

const Login = () => {
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
          onClick={() => window.location.href = AUTH_URL}
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
import React from 'react';

const Login = () => {
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-read-recently-played',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-library-read'
  ];

  const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_REDIRECT_URI;
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&show_dialog=true`;

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <h1 style={styles.title}>Spotify Stats</h1>
        <p style={styles.description}>
          Découvrez des statistiques détaillées sur votre activité Spotify
        </p>
        <a href={spotifyAuthUrl} style={styles.loginButton}>
          Se connecter avec Spotify
        </a>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loginCard: {
    backgroundColor: '#282828',
    padding: '40px',
    borderRadius: '10px',
    textAlign: 'center',
    maxWidth: '400px',
    width: '90%',
  },
  title: {
    color: '#1DB954',
    fontSize: '2.5rem',
    marginBottom: '20px',
  },
  description: {
    color: '#b3b3b3',
    fontSize: '1.1rem',
    marginBottom: '30px',
  },
  loginButton: {
    backgroundColor: '#1DB954',
    color: 'white',
    padding: '15px 30px',
    borderRadius: '25px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    display: 'inline-block',
    transition: 'transform 0.2s',
  },
};

export default Login; 
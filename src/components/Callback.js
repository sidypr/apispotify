import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// NOTE IMPORTANTE: Pour le déploiement sur Netlify, l'URL de redirection dans le Spotify Developer Dashboard
// doit être configurée pour correspondre à: https://tourmaline-licorice-6a583d.netlify.app/callback
// et l'URL d'authentification dans votre application doit utiliser cette même URL de redirection
//
// L'URL d'authentification correcte pour Netlify serait:
// https://accounts.spotify.com/authorize?client_id=93325500c897490aac9b1e6222db7e3a&redirect_uri=https://tourmaline-licorice-6a583d.netlify.app/callback&response_type=token&scope=user-read-private%20user-read-email%20user-top-read
//
// Cette URL doit être mise à jour dans le fichier où vous générez le lien d'authentification (probablement Login.js ou similaire)
const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = hash
        .substring(1)
        .split('&')
        .find(elem => elem.startsWith('access_token'))
        ?.split('=')[1];

      if (token) {
        localStorage.setItem('spotify_token', token);
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.loader}></div>
      <p style={styles.text}>Connexion en cours...</p>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    color: 'white',
  },
  loader: {
    border: '4px solid #1DB954',
    borderTop: '4px solid transparent',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  text: {
    color: '#b3b3b3',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  }
};

export default Callback; 
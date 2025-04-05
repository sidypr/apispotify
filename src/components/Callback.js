import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// NOTE IMPORTANTE: Pour le déploiement sur Netlify, l'URL de redirection dans le Spotify Developer Dashboard
// doit être configurée pour correspondre à: https://funny-elf-e06f65.netlify.app/callback
// et l'URL d'authentification dans votre application doit utiliser cette même URL de redirection
//
// L'URL d'authentification correcte pour Netlify serait:
// https://accounts.spotify.com/authorize?client_id=cc7bb357846a4f41bf3f7ed5e710ac43&redirect_uri=https://funny-elf-e06f65.netlify.app/callback&response_type=token&scope=user-read-private%20user-read-email%20user-top-read
//
// Cette URL doit être mise à jour dans le fichier où vous générez le lien d'authentification (probablement Login.js ou similaire)
const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const hash = window.location.hash;
      console.log("Processing hash:", hash);

      if (!hash) {
        console.log("No hash found, redirecting to home");
        window.location.href = '/';
        return;
      }

      try {
        const token = hash
          .substring(1)
          .split("&")
          .find(elem => elem.startsWith("access_token"))
          ?.split("=")[1];

        console.log("Token found:", !!token);

        if (token) {
          // Stockage du token
          window.localStorage.setItem("spotify_token", token);
          
          // Redirection forcée vers le dashboard
          window.location.href = '/dashboard';
        } else {
          console.error("No token in URL");
          window.location.href = '/';
        }
      } catch (error) {
        console.error("Error during callback:", error);
        window.location.href = '/';
      }
    };

    handleCallback();
  }, []);

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
    fontSize: '18px',
    color: '#ffffff',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  }
};

export default Callback; 
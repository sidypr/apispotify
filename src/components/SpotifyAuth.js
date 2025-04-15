import React from 'react';

const SpotifyAuth = () => {
  const CLIENT_ID = "93325500c897490aac9b1e6222db7e3a"; // Votre vrai ID client Spotify
  const REDIRECT_URI = "https://tourmaline-licorice-6a583d.netlify.app/callback"; // URL de production
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPE = "user-read-private user-read-email user-top-read";

  const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

  return (
    <div>
      <h1>Connexion à Spotify</h1>
      <a href={loginUrl} style={{ 
        display: 'inline-block',
        padding: '10px 20px',
        backgroundColor: '#1DB954',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '5px',
        fontWeight: 'bold'
      }}>
        Se connecter avec Spotify
      </a>
      <p style={{ marginTop: '20px' }}>
        URL de connexion: <a href={loginUrl} target="_blank" rel="noreferrer">{loginUrl}</a>
      </p>
    </div>
  );
};

export default SpotifyAuth; 
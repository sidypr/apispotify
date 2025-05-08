import React, { useState, useEffect } from 'react';

const Player = () => {
  const [player, setPlayer] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [volume, setVolume] = useState(50);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSpotifyPlayer = () => {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        const token = localStorage.getItem('spotify_token');
        if (!token) {
          setError("Token non trouvé. Veuillez vous reconnecter.");
          return;
        }

        const spotifyPlayer = new window.Spotify.Player({
          name: 'Spotify Stats Web Player',
          getOAuthToken: cb => { cb(token); },
          volume: 0.5
        });

        spotifyPlayer.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setDeviceId(device_id);
          transferPlayback(device_id);
        });

        spotifyPlayer.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
          setError("Le lecteur n'est pas prêt. Veuillez réessayer.");
        });

        spotifyPlayer.addListener('player_state_changed', state => {
          if (!state) return;
          setCurrentTrack(state.track_window.current_track);
          setIsPlaying(!state.paused);
        });

        spotifyPlayer.connect().then(success => {
          if (success) {
            setPlayer(spotifyPlayer);
          }
        });
      };
    };

    loadSpotifyPlayer();

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, []);

  const transferPlayback = async (deviceId) => {
    const token = localStorage.getItem('spotify_token');
    try {
      await fetch('https://api.spotify.com/v1/me/player', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_ids: [deviceId],
          play: false,
        }),
      });
    } catch (error) {
      console.error('Erreur lors du transfert de lecture:', error);
      setError("Impossible de transférer la lecture. Vérifiez que Spotify est ouvert sur un autre appareil.");
    }
  };

  const handlePlayPause = async () => {
    if (!player) return;
    try {
      await player.togglePlay();
    } catch (error) {
      setError("Erreur lors de la lecture/pause. Veuillez réessayer.");
    }
  };

  const handlePrevious = async () => {
    if (!player) return;
    try {
      await player.previousTrack();
    } catch (error) {
      setError("Impossible de revenir à la piste précédente.");
    }
  };

  const handleNext = async () => {
    if (!player) return;
    try {
      await player.nextTrack();
    } catch (error) {
      setError("Impossible de passer à la piste suivante.");
    }
  };

  const handleVolumeChange = async (newVolume) => {
    if (!player) return;
    try {
      await player.setVolume(newVolume / 100);
      setVolume(newVolume);
    } catch (error) {
      setError("Impossible de modifier le volume.");
    }
  };

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <h2 style={styles.errorTitle}>Erreur du lecteur</h2>
          <p style={styles.errorMessage}>{error}</p>
          <p style={styles.errorHint}>
            Assurez-vous que :
            <ul style={styles.errorList}>
              <li>Vous êtes connecté à Spotify</li>
              <li>Vous avez un abonnement Spotify Premium</li>
              <li>Spotify est ouvert sur un autre appareil</li>
            </ul>
          </p>
        </div>
      </div>
    );
  }

  if (!currentTrack) {
    return (
      <div style={styles.container}>
        <div style={styles.messageCard}>
          <h2 style={styles.messageTitle}>Aucune lecture en cours</h2>
          <p style={styles.message}>
            Lancez la lecture sur un autre appareil Spotify, puis revenez ici pour contrôler la lecture.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.playerCard}>
        <div style={styles.nowPlaying}>
          <img 
            src={currentTrack.album.images[0].url} 
            alt={currentTrack.name}
            style={styles.albumCover}
          />
          <div style={styles.trackInfo}>
            <h2 style={styles.trackName}>{currentTrack.name}</h2>
            <p style={styles.artistName}>{currentTrack.artists[0].name}</p>
            <p style={styles.albumName}>{currentTrack.album.name}</p>
          </div>
        </div>

        <div style={styles.controls}>
          <button onClick={handlePrevious} style={styles.controlButton}>
            ⏮️
          </button>
          <button onClick={handlePlayPause} style={styles.playButton}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button onClick={handleNext} style={styles.controlButton}>
            ⏭️
          </button>
        </div>

        <div style={styles.volumeControl}>
          <span style={styles.volumeLabel}>🔈</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            style={styles.volumeSlider}
          />
          <span style={styles.volumeValue}>{volume}%</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    color: 'white',
  },
  playerCard: {
    backgroundColor: '#282828',
    padding: '20px',
    borderRadius: '10px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  nowPlaying: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
  },
  albumCover: {
    width: '150px',
    height: '150px',
    borderRadius: '5px',
    marginRight: '20px',
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    fontSize: '1.5rem',
    marginBottom: '10px',
  },
  artistName: {
    color: '#1DB954',
    fontSize: '1.1rem',
    marginBottom: '5px',
  },
  albumName: {
    color: '#b3b3b3',
    fontSize: '1rem',
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '30px',
  },
  controlButton: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid #1DB954',
    padding: '10px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '1.5rem',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#1DB954',
    },
  },
  playButton: {
    backgroundColor: '#1DB954',
    color: 'white',
    border: 'none',
    padding: '10px 30px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '1.5rem',
    transition: 'all 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  volumeControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    justifyContent: 'center',
  },
  volumeLabel: {
    fontSize: '1.2rem',
  },
  volumeSlider: {
    width: '200px',
    height: '4px',
    borderRadius: '2px',
    backgroundColor: '#535353',
    appearance: 'none',
    '&::-webkit-slider-thumb': {
      appearance: 'none',
      width: '12px',
      height: '12px',
      backgroundColor: '#1DB954',
      borderRadius: '50%',
      cursor: 'pointer',
    },
  },
  volumeValue: {
    fontSize: '0.9rem',
    color: '#b3b3b3',
    minWidth: '45px',
  },
  errorCard: {
    backgroundColor: '#282828',
    padding: '30px',
    borderRadius: '10px',
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center',
  },
  errorTitle: {
    color: '#ff4444',
    fontSize: '1.5rem',
    marginBottom: '20px',
  },
  errorMessage: {
    color: '#b3b3b3',
    fontSize: '1.1rem',
    marginBottom: '20px',
  },
  errorHint: {
    color: '#b3b3b3',
    fontSize: '1rem',
  },
  errorList: {
    listStyle: 'none',
    padding: '0',
    marginTop: '10px',
  },
  messageCard: {
    backgroundColor: '#282828',
    padding: '30px',
    borderRadius: '10px',
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center',
  },
  messageTitle: {
    color: '#1DB954',
    fontSize: '1.5rem',
    marginBottom: '20px',
  },
  message: {
    color: '#b3b3b3',
    fontSize: '1.1rem',
  },
};

export default Player; 
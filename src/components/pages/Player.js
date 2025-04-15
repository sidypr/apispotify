import React, { useState, useEffect } from 'react';

const Player = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('off');
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    const fetchPlaybackState = async () => {
      const token = localStorage.getItem('spotify_token');
      try {
        const response = await fetch('https://api.spotify.com/v1/me/player', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          const data = await response.json();
          setCurrentTrack(data.item);
          setIsPlaying(data.is_playing);
          setVolume(data.device.volume_percent);
          setShuffle(data.shuffle_state);
          setRepeat(data.repeat_state);
          setDeviceId(data.device.id);
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchPlaybackState();
    const interval = setInterval(fetchPlaybackState, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePlayPause = async () => {
    const token = localStorage.getItem('spotify_token');
    const endpoint = isPlaying ? 'pause' : 'play';
    try {
      await fetch(`https://api.spotify.com/v1/me/player/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSkip = async (direction) => {
    const token = localStorage.getItem('spotify_token');
    try {
      await fetch(`https://api.spotify.com/v1/me/player/${direction}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleVolumeChange = async (newVolume) => {
    const token = localStorage.getItem('spotify_token');
    try {
      await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${newVolume}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setVolume(newVolume);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleShuffleToggle = async () => {
    const token = localStorage.getItem('spotify_token');
    try {
      await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${!shuffle}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setShuffle(!shuffle);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleRepeatToggle = async () => {
    const token = localStorage.getItem('spotify_token');
    const nextState = repeat === 'off' ? 'track' : repeat === 'track' ? 'context' : 'off';
    try {
      await fetch(`https://api.spotify.com/v1/me/player/repeat?state=${nextState}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setRepeat(nextState);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (!currentTrack) {
    return (
      <div style={styles.container}>
        <p style={styles.message}>
          Aucune lecture en cours. Veuillez lancer Spotify sur l'un de vos appareils.
        </p>
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
            <p style={styles.artistName}>
              {currentTrack.artists.map(artist => artist.name).join(', ')}
            </p>
            <p style={styles.albumName}>{currentTrack.album.name}</p>
          </div>
        </div>

        <div style={styles.controls}>
          <button 
            onClick={handleShuffleToggle}
            style={{
              ...styles.controlButton,
              backgroundColor: shuffle ? '#1DB954' : '#282828'
            }}
          >
            Aléatoire
          </button>

          <button 
            onClick={() => handleSkip('previous')}
            style={styles.controlButton}
          >
            Précédent
          </button>

          <button 
            onClick={handlePlayPause}
            style={{...styles.controlButton, width: '80px'}}
          >
            {isPlaying ? 'Pause' : 'Lecture'}
          </button>

          <button 
            onClick={() => handleSkip('next')}
            style={styles.controlButton}
          >
            Suivant
          </button>

          <button 
            onClick={handleRepeatToggle}
            style={{
              ...styles.controlButton,
              backgroundColor: repeat !== 'off' ? '#1DB954' : '#282828'
            }}
          >
            {repeat === 'track' ? 'Répéter 1' : repeat === 'context' ? 'Répéter tout' : 'Répéter'}
          </button>
        </div>

        <div style={styles.volumeControl}>
          <span style={styles.volumeLabel}>Volume</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
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
  message: {
    textAlign: 'center',
    color: '#b3b3b3',
    fontSize: '1.1rem',
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
    backgroundColor: '#282828',
    color: 'white',
    border: '1px solid #1DB954',
    padding: '10px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#1DB954',
    },
  },
  volumeControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  volumeLabel: {
    fontSize: '0.9rem',
    color: '#b3b3b3',
  },
  volumeSlider: {
    flex: 1,
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
};

export default Player; 
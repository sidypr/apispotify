import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('track');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef(new Audio());

  const handleSearch = async () => {
    if (!searchTerm) return;
    setLoading(true);

    const token = localStorage.getItem('spotify_token');
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=${searchType}&limit=20`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const data = await response.json();
      setSearchResults(data[`${searchType}s`].items);
    } catch (error) {
      console.error('Erreur de recherche:', error);
    }
    setLoading(false);
  };

  const handlePlayPreview = (url) => {
    if (previewUrl === url && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.src = url;
      audioRef.current.play();
      setPreviewUrl(url);
      setIsPlaying(true);
    }
  };

  const renderResults = () => {
    if (searchType === 'track') {
      return (
        <div style={styles.grid}>
          {searchResults.map(track => (
            <div key={track.id} style={styles.card}>
              <img 
                src={track.album.images[0]?.url} 
                alt={track.name}
                style={styles.image}
              />
              <h3 style={styles.title}>{track.name}</h3>
              <p style={styles.subtitle}>{track.artists[0].name}</p>
              <p style={styles.subtitle}>{track.album.name}</p>
              {track.preview_url && (
                <button 
                  onClick={() => handlePlayPreview(track.preview_url)}
                  style={styles.playButton}
                >
                  {previewUrl === track.preview_url && isPlaying ? 'Pause' : 'Écouter'}
                </button>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (searchType === 'artist') {
      return (
        <div style={styles.grid}>
          {searchResults.map(artist => (
            <div key={artist.id} style={styles.card}>
              <img 
                src={artist.images[0]?.url} 
                alt={artist.name}
                style={{...styles.image, borderRadius: '50%'}}
              />
              <h3 style={styles.title}>{artist.name}</h3>
              <p style={styles.subtitle}>
                {artist.genres?.slice(0, 3).join(', ')}
              </p>
              <p style={styles.followers}>
                {artist.followers?.total.toLocaleString()} followers
              </p>
            </div>
          ))}
        </div>
      );
    }

    if (searchType === 'album') {
      return (
        <div style={styles.grid}>
          {searchResults.map(album => (
            <div key={album.id} style={styles.card}>
              <img 
                src={album.images[0]?.url} 
                alt={album.name}
                style={styles.image}
              />
              <h3 style={styles.title}>{album.name}</h3>
              <p style={styles.subtitle}>{album.artists[0].name}</p>
              <p style={styles.subtitle}>
                {new Date(album.release_date).getFullYear()}
              </p>
            </div>
          ))}
        </div>
      );
    }

    if (searchType === 'playlist') {
      return (
        <div style={styles.grid}>
          {searchResults.map(playlist => (
            <div key={playlist.id} style={styles.card}>
              <img 
                src={playlist.images[0]?.url} 
                alt={playlist.name}
                style={styles.image}
              />
              <h3 style={styles.title}>{playlist.name}</h3>
              <p style={styles.subtitle}>Par {playlist.owner.display_name}</p>
              <p style={styles.subtitle}>
                {playlist.tracks.total} titres
              </p>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>Recherche</h1>
      
      <div style={styles.searchContainer}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Rechercher..."
          style={styles.searchInput}
        />
        
        <div style={styles.typeSelector}>
          <button 
            onClick={() => setSearchType('track')}
            style={searchType === 'track' ? styles.activeTypeButton : styles.typeButton}
          >
            Titres
          </button>
          <button 
            onClick={() => setSearchType('artist')}
            style={searchType === 'artist' ? styles.activeTypeButton : styles.typeButton}
          >
            Artistes
          </button>
          <button 
            onClick={() => setSearchType('album')}
            style={searchType === 'album' ? styles.activeTypeButton : styles.typeButton}
          >
            Albums
          </button>
          <button 
            onClick={() => setSearchType('playlist')}
            style={searchType === 'playlist' ? styles.activeTypeButton : styles.typeButton}
          >
            Playlists
          </button>
        </div>

        <button onClick={handleSearch} style={styles.searchButton}>
          Rechercher
        </button>
      </div>

      {loading ? (
        <div style={styles.loader}></div>
      ) : (
        <div style={styles.results}>
          {searchResults.length > 0 && renderResults()}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    color: 'white',
  },
  pageTitle: {
    fontSize: '2rem',
    marginBottom: '30px',
    color: '#1DB954',
  },
  searchContainer: {
    marginBottom: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  searchInput: {
    padding: '12px 20px',
    fontSize: '1.1rem',
    backgroundColor: '#282828',
    border: 'none',
    borderRadius: '20px',
    color: 'white',
    width: '100%',
    maxWidth: '600px',
  },
  typeSelector: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  typeButton: {
    padding: '8px 16px',
    backgroundColor: '#282828',
    border: 'none',
    borderRadius: '20px',
    color: 'white',
    cursor: 'pointer',
  },
  activeTypeButton: {
    padding: '8px 16px',
    backgroundColor: '#1DB954',
    border: 'none',
    borderRadius: '20px',
    color: 'white',
    cursor: 'pointer',
  },
  searchButton: {
    padding: '12px 24px',
    backgroundColor: '#1DB954',
    border: 'none',
    borderRadius: '20px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
    width: 'fit-content',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
    padding: '20px 0',
  },
  card: {
    backgroundColor: '#282828',
    padding: '15px',
    borderRadius: '10px',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
  image: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: '5px',
    marginBottom: '15px',
  },
  title: {
    fontSize: '1.1rem',
    margin: '0 0 5px 0',
    color: 'white',
  },
  subtitle: {
    color: '#b3b3b3',
    fontSize: '0.9rem',
    margin: '5px 0',
  },
  followers: {
    color: '#1DB954',
    fontSize: '0.9rem',
    margin: '5px 0',
  },
  playButton: {
    backgroundColor: '#1DB954',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    marginTop: '10px',
    width: '100%',
  },
  loader: {
    border: '4px solid #1DB954',
    borderTop: '4px solid transparent',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    margin: '40px auto',
  },
};

export default Search; 
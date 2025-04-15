import React from 'react';
import { useOutletContext } from 'react-router-dom';

const Stats = () => {
  const { topArtists, topTracks, displayMode, setDisplayMode, timeRange, setTimeRange } = useOutletContext();

  const renderArtists = () => {
    if (displayMode === 'grid') {
      return (
        <div style={styles.grid}>
          {topArtists.map(artist => (
            <div key={artist.id} style={styles.card}>
              {artist.images?.[0]?.url && (
                <img src={artist.images[0].url} alt={artist.name} style={styles.artistImage} />
              )}
              <h3 style={styles.itemTitle}>{artist.name}</h3>
              {artist.genres && (
                <p style={styles.genres}>
                  {artist.genres.slice(0, 3).join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div style={styles.list}>
        {topArtists.map((artist, index) => (
          <div key={artist.id} style={styles.listItem}>
            <span style={styles.rank}>{index + 1}</span>
            {artist.images?.[0]?.url && (
              <img src={artist.images[0].url} alt={artist.name} style={styles.listImage} />
            )}
            <div style={styles.itemInfo}>
              <h3 style={styles.itemTitle}>{artist.name}</h3>
              {artist.genres && (
                <p style={styles.genres}>
                  {artist.genres.slice(0, 3).join(', ')}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTracks = () => {
    if (displayMode === 'grid') {
      return (
        <div style={styles.grid}>
          {topTracks.map(track => (
            <div key={track.id} style={styles.card}>
              <img src={track.album.images[0].url} alt={track.name} style={styles.trackImage} />
              <h3 style={styles.itemTitle}>{track.name}</h3>
              <p style={styles.artist}>{track.artists[0].name}</p>
              <p style={styles.album}>{track.album.name}</p>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div style={styles.list}>
        {topTracks.map((track, index) => (
          <div key={track.id} style={styles.listItem}>
            <span style={styles.rank}>{index + 1}</span>
            <img src={track.album.images[0].url} alt={track.name} style={styles.listImage} />
            <div style={styles.itemInfo}>
              <h3 style={styles.itemTitle}>{track.name}</h3>
              <p style={styles.artist}>{track.artists[0].name}</p>
              <p style={styles.album}>{track.album.name}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.controls}>
          <div style={styles.displayModeSelector}>
            <button 
              onClick={() => setDisplayMode('grid')}
              style={displayMode === 'grid' ? styles.activeDisplayButton : styles.displayButton}
            >
              Grille
            </button>
            <button 
              onClick={() => setDisplayMode('list')}
              style={displayMode === 'list' ? styles.activeDisplayButton : styles.displayButton}
            >
              Liste
            </button>
          </div>

          <div style={styles.timeRangeSelector}>
            <button 
              onClick={() => setTimeRange('short_term')}
              style={timeRange === 'short_term' ? styles.activeTimeButton : styles.timeButton}
            >
              4 semaines
            </button>
            <button 
              onClick={() => setTimeRange('medium_term')}
              style={timeRange === 'medium_term' ? styles.activeTimeButton : styles.timeButton}
            >
              6 mois
            </button>
            <button 
              onClick={() => setTimeRange('long_term')}
              style={timeRange === 'long_term' ? styles.activeTimeButton : styles.timeButton}
            >
              Tout le temps
            </button>
          </div>
        </div>
      </div>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Vos Top Artistes</h2>
        {renderArtists()}
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Vos Top Titres</h2>
        {renderTracks()}
      </section>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    color: '#1DB954',
    marginBottom: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
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
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#282828',
    padding: '10px',
    borderRadius: '10px',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.01)',
    },
  },
  rank: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginRight: '20px',
    color: '#1DB954',
    minWidth: '30px',
  },
  artistImage: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: '50%',
    marginBottom: '15px',
  },
  trackImage: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: '5px',
    marginBottom: '15px',
  },
  listImage: {
    width: '60px',
    height: '60px',
    borderRadius: '5px',
    marginRight: '15px',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: '1.1rem',
    margin: '0 0 5px 0',
    color: 'white',
  },
  genres: {
    color: '#b3b3b3',
    fontSize: '0.9rem',
    margin: '5px 0',
  },
  artist: {
    color: '#1DB954',
    fontSize: '0.9rem',
    margin: '5px 0',
  },
  album: {
    color: '#b3b3b3',
    fontSize: '0.9rem',
    margin: '5px 0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '30px',
  },
  displayModeSelector: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  },
  timeRangeSelector: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  },
  displayButton: {
    backgroundColor: '#282828',
    color: 'white',
    border: '1px solid #1DB954',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
  activeDisplayButton: {
    backgroundColor: '#1DB954',
    color: 'white',
    border: '1px solid #1DB954',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
  timeButton: {
    backgroundColor: '#282828',
    color: 'white',
    border: '1px solid #1DB954',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
  activeTimeButton: {
    backgroundColor: '#1DB954',
    color: 'white',
    border: '1px solid #1DB954',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
};

export default Stats; 
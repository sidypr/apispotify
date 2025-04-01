import React from 'react';
import { useOutletContext } from 'react-router-dom';

const Stats = () => {
  const { topArtists, topTracks, playlists } = useOutletContext();

  // Estimation des heures d'écoute
  const estimatedListeningHours = topTracks.reduce((total, track) => {
    return total + (track.duration_ms / 3600000); // Convertir ms en heures
  }, 0).toFixed(2);

  return (
    <div>
      <h1 style={styles.title}>Statistiques détaillées</h1>
      <section style={styles.section}>
        <h2 style={styles.subtitle}>Vos Artistes Préférés</h2>
        <div style={styles.grid}>
          {topArtists.map(artist => (
            <div key={artist.id} style={styles.card}>
              {artist.images && artist.images.length > 0 && (
                <img src={artist.images[0].url} alt={artist.name} style={styles.artistImage} />
              )}
              <h3 style={styles.artistName}>{artist.name}</h3>
              <p>Genres: {artist.genres.slice(0, 2).join(', ')}</p>
              <p>Popularité: {artist.popularity}%</p>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subtitle}>Vos Morceaux Préférés</h2>
        <p>Estimation des heures d'écoute: {estimatedListeningHours} heures</p>
        <div style={styles.trackList}>
          {topTracks.map((track, index) => (
            <div key={track.id} style={styles.trackItem}>
              <span style={styles.trackNumber}>{index + 1}</span>
              <img 
                src={track.album.images[2]?.url} 
                alt={track.name}
                style={styles.trackImage}
              />
              <div style={styles.trackInfo}>
                <h3 style={styles.trackName}>{track.name}</h3>
                <p>{track.artists.map(a => a.name).join(', ')}</p>
                <p>Album: {track.album.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subtitle}>Vos Playlists</h2>
        <div style={styles.grid}>
          {playlists.map(playlist => (
            <div key={playlist.id} style={styles.card}>
              {playlist.images && playlist.images.length > 0 && (
                <img src={playlist.images[0].url} alt={playlist.name} style={styles.artistImage} />
              )}
              <h3 style={styles.artistName}>{playlist.name}</h3>
              <p>Nombre de morceaux: {playlist.tracks.total}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const styles = {
  title: {
    color: 'white',
    marginBottom: '30px',
  },
  subtitle: {
    color: 'white',
    marginBottom: '20px',
  },
  section: {
    marginBottom: '40px',
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
    color: 'white',
  },
  artistImage: {
    width: '100%',
    borderRadius: '5px',
    marginBottom: '10px',
  },
  artistName: {
    margin: '10px 0',
    color: 'white',
  },
  trackList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  trackItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#282828',
    borderRadius: '5px',
    color: 'white',
  },
  trackNumber: {
    width: '30px',
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  trackImage: {
    width: '60px',
    height: '60px',
    marginRight: '15px',
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    margin: '0 0 5px 0',
    color: 'white',
  }
};

export default Stats; 
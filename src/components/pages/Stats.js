import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const Stats = () => {
  const { topArtists, topTracks, timeRange, setTimeRange } = useOutletContext();

  // Préparation des données pour le diagramme circulaire des genres
  const genreData = topArtists.reduce((acc, artist) => {
    if (artist.genres) {
      artist.genres.forEach(genre => {
        acc[genre] = (acc[genre] || 0) + 1;
      });
    }
    return acc;
  }, {});

  const sortedGenres = Object.entries(genreData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const chartData = {
    labels: sortedGenres.map(([genre]) => genre),
    datasets: [{
      data: sortedGenres.map(([, count]) => count),
      backgroundColor: [
        '#1DB954',
        '#1ed760',
        '#1aa34a',
        '#168d40',
        '#137736'
      ],
      borderWidth: 0
    }]
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'white',
          font: {
            size: 12
          }
        }
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
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

      <div style={styles.content}>
        <div style={styles.chartSection}>
          <h2 style={styles.sectionTitle}>Vos Genres Préférés</h2>
          <div style={styles.chart}>
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>

        <div style={styles.listsContainer}>
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Vos Top Artistes</h2>
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
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Vos Top Titres</h2>
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
          </section>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  content: {
    display: 'flex',
    gap: '40px',
    marginTop: '30px',
  },
  chartSection: {
    flex: '0 0 400px',
    backgroundColor: '#282828',
    padding: '20px',
    borderRadius: '10px',
    height: 'fit-content',
  },
  chart: {
    maxWidth: '100%',
    margin: '0 auto',
  },
  listsContainer: {
    flex: 1,
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    color: '#1DB954',
    marginBottom: '20px',
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
    justifyContent: 'center',
    marginBottom: '30px',
  },
  timeRangeSelector: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
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
  }
};

export default Stats; 
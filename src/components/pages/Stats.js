import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Stats = () => {
  const { topArtists, topTracks, timeRange, setTimeRange } = useOutletContext();
  const [audioFeatures, setAudioFeatures] = useState(null);

  // Couleurs vibrantes pour les genres
  const genreColors = [
    '#1DB954', // Vert Spotify
    '#FF6B6B', // Rouge corail
    '#4ECDC4', // Turquoise
    '#FFD93D', // Jaune
    '#6C5CE7', // Violet
    '#A8E6CF', // Menthe
    '#FF8B94', // Rose
    '#98DDCA', // Vert d'eau
    '#D4A5A5', // Rose poudré
    '#9A8C98'  // Mauve
  ];

  useEffect(() => {
    const fetchAudioFeatures = async () => {
      const token = localStorage.getItem('spotify_token');
      if (!token || !topTracks.length) return;

      try {
        const trackIds = topTracks.map(track => track.id).join(',');
        const response = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setAudioFeatures(data.audio_features);
      } catch (error) {
        console.error('Erreur lors de la récupération des caractéristiques audio:', error);
      }
    };

    fetchAudioFeatures();
  }, [topTracks]);

  // Préparation des données pour le diagramme des genres
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
    .slice(0, 8);

  const chartData = {
    labels: sortedGenres.map(([genre]) => genre),
    datasets: [{
      data: sortedGenres.map(([, count]) => count),
      backgroundColor: genreColors.slice(0, sortedGenres.length),
      borderWidth: 0
    }]
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'white',
          font: { size: 12 },
          generateLabels: (chart) => {
            const data = chart.data;
            return data.labels.map((label, i) => ({
              text: label,
              fillStyle: data.datasets[0].backgroundColor[i],
              strokeStyle: data.datasets[0].backgroundColor[i],
              lineWidth: 0,
              hidden: false,
              index: i
            }));
          }
        }
      }
    }
  };

  // Calcul des moyennes des caractéristiques audio
  const averageFeatures = audioFeatures?.reduce(
    (acc, track) => {
      if (!track) return acc;
      return {
        danceability: acc.danceability + track.danceability,
        energy: acc.energy + track.energy,
        valence: acc.valence + track.valence,
        tempo: acc.tempo + track.tempo,
        acousticness: acc.acousticness + track.acousticness
      };
    },
    { danceability: 0, energy: 0, valence: 0, tempo: 0, acousticness: 0 }
  );

  if (averageFeatures) {
    const count = audioFeatures.filter(f => f).length;
    Object.keys(averageFeatures).forEach(key => {
      averageFeatures[key] = +(averageFeatures[key] / count).toFixed(2);
    });
  }

  const featuresChartData = {
    labels: ['Dansabilité', 'Énergie', 'Positivité', 'Acoustique'],
    datasets: [{
      label: 'Caractéristiques moyennes',
      data: averageFeatures ? [
        averageFeatures.danceability * 100,
        averageFeatures.energy * 100,
        averageFeatures.valence * 100,
        averageFeatures.acousticness * 100
      ] : [],
      backgroundColor: 'rgba(29, 185, 84, 0.5)',
      borderColor: '#1DB954',
      borderWidth: 1
    }]
  };

  const featuresChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Analyse musicale de vos titres préférés',
        color: 'white',
        font: {
          size: 16
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
        <div style={styles.chartsContainer}>
          <div style={styles.chartSection}>
            <h2 style={styles.sectionTitle}>Vos Genres Préférés</h2>
            <div style={styles.chart}>
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </div>

          {audioFeatures && (
            <div style={styles.chartSection}>
              <div style={styles.chart}>
                <Bar data={featuresChartData} options={featuresChartOptions} />
              </div>
              <div style={styles.statsInfo}>
                <p style={styles.tempo}>Tempo moyen : {averageFeatures.tempo.toFixed(0)} BPM</p>
              </div>
            </div>
          )}
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
  chartsContainer: {
    flex: '0 0 400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  chartSection: {
    backgroundColor: '#282828',
    padding: '20px',
    borderRadius: '10px',
    height: 'fit-content',
  },
  chart: {
    maxWidth: '100%',
    margin: '0 auto',
  },
  statsInfo: {
    marginTop: '20px',
    textAlign: 'center',
  },
  tempo: {
    color: '#1DB954',
    fontSize: '1.1rem',
    fontWeight: 'bold',
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
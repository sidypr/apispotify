import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Line, Radar, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement
);

const Analysis = () => {
  const { topTracks, topArtists } = useOutletContext();
  const [audioFeatures, setAudioFeatures] = useState(null);
  const [recentTracks, setRecentTracks] = useState([]);
  const [playlistStats, setPlaylistStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [artistGenres, setArtistGenres] = useState({});
  const [popularityStats, setPopularityStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('spotify_token');
      if (!token) {
        setError("Token non trouvé. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      try {
        // Récupérer les caractéristiques audio
        if (topTracks.length) {
          const trackIds = topTracks.map(track => track.id).join(',');
          const featuresResponse = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const featuresData = await featuresResponse.json();
          setAudioFeatures(featuresData.audio_features);
        }

        // Récupérer l'historique d'écoute récent
        const recentResponse = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const recentData = await recentResponse.json();
        setRecentTracks(recentData.items);

        // Récupérer les playlists
        const playlistsResponse = await fetch('https://api.spotify.com/v1/me/playlists', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const playlistsData = await playlistsResponse.json();
        
        // Analyser les playlists
        const stats = {
          totalPlaylists: playlistsData.items.length,
          totalTracks: playlistsData.items.reduce((acc, playlist) => acc + playlist.tracks.total, 0),
          publicPlaylists: playlistsData.items.filter(p => p.public).length,
          privatePlaylists: playlistsData.items.filter(p => !p.public).length,
          collaborative: playlistsData.items.filter(p => p.collaborative).length
        };
        setPlaylistStats(stats);

        // Analyser les genres des artistes
        const genres = topArtists.reduce((acc, artist) => {
          if (artist.genres) {
            artist.genres.forEach(genre => {
              acc[genre] = (acc[genre] || 0) + 1;
            });
          }
          return acc;
        }, {});
        setArtistGenres(genres);

        // Analyser la popularité
        const popularityData = {
          artists: {
            average: Math.round(topArtists.reduce((acc, artist) => acc + artist.popularity, 0) / topArtists.length),
            max: Math.max(...topArtists.map(artist => artist.popularity)),
            min: Math.min(...topArtists.map(artist => artist.popularity))
          },
          tracks: {
            average: Math.round(topTracks.reduce((acc, track) => acc + track.popularity, 0) / topTracks.length),
            max: Math.max(...topTracks.map(track => track.popularity)),
            min: Math.min(...topTracks.map(track => track.popularity))
          }
        };
        setPopularityStats(popularityData);

        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setError("Une erreur est survenue lors de la récupération des données.");
        setLoading(false);
      }
    };

    fetchData();
  }, [topTracks, topArtists]);

  // Analyse des moments d'écoute
  const listeningHours = recentTracks.reduce((acc, track) => {
    const hour = new Date(track.played_at).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});

  const listeningTimeData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}h`),
    datasets: [{
      label: 'Écoutes par heure',
      data: Array.from({ length: 24 }, (_, i) => listeningHours[i] || 0),
      fill: true,
      backgroundColor: 'rgba(29, 185, 84, 0.2)',
      borderColor: '#1DB954',
      tension: 0.4
    }]
  };

  const timeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: 'white' }
      },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: 'white' }
      }
    },
    plugins: {
      legend: {
        labels: { color: 'white' }
      },
      title: {
        display: true,
        text: 'Répartition des écoutes sur 24h',
        color: 'white',
        font: { size: 16 }
      }
    }
  };

  // Analyse des caractéristiques musicales
  const averageFeatures = audioFeatures?.reduce(
    (acc, track) => {
      if (!track) return acc;
      return {
        danceability: acc.danceability + track.danceability,
        energy: acc.energy + track.energy,
        valence: acc.valence + track.valence,
        instrumentalness: acc.instrumentalness + track.instrumentalness,
        acousticness: acc.acousticness + track.acousticness,
        speechiness: acc.speechiness + track.speechiness,
        tempo: acc.tempo + track.tempo,
        key: acc.key + track.key
      };
    },
    { danceability: 0, energy: 0, valence: 0, instrumentalness: 0, acousticness: 0, speechiness: 0, tempo: 0, key: 0 }
  );

  if (averageFeatures) {
    const count = audioFeatures.filter(f => f).length;
    Object.keys(averageFeatures).forEach(key => {
      averageFeatures[key] = +(averageFeatures[key] / count).toFixed(2);
    });
  }

  const radarData = {
    labels: [
      'Dansabilité',
      'Énergie',
      'Positivité',
      'Instrumental',
      'Acoustique',
      'Voix'
    ],
    datasets: [{
      label: 'Caractéristiques musicales',
      data: averageFeatures ? [
        averageFeatures.danceability * 100,
        averageFeatures.energy * 100,
        averageFeatures.valence * 100,
        averageFeatures.instrumentalness * 100,
        averageFeatures.acousticness * 100,
        averageFeatures.speechiness * 100
      ] : [],
      backgroundColor: 'rgba(29, 185, 84, 0.2)',
      borderColor: '#1DB954',
      borderWidth: 2,
      pointBackgroundColor: '#1DB954',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#1DB954'
    }]
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: 'white',
          backdropColor: 'transparent'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        pointLabels: {
          color: 'white',
          font: { size: 12 }
        }
      }
    },
    plugins: {
      legend: {
        labels: { color: 'white' }
      }
    }
  };

  // Popularité
  const popularityData = {
    labels: ['Artistes', 'Titres'],
    datasets: [
      {
        label: 'Popularité moyenne',
        data: popularityStats ? [
          popularityStats.artists.average,
          popularityStats.tracks.average
        ] : [],
        backgroundColor: '#1DB954',
      },
      {
        label: 'Popularité maximale',
        data: popularityStats ? [
          popularityStats.artists.max,
          popularityStats.tracks.max
        ] : [],
        backgroundColor: '#4CAF50',
      }
    ]
  };

  const popularityOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: 'white' }
      },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: 'white' }
      }
    },
    plugins: {
      legend: {
        labels: { color: 'white' }
      },
      title: {
        display: true,
        text: 'Analyse de la popularité',
        color: 'white',
        font: { size: 16 }
      }
    }
  };

  // Statistiques des playlists
  const playlistData = playlistStats ? {
    labels: ['Publiques', 'Privées', 'Collaboratives'],
    datasets: [{
      data: [
        playlistStats.publicPlaylists,
        playlistStats.privatePlaylists,
        playlistStats.collaborative
      ],
      backgroundColor: ['#1DB954', '#535353', '#4CAF50'],
      borderWidth: 0
    }]
  } : null;

  const playlistOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: 'white' }
      }
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingCard}>
          <div style={styles.loader}></div>
          <p style={styles.loadingText}>Chargement de vos statistiques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <h2 style={styles.errorTitle}>Erreur</h2>
          <p style={styles.errorMessage}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Analyse Approfondie</h1>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Moments d'Écoute</h2>
          <div style={styles.chartContainer}>
            <Line data={listeningTimeData} options={timeChartOptions} />
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Profil Musical</h2>
          <div style={styles.chartContainer}>
            <Radar data={radarData} options={radarOptions} />
          </div>
          {averageFeatures && (
            <div style={styles.additionalStats}>
              <p style={styles.stat}>
                Tempo moyen : <span style={styles.statValue}>{Math.round(averageFeatures.tempo)} BPM</span>
              </p>
            </div>
          )}
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Popularité</h2>
          <div style={styles.chartContainer}>
            <Bar data={popularityData} options={popularityOptions} />
          </div>
        </div>

        {playlistStats && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Vos Playlists</h2>
            <div style={styles.playlistStats}>
              <p style={styles.stat}>
                Nombre total de playlists : <span style={styles.statValue}>{playlistStats.totalPlaylists}</span>
              </p>
              <p style={styles.stat}>
                Nombre total de titres : <span style={styles.statValue}>{playlistStats.totalTracks}</span>
              </p>
              <div style={styles.chartContainer}>
                <Pie data={playlistData} options={playlistOptions} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    color: 'white',
  },
  title: {
    fontSize: '2rem',
    color: '#1DB954',
    marginBottom: '30px',
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#282828',
    borderRadius: '10px',
    padding: '20px',
    minHeight: '400px',
  },
  cardTitle: {
    fontSize: '1.5rem',
    color: '#1DB954',
    marginBottom: '20px',
    textAlign: 'center',
  },
  chartContainer: {
    position: 'relative',
    height: '300px',
    width: '100%',
  },
  playlistStats: {
    textAlign: 'center',
  },
  stat: {
    fontSize: '1.1rem',
    marginBottom: '10px',
    color: '#b3b3b3',
  },
  statValue: {
    color: '#1DB954',
    fontWeight: 'bold',
  },
  additionalStats: {
    marginTop: '20px',
    textAlign: 'center',
  },
  loadingCard: {
    backgroundColor: '#282828',
    padding: '30px',
    borderRadius: '10px',
    maxWidth: '400px',
    margin: '100px auto',
    textAlign: 'center',
  },
  loader: {
    border: '4px solid #1DB954',
    borderTop: '4px solid transparent',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px',
  },
  loadingText: {
    color: '#b3b3b3',
    fontSize: '1.1rem',
  },
  errorCard: {
    backgroundColor: '#282828',
    padding: '30px',
    borderRadius: '10px',
    maxWidth: '400px',
    margin: '100px auto',
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
  },
};

export default Analysis; 
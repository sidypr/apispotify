import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Filters = () => {
  const { topArtists, timeRange, setTimeRange } = useOutletContext();

  // Calculer les heures d'écoute pour chaque période
  const calculateListeningHours = (tracks) => {
    return tracks.reduce((total, track) => {
      return total + (track.duration_ms / 3600000); // Convertir ms en heures
    }, 0).toFixed(2);
  };

  const listeningHours = calculateListeningHours(topArtists);

  // Préparer les données pour les diagrammes
  const genreCounts = {};
  topArtists.forEach(artist => {
    artist.genres.forEach(genre => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
  });

  const chartData = {
    labels: Object.keys(genreCounts),
    datasets: [
      {
        label: 'Nombre d\'artistes',
        data: Object.values(genreCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Répartition des genres musicaux',
      },
    },
  };

  return (
    <div>
      <h1 style={styles.title}>Filtres temporels</h1>
      <div style={styles.timeSelector}>
        <button 
          onClick={() => setTimeRange('short_term')}
          style={timeRange === 'short_term' ? styles.activeButton : styles.button}
        >
          4 semaines
        </button>
        <button 
          onClick={() => setTimeRange('medium_term')}
          style={timeRange === 'medium_term' ? styles.activeButton : styles.button}
        >
          6 mois
        </button>
        <button 
          onClick={() => setTimeRange('long_term')}
          style={timeRange === 'long_term' ? styles.activeButton : styles.button}
        >
          Tout le temps
        </button>
      </div>
      <div style={styles.listeningHours}>
        <p>Heures d'écoute estimées pour {timeRange === 'short_term' ? '4 semaines' : timeRange === 'medium_term' ? '6 mois' : 'tout le temps'}: {listeningHours} heures</p>
      </div>
      <div style={styles.chartsContainer}>
        <div style={styles.chart}>
          <Doughnut data={chartData} options={chartOptions} />
        </div>
        <div style={styles.chart}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  title: {
    color: 'white',
    marginBottom: '30px',
  },
  timeSelector: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '20px',
    backgroundColor: '#282828',
    color: 'white',
    cursor: 'pointer',
  },
  activeButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '20px',
    backgroundColor: '#1DB954',
    color: 'white',
    cursor: 'pointer',
  },
  listeningHours: {
    color: 'white',
    marginTop: '20px',
  },
  chartsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '40px',
  },
  chart: {
    maxWidth: '400px', // Réduire la taille des graphiques
  }
};

export default Filters; 
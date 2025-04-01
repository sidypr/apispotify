import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [timeRange, setTimeRange] = useState('medium_term'); // medium_term = 6 mois
  const navigate = useNavigate();

  useEffect(() => {
    const token = window.localStorage.getItem("spotify_token");
    
    if (!token) {
      navigate('/');
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    // Récupérer le profil
    fetch('https://api.spotify.com/v1/me', { headers })
      .then(response => {
        if (!response.ok) throw new Error('Token invalide');
        return response.json();
      })
      .then(data => setProfile(data))
      .catch(error => {
        console.error('Erreur profil:', error);
        window.localStorage.removeItem("spotify_token");
        navigate('/');
      });

    // Récupérer les top tracks
    fetch(`https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=${timeRange}`, { headers })
      .then(response => response.json())
      .then(data => setTopTracks(data.items))
      .catch(error => console.error('Erreur tracks:', error));

    // Récupérer les top artistes
    fetch(`https://api.spotify.com/v1/me/top/artists?limit=10&time_range=${timeRange}`, { headers })
      .then(response => response.json())
      .then(data => setTopArtists(data.items))
      .catch(error => console.error('Erreur artistes:', error));

    // Récupérer les playlists
    fetch('https://api.spotify.com/v1/me/playlists', { headers })
      .then(response => response.json())
      .then(data => setPlaylists(data.items))
      .catch(error => console.error('Erreur playlists:', error));

  }, [navigate, timeRange]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("spotify_token");
    navigate('/');
  };

  if (!profile) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <Outlet context={{
          profile,
          topTracks,
          topArtists,
          playlists,
          timeRange,
          setTimeRange
        }} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#282828',
    borderRadius: '10px',
  },
  profileImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    marginRight: '20px',
  },
  profileInfo: {
    color: 'white',
  },
  timeSelector: {
    marginBottom: '30px',
    display: 'flex',
    gap: '10px',
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
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#E91429',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    marginTop: '20px',
  }
};

export default Dashboard; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Données de démonstration
const demoData = {
  user: {
    display_name: "Utilisateur Démo",
    images: [{ url: "https://i.scdn.co/image/ab6775700000ee8555c25988a6ac314394d3fbf5" }]
  },
  topArtists: [
    { id: "1", name: "Daft Punk", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb10c60f7a75bc044ded6f7670" }] },
    { id: "2", name: "David Guetta", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb75348e1aade2645ad9c58829" }] },
    { id: "3", name: "The Weeknd", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb" }] },
    { id: "4", name: "Drake", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9" }] },
    { id: "5", name: "Coldplay", images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb989ed05e1f0570cc4726c2d3" }] }
  ],
  topTracks: [
    { id: "1", name: "Blinding Lights", artists: [{ name: "The Weeknd" }], album: { images: [{ url: "https://i.scdn.co/image/ab67616d0000b273b5d7c57efe7775915b19c8c1" }] } },
    { id: "2", name: "Dance Monkey", artists: [{ name: "Tones and I" }], album: { images: [{ url: "https://i.scdn.co/image/ab67616d0000b273c6f7af36bcd639a426d3f137" }] } },
    { id: "3", name: "Shape of You", artists: [{ name: "Ed Sheeran" }], album: { images: [{ url: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96" }] } },
    { id: "4", name: "Someone You Loved", artists: [{ name: "Lewis Capaldi" }], album: { images: [{ url: "https://i.scdn.co/image/ab67616d0000b273fc2101e6889d6ce9025f85f2" }] } },
    { id: "5", name: "Bad Guy", artists: [{ name: "Billie Eilish" }], album: { images: [{ url: "https://i.scdn.co/image/ab67616d0000b27350a3147b4edd7701a876c6ce" }] } }
  ]
};

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('spotify_token');
      const isDemo = localStorage.getItem('demo_mode');

      if (isDemo) {
        // Mode démo
        setTimeout(() => {
          setUserData(demoData.user);
          setTopArtists(demoData.topArtists);
          setTopTracks(demoData.topTracks);
          setLoading(false);
        }, 1500);
        return;
      }

      if (!token) {
        navigate('/');
        return;
      }

      try {
        // Récupérer les données Spotify
        const [userResponse, tracksResponse, artistsResponse] = await Promise.all([
          fetch('https://api.spotify.com/v1/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('https://api.spotify.com/v1/me/top/artists?limit=10', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        const [userData, tracksData, artistsData] = await Promise.all([
          userResponse.json(),
          tracksResponse.json(),
          artistsResponse.json()
        ]);

        setUserData(userData);
        setTopTracks(tracksData.items);
        setTopArtists(artistsData.items);
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        navigate('/');
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Chargement de vos statistiques...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {userData && (
        <div style={styles.header}>
          {userData.images?.[0]?.url && (
            <img 
              src={userData.images[0].url} 
              alt="Profile" 
              style={styles.profileImage}
            />
          )}
          <h1 style={styles.title}>Bienvenue, {userData.display_name}</h1>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Déconnexion
          </button>
        </div>
      )}

      <div style={styles.content}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Vos Top Artistes</h2>
          <div style={styles.grid}>
            {topArtists.map(artist => (
              <div key={artist.id} style={styles.card}>
                {artist.images?.[0]?.url && (
                  <img 
                    src={artist.images[0].url} 
                    alt={artist.name}
                    style={styles.artistImage}
                  />
                )}
                <h3 style={styles.itemTitle}>{artist.name}</h3>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Vos Top Titres</h2>
          <div style={styles.list}>
            {topTracks.map(track => (
              <div key={track.id} style={styles.trackItem}>
                <img 
                  src={track.album.images[0].url} 
                  alt={track.name}
                  style={styles.trackImage}
                />
                <div style={styles.trackInfo}>
                  <h3 style={styles.trackTitle}>{track.name}</h3>
                  <p style={styles.trackArtist}>{track.artists[0].name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#121212',
    color: 'white',
    padding: '20px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '40px',
    padding: '20px',
  },
  profileImage: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    marginRight: '20px',
  },
  title: {
    fontSize: '2rem',
    margin: 0,
    flex: 1,
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    marginBottom: '20px',
    color: '#1DB954',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#282828',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  artistImage: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: '50%',
    marginBottom: '10px',
  },
  itemTitle: {
    fontSize: '1rem',
    margin: '10px 0',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  trackItem: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#282828',
    padding: '10px',
    borderRadius: '8px',
  },
  trackImage: {
    width: '60px',
    height: '60px',
    marginRight: '15px',
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    margin: 0,
    fontSize: '1rem',
  },
  trackArtist: {
    margin: '5px 0 0',
    color: '#b3b3b3',
  },
  logoutButton: {
    backgroundColor: '#1DB954',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  loader: {
    border: '4px solid #1DB954',
    borderTop: '4px solid transparent',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    margin: '20px auto',
  },
  loadingText: {
    textAlign: 'center',
    color: '#b3b3b3',
  }
};

export default Dashboard; 
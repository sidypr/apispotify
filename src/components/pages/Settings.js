import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const Settings = () => {
  const { userData } = useOutletContext();
  const [timeRange, setTimeRange] = useState('medium_term');
  const [displayMode, setDisplayMode] = useState('grid');
  const [theme, setTheme] = useState('dark');

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    localStorage.setItem('timeRange', range);
  };

  const handleDisplayModeChange = (mode) => {
    setDisplayMode(mode);
    localStorage.setItem('displayMode', mode);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Paramètres</h1>
      
      <section style={styles.section}>
        <h2 style={styles.subtitle}>Période d'analyse</h2>
        <div style={styles.buttonGroup}>
          <button 
            onClick={() => handleTimeRangeChange('short_term')}
            style={timeRange === 'short_term' ? styles.activeButton : styles.button}
          >
            4 semaines
          </button>
          <button 
            onClick={() => handleTimeRangeChange('medium_term')}
            style={timeRange === 'medium_term' ? styles.activeButton : styles.button}
          >
            6 mois
          </button>
          <button 
            onClick={() => handleTimeRangeChange('long_term')}
            style={timeRange === 'long_term' ? styles.activeButton : styles.button}
          >
            Tout le temps
          </button>
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subtitle}>Mode d'affichage</h2>
        <div style={styles.buttonGroup}>
          <button 
            onClick={() => handleDisplayModeChange('grid')}
            style={displayMode === 'grid' ? styles.activeButton : styles.button}
          >
            Grille
          </button>
          <button 
            onClick={() => handleDisplayModeChange('list')}
            style={displayMode === 'list' ? styles.activeButton : styles.button}
          >
            Liste
          </button>
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subtitle}>Thème</h2>
        <div style={styles.buttonGroup}>
          <button 
            onClick={() => handleThemeChange('dark')}
            style={theme === 'dark' ? styles.activeButton : styles.button}
          >
            Sombre
          </button>
          <button 
            onClick={() => handleThemeChange('light')}
            style={theme === 'light' ? styles.activeButton : styles.button}
          >
            Clair
          </button>
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subtitle}>Informations du compte</h2>
        <div style={styles.profileInfo}>
          <p>Nom: {userData?.display_name}</p>
          <p>Email: {userData?.email}</p>
          <p>Pays: {userData?.country}</p>
          <p>Type de compte: {userData?.product}</p>
        </div>
      </section>
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
    marginBottom: '30px',
    color: '#1DB954',
  },
  section: {
    marginBottom: '30px',
  },
  subtitle: {
    fontSize: '1.5rem',
    marginBottom: '15px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#282828',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  activeButton: {
    backgroundColor: '#1DB954',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  profileInfo: {
    backgroundColor: '#282828',
    padding: '20px',
    borderRadius: '10px',
    '& p': {
      marginBottom: '10px',
    }
  }
};

export default Settings; 
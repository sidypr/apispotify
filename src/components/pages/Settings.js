import React from 'react';
import { useOutletContext } from 'react-router-dom';

const Settings = () => {
  const { displayMode, setDisplayMode } = useOutletContext();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Paramètres</h1>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Mode d'affichage</h2>
        <div style={styles.optionsContainer}>
          <button 
            onClick={() => setDisplayMode('grid')}
            style={displayMode === 'grid' ? styles.activeButton : styles.button}
          >
            Grille
          </button>
          <button 
            onClick={() => setDisplayMode('list')}
            style={displayMode === 'list' ? styles.activeButton : styles.button}
          >
            Liste
          </button>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    maxWidth: '800px',
    margin: '0 auto',
    color: 'white',
  },
  title: {
    fontSize: '2.5rem',
    color: '#1DB954',
    marginBottom: '40px',
  },
  section: {
    backgroundColor: '#282828',
    padding: '30px',
    borderRadius: '10px',
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    marginBottom: '20px',
    color: '#1DB954',
  },
  optionsContainer: {
    display: 'flex',
    gap: '15px',
  },
  button: {
    backgroundColor: '#282828',
    color: 'white',
    border: '1px solid #1DB954',
    padding: '10px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.2s',
  },
  activeButton: {
    backgroundColor: '#1DB954',
    color: 'white',
    border: '1px solid #1DB954',
    padding: '10px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.2s',
  },
};

export default Settings; 
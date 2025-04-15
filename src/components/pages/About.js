import React from 'react';

const About = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>À propos de Spotify Stats</h1>
      
      <div style={styles.content}>
        <section style={styles.section}>
          <h2 style={styles.subtitle}>Présentation</h2>
          <p style={styles.text}>
            Spotify Stats est une application qui vous permet de découvrir vos habitudes d'écoute sur Spotify.
            Visualisez vos artistes et titres préférés, explorez de nouvelles musiques, et contrôlez votre lecture
            directement depuis l'application.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>Fonctionnalités</h2>
          <ul style={styles.list}>
            <li>Visualisation de vos top artistes et titres</li>
            <li>Recherche de musique avec aperçu audio</li>
            <li>Contrôle de lecture Spotify intégré</li>
            <li>Statistiques détaillées sur vos goûts musicaux</li>
            <li>Personnalisation de l'affichage</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>Développeur</h2>
          <p style={styles.text}>
            Cette application a été développée par Sidy. 
            Retrouvez-moi sur{' '}
            <a 
              href="https://github.com/sidypr" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.link}
            >
              GitHub
            </a>
            {' '}et{' '}
            <a 
              href="https://www.linkedin.com/in/sidy-djimbira-118471223" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.link}
            >
              LinkedIn
            </a>
          </p>
        </section>
      </div>
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
    textAlign: 'center',
  },
  content: {
    backgroundColor: '#282828',
    padding: '30px',
    borderRadius: '10px',
  },
  section: {
    marginBottom: '30px',
  },
  subtitle: {
    fontSize: '1.8rem',
    color: '#1DB954',
    marginBottom: '20px',
  },
  text: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: '#b3b3b3',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    '& li': {
      fontSize: '1.1rem',
      color: '#b3b3b3',
      marginBottom: '10px',
      paddingLeft: '20px',
      position: 'relative',
      '&::before': {
        content: '"•"',
        color: '#1DB954',
        position: 'absolute',
        left: 0,
      },
    },
  },
  link: {
    color: '#1DB954',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
};

export default About; 
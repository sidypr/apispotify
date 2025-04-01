import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const navStyle = {
    navbar: {
      backgroundColor: '#282828',
      padding: '15px',
      marginBottom: '30px',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    nav: {
      display: 'flex',
      gap: '20px',
    },
    link: {
      color: 'white',
      textDecoration: 'none',
      padding: '8px 16px',
      borderRadius: '20px',
    },
    activeLink: {
      backgroundColor: '#1DB954',
      color: 'white',
    }
  };

  return (
    <div style={navStyle.navbar}>
      <div style={navStyle.container}>
        <div style={navStyle.nav}>
          <NavLink 
            to="/dashboard" 
            style={({isActive}) => ({
              ...navStyle.link,
              ...(isActive ? navStyle.activeLink : {})
            })}
            end
          >
            Statistiques
          </NavLink>
          <NavLink 
            to="/dashboard/filters" 
            style={({isActive}) => ({
              ...navStyle.link,
              ...(isActive ? navStyle.activeLink : {})
            })}
          >
            Filtres
          </NavLink>
          <NavLink 
            to="/dashboard/info" 
            style={({isActive}) => ({
              ...navStyle.link,
              ...(isActive ? navStyle.activeLink : {})
            })}
          >
            Informations
          </NavLink>
        </div>
        <button 
          onClick={() => {
            if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
              window.localStorage.removeItem("spotify_token");
              window.location.href = '/';
            }
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#E91429',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
          }}
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Navbar; 
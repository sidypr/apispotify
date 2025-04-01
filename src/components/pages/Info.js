import React from 'react';
import { useOutletContext } from 'react-router-dom';

const Info = () => {
  const { profile } = useOutletContext();

  return (
    <div>
      <h1 style={styles.title}>Informations du profil</h1>
      <div style={styles.profileCard}>
        {profile.images && profile.images.length > 0 && (
          <img src={profile.images[0].url} alt="Profile" style={styles.profileImage} />
        )}
        <div style={styles.profileInfo}>
          <h2 style={styles.subtitle}>{profile.display_name}</h2>
          <p>Email: {profile.email}</p>
          <p>Pays: {profile.country}</p>
          <p>Followers: {profile.followers?.total}</p>
          <p>Type de compte: {profile.product}</p>
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
  subtitle: {
    color: 'white',
    marginBottom: '20px',
  },
  profileCard: {
    backgroundColor: '#282828',
    padding: '20px',
    borderRadius: '10px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  profileImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
  },
  profileInfo: {
    '& p': {
      marginBottom: '10px',
    }
  }
};

export default Info; 
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SpotifyAuth from './components/SpotifyAuth';
import Callback from './components/Callback';
import Dashboard from './components/Dashboard';
import Stats from './components/pages/Stats';
import Search from './components/pages/Search';
import Player from './components/pages/Player';
import About from './components/pages/About';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SpotifyAuth />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Stats />} />
          <Route path="search" element={<Search />} />
          <Route path="player" element={<Player />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

useEffect(() => {
  const fetchPlaybackState = async () => {
    // Récupère l'état de lecture toutes les secondes
    // Met à jour les informations : piste en cours, état de lecture, volume, etc.
  };
  fetchPlaybackState();
  const interval = setInterval(fetchPlaybackState, 1000);
  return () => clearInterval(interval);
}, []); 
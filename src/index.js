import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SpotifyAuth from './components/SpotifyAuth';
import Callback from './components/Callback';
import Dashboard from './components/Dashboard';
import Stats from './components/pages/Stats';
import Filters from './components/pages/Filters';
import Info from './components/pages/Info';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SpotifyAuth />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Stats />} />
          <Route path="filters" element={<Filters />} />
          <Route path="info" element={<Info />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
); 
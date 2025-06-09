import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react'
import PlaylistList from './pages/PlaylistList'
import NewPlaylist from './pages/NewPlaylist'
import EditPlaylist from './pages/EditPlaylist'
import NoPage from './pages/NoPage'

import './App.css'

function App() {
  //in retrospect, using a Redux or Context would have helped make the edit playlist page perform as expected.
  //leaving this in a comment due to time constraint
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth-status', { credentials: "include" });
        const data = await response.json();

        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          window.location.href = "http://localhost:3000/login";
        }
      } catch (err) {
        console.error("Error checking auth status:", err);
        window.location.href = "http://localhost:3000/login";
      }
    };
    checkAuth();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<PlaylistList />} />
      <Route path="/new" element={<NewPlaylist />} />
      <Route path="/:id/edit" element={<EditPlaylist />} />
      <Route path="/*" element={<NoPage />} />
    </Routes>
  )
}

export default App

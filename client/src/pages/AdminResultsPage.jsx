import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import logo from '../assets/JaMoveoLogo.png';

// Initialize socket connection
const socket = io(import.meta.env.VITE_SERVER_URL);

function AdminResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve search results passed via router state
  const results = location.state?.results || [];

  // Handle song selection by admin
  const handleSelectSong = (song) => {
    // Save selected song to localStorage
    localStorage.setItem('currentSong', JSON.stringify(song));

    // Notify all users via socket event
    socket.emit('songSelected', song);

    // Redirect admin to the live session page
    navigate('/live', { state: { song, role: 'admin' } });
  };

  return (
    // Main container with colorful gradient background
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-700 via-pink-600 to-yellow-400 text-white">

      {/* Header: App logo and navigation link */}
      <header className="flex justify-start items-center p-4 md:p-6 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <Link to="/">
          <img
            src={logo}
            alt="JaMoveo"
            className="h-16 md:h-20 lg:h-24 object-contain hover:scale-105 transition-transform"
          />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 py-8">
        <div className="bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-xl">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">Search Results</h1>

          {/* No results fallback */}
          {results.length === 0 ? (
            <div className="text-center">
              <p className="text-white mb-4">No results found. Try searching for a different song.</p>
              <Link
                to="/admin"
                className="inline-block bg-white/20 border border-white/40 text-white px-6 py-2 rounded-lg hover:bg-white/30 transition backdrop-blur-md"
              >
                Back to Search
              </Link>
            </div>
          ) : (
            // Render list of search results
            <ul className="space-y-4">
              {results.map((song) => (
                <li
                  key={song.id}
                  onClick={() => handleSelectSong(song)}
                  className="cursor-pointer bg-white hover:bg-gray-100 transition border border-gray-300 rounded-lg p-4 shadow-md"
                >
                  <p className="text-lg font-semibold text-purple-700">{song.title}</p>
                  <p className="text-gray-700">by {song.artist}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {/* Footer with credit */}
      <footer className="text-center py-6 text-sm bg-black/30">
        Created by Noy Abecassis © 2025 •{' '}
        <a
          href="https://github.com/NoyAvaksis/jamoveo"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}

export default AdminResultsPage;

import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import logo from '../assets/JaMoveoLogo.png';

const socket = io(import.meta.env.VITE_SERVER_URL);

function AdminResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const results = location.state?.results || [];

  const handleSelectSong = (song) => {
    localStorage.setItem('currentSong', JSON.stringify(song));
    socket.emit('songSelected', song);
    navigate('/live', { state: { song, role: 'admin' } });
  };

  return (
    <div className="min-h-screen flex flex-col justify-start items-center bg-gradient-to-br from-purple-700 via-pink-600 to-yellow-400 px-4 py-10">
      {/* Header with logo */}
      <header className="w-full flex justify-start items-center px-6 mb-8">
        <Link to="/">
          <img
            src={logo}
            alt="JaMoveo"
            className="w-32 h-32 object-contain hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </header>

      <div className="bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Search Results</h1>

        {results.length === 0 ? (
          <p className="text-white text-center">No results found.</p>
        ) : (
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
    </div>
  );
}

export default AdminResultsPage;

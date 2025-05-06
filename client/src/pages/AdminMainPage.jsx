import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import songs from '../data/songsData';
import logo from '../assets/JaMoveoLogo.png';

function AdminMainPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    const results = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(trimmed.toLowerCase()) ||
        song.artist.toLowerCase().includes(trimmed.toLowerCase())
    );

    console.log('Search results:', results);

    navigate('/admin/results', { state: { results } });
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

      <div className="bg-white/20 backdrop-blur-md p-10 rounded-xl shadow-2xl text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-white mb-6">Search any song...</h1>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            type="text"
            placeholder="Enter song or artist name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 rounded-md border border-purple-400 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-black"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminMainPage;

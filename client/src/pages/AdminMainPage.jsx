import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import songs from '../data/songsData';
import logo from '../assets/JaMoveoLogo.png';

function AdminMainPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Handle form submission to search for songs
  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    // Filter songs by title or artist (case insensitive)
    const results = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(trimmed.toLowerCase()) ||
        song.artist.toLowerCase().includes(trimmed.toLowerCase())
    );

    // Navigate to results page and pass filtered data
    navigate('/admin/results', { state: { results } });
  };

  return (
    // Page layout: gradient background and vertical flex layout
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-700 via-pink-600 to-yellow-400 text-white">
      
      {/* Header with logo */}
      <header className="flex justify-start items-center p-4 md:p-6 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <Link to="/">
          <img
            src={logo}
            alt="JaMoveo"
            className="h-16 md:h-20 lg:h-24 object-contain hover:scale-105 transition-transform"
          />
        </Link>
      </header>

      {/* Search Area */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-10">
        <div className="bg-white/20 backdrop-blur-md p-10 rounded-xl shadow-2xl text-center max-w-md w-full">
          <h1 className="text-3xl font-bold text-white mb-6">Search any song...</h1>
          
          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
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
      </main>

      {/* Footer */}
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

export default AdminMainPage;

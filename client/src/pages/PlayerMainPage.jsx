import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import logo from '../assets/JaMoveoLogo.png';

// Initialize Socket.IO connection
const socket = io(import.meta.env.VITE_SERVER_URL);

function PlayerMainPage() {
  const navigate = useNavigate();
  const [waiting, setWaiting] = useState(true); // Controls waiting animation

  // Run once on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    // Redirect to login if user is not found
    if (!storedUser || !storedUser.role) {
      console.error('User info not found – redirecting to login');
      navigate('/login');
      return;
    }

    // Ping the server to check socket connection
    socket.emit("pingFromClient");

    // Listen for server response
    socket.on("pongFromServer", (message) => {
      console.log("✅ Socket.IO check:", message);
    });

    // Listen for song selection from admin
    socket.on('songSelected', (song) => {
      console.log('🎵 Song received from admin:', song);
      localStorage.setItem('currentSong', JSON.stringify(song));
      navigate('/live');
    });

    // Cleanup listeners when component unmounts
    return () => {
      socket.off('songSelected');
      socket.off('pongFromServer');
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-700 via-pink-600 to-yellow-400 text-white">
      
      {/* Header with clickable logo */}
      <header className="flex justify-start items-center p-4 md:p-6 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <Link to="/">
          <img
            src={logo}
            alt="JaMoveo"
            className="h-16 md:h-20 lg:h-24 object-contain hover:scale-105 transition-transform"
          />
        </Link>
      </header>

      {/* Main content with waiting indicator */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-10">
        <div className="bg-white/20 backdrop-blur-md p-10 rounded-xl shadow-2xl text-center max-w-md w-full">
          <h1 className="text-3xl font-bold text-white mb-4">Waiting for the next song...</h1>
          <p className="text-5xl animate-pulse">🎵🎶⏳</p>
          <div className="mt-6 flex justify-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </main>

      {/* Footer with GitHub link */}
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

export default PlayerMainPage;

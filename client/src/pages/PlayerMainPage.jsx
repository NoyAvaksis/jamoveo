import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import logo from '../assets/JaMoveoLogo.png';

const socket = io(import.meta.env.VITE_SERVER_URL);

function PlayerMainPage() {
  const navigate = useNavigate();
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!storedUser || !storedUser.role) {
      console.error('User info not found – redirecting to login');
      navigate('/login');
      return;
    }

    // 🧪 בדיקת תקשורת עם השרת
    socket.emit("pingFromClient");
    socket.on("pongFromServer", (message) => {
      console.log("✅ בדיקת Socket.IO:", message);
    });

    // מאזין לשיר מהאדמין
    socket.on('songSelected', (song) => {
      console.log('🎵 Song received from admin:', song);
      localStorage.setItem('currentSong', JSON.stringify(song));
      navigate('/live');
    });

    return () => {
      socket.off('songSelected');
      socket.off('pongFromServer'); // מנקה גם את הבדיקה
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-start items-center bg-gradient-to-br from-purple-700 via-pink-600 to-yellow-400 px-4 py-10">
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
        <h1 className="text-3xl font-bold text-white mb-4">Waiting for the next song...</h1>
        <p className="text-5xl animate-pulse">🎵🎶⏳</p>
        <div className="mt-6 flex justify-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}

export default PlayerMainPage;

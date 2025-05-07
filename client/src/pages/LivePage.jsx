import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SERVER_URL);

function LivePage() {
  const [song, setSong] = useState(null);
  const [user, setUser] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  useEffect(() => {
    const storedSong = JSON.parse(localStorage.getItem('currentSong'));
    const storedUser = JSON.parse(localStorage.getItem('user'));

    setSong(storedSong);
    setUser(storedUser);

    return () => stopAutoScroll();
  }, []);

  useEffect(() => {
    socket.on('sessionEnded', () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const role = storedUser?.role;
      localStorage.removeItem('currentSong');
      window.location.href = role === 'admin' ? '/admin' : '/player';
    });
    return () => socket.off('sessionEnded');
  }, []);

  const startAutoScroll = () => {
    if (!scrollRef.current) return;

    // בדיקה אם האלמנט ניתן לגלילה
    if (scrollRef.current.scrollHeight <= scrollRef.current.clientHeight) {
      console.warn("Element is not scrollable.");
      return;
    }

    const scrollStep = () => {
      if (!scrollRef.current) return;
      scrollRef.current.scrollTop += 1; // גלילה חלקה יותר
      scrollIntervalRef.current = requestAnimationFrame(scrollStep);
    };

    scrollIntervalRef.current = requestAnimationFrame(scrollStep);
    setIsScrolling(true);
  };

  const stopAutoScroll = () => {
    if (scrollIntervalRef.current) {
      cancelAnimationFrame(scrollIntervalRef.current);
    }
    setIsScrolling(false);
  };

  const toggleScroll = () => {
    isScrolling ? stopAutoScroll() : startAutoScroll();
  };

  const handleQuit = () => {
    socket.emit('sessionEnded');
  };

  const renderSongContent = () => {
    if (!song?.data || !Array.isArray(song.data)) {
      return <p className="text-white drop-shadow-md">No song content available.</p>;
    }

    const isSinger = user?.role === 'singer';

    return song.data.map((line, i) => (
      <div key={i} className="mb-6 bg-white/10 rounded-xl p-4 shadow-md max-w-full mx-auto">
        <div className="flex flex-wrap justify-center gap-x-4 text-center">
          {line.map((word, j) => (
            <div key={j} className="flex flex-col items-center min-w-[3ch]">
              {!isSinger && (
                <span className="text-purple-200 text-lg italic mb-1 leading-none drop-shadow">
                  {word.chords || '\u00A0'}
                </span>
              )}
              <span className="text-white text-3xl font-bold leading-tight drop-shadow">
                {word.lyrics}
              </span>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  if (!song || !user) {
    return <p className="text-white p-8 text-center text-lg">Loading live session...</p>;
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-yellow-600 px-4 py-8 relative">
      <h1 className="text-4xl text-center font-extrabold text-white mb-6 animate-fade-in">
        {song.title}{' '}
        <span className="italic font-light text-2xl">– {song.artist}</span>
      </h1>

      <div
        ref={scrollRef}
        className="h-[calc(100vh-180px)] overflow-y-auto scroll-smooth px-2 touch-auto overscroll-contain"
        style={{
          WebkitOverflowScrolling: 'touch',
          overflowY: 'auto',
          maxWidth: '100%',
          height: '75vh', // גובה דינמי למובייל
        }}
      >
        {renderSongContent()}
      </div>

      <div className="absolute bottom-4 left-0 w-full px-4 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto">
          <button
            onClick={toggleScroll}
            className="bg-gray-800 hover:bg-gradient-to-r from-purple-600 to-pink-600 transform transition hover:scale-105 active:scale-95 text-white px-6 py-3 rounded-xl shadow-xl text-lg"
          >
            {isScrolling ? 'Stop Scroll' : 'Start Scroll'}
          </button>
        </div>
        {isAdmin && (
          <div className="pointer-events-auto">
            <button
              onClick={handleQuit}
              className="bg-gray-800 hover:bg-gradient-to-r from-red-600 to-pink-500 transform transition hover:scale-105 active:scale-95 text-white px-6 py-3 rounded-xl shadow-xl text-lg"
            >
              Quit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LivePage;

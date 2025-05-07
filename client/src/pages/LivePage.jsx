import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SERVER_URL);

function LivePage() {
  const [song, setSong] = useState(null);
  const [user, setUser] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollRef = useRef(null);
  const scrollAnimationRef = useRef(null);

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

  const scrollStep = () => {
    if (!scrollRef.current || !isScrolling) return;
    scrollRef.current.scrollTop += 1;
    scrollAnimationRef.current = requestAnimationFrame(scrollStep);
  };

  const startScroll = () => {
    setIsScrolling(true);
    scrollStep();
  };

  const stopScroll = () => {
    setIsScrolling(false);
    cancelAnimationFrame(scrollAnimationRef.current);
  };

  const toggleScroll = () => {
    isScrolling ? stopScroll() : startScroll();
  };

  const handleQuit = () => {
    socket.emit('sessionEnded');
  };

  const renderSongContent = () => {
    if (!song?.data || !Array.isArray(song.data)) {
      return <p className="text-white text-center">No song content available.</p>;
    }

    const isSinger = user?.role === 'singer';

    return (
      <div className="space-y-8">
        {song.data.map((line, i) => (
          <div key={i} className="bg-white/10 rounded-xl p-4 shadow max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-x-6 text-center">
              {line.map((word, j) => (
                <div key={j} className="flex flex-col items-center min-w-[3ch]">
                  {!isSinger && (
                    <span className="text-purple-300 text-lg italic mb-1 leading-none">
                      {word.chords || '\u00A0'}
                    </span>
                  )}
                  <span className="text-white text-3xl font-semibold leading-tight">
                    {word.lyrics}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!song || !user) {
    return <p className="text-white p-8 text-center">Loading live session...</p>;
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-pink-700 to-yellow-500 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-6">
        {song.title} <span className="text-2xl italic font-light">– {song.artist}</span>
      </h1>

      <div
        ref={scrollRef}
        className="h-[70vh] overflow-y-auto bg-white/10 rounded-xl p-4"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {renderSongContent()}
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={toggleScroll}
          className="bg-green-600 px-6 py-2 rounded-lg shadow hover:bg-green-500"
        >
          {isScrolling ? 'עצור גלילה' : 'התחל גלילה'}
        </button>

        {isAdmin && (
          <button
            onClick={handleQuit}
            className="bg-red-600 px-6 py-2 rounded-lg shadow hover:bg-red-500"
          >
            Quit
          </button>
        )}
      </div>
    </div>
  );
}

export default LivePage;

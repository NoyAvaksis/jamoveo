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
    return () => stopScroll();
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

  const scrollToBottom = () => {
    if (!scrollRef.current) return;

    const scrollStep = () => {
      if (!scrollRef.current) return;

      if (
        scrollRef.current.scrollTop + scrollRef.current.clientHeight >=
        scrollRef.current.scrollHeight
      ) {
        clearInterval(scrollIntervalRef.current);
        setIsScrolling(false);
        return;
      }

      scrollRef.current.scrollTop += 2;
    };

    scrollIntervalRef.current = setInterval(scrollStep, 20);
    setIsScrolling(true);
  };

  const stopScroll = () => {
    clearInterval(scrollIntervalRef.current);
    setIsScrolling(false);
  };

  const toggleScroll = () => {
    isScrolling ? stopScroll() : scrollToBottom();
  };

  const handleQuit = () => {
    socket.emit('sessionEnded');
  };

  const renderSongContent = () => {
    if (!song?.data || !Array.isArray(song.data)) {
      return <p className="text-white drop-shadow-md text-center">No content to display.</p>;
    }

    const isSinger = user?.role === 'singer';

    return song.data.map((line, i) => (
      <div key={i} className="flex flex-wrap justify-center gap-x-16 text-center mb-20">
        {line.map((word, j) => (
          <div key={j} className="flex flex-col items-center min-w-[6ch]">
            {!isSinger && (
              <span className="text-purple-300 text-4xl italic mb-4 leading-none drop-shadow-lg">
                {word.chords || '\u00A0'}
              </span>
            )}
            <span className="text-white text-7xl font-extrabold leading-relaxed drop-shadow-2xl">
              {word.lyrics}
            </span>
          </div>
        ))}
      </div>
    ));
  };

  if (!song || !user) {
    return <p className="text-white p-8 text-center text-5xl">Loading song...</p>;
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-yellow-600 text-white p-4">
      <h1 className="text-6xl font-extrabold text-center mb-12 drop-shadow-lg">
        {song.title} <span className="text-4xl italic font-light">– {song.artist}</span>
      </h1>

      <div
        ref={scrollRef}
        className="h-[75vh] overflow-y-auto bg-white/10 rounded-xl p-8"
        style={{ WebkitOverflowScrolling: 'touch', overflowY: 'auto' }}
      >
        <div className="space-y-20">{renderSongContent()}</div>
      </div>

      <div className="mt-12 flex justify-center gap-10 flex-wrap">
        <button
          onClick={toggleScroll}
          className="bg-gradient-to-r from-green-500 to-green-700 text-white px-10 py-4 rounded-2xl shadow-2xl text-2xl font-semibold hover:scale-105 active:scale-95 transition"
        >
          {isScrolling ? 'Stop Scrolling' : 'Scroll to Bottom'}
        </button>

        {isAdmin && (
          <button
            onClick={handleQuit}
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-10 py-4 rounded-2xl shadow-2xl text-2xl font-semibold hover:scale-105 active:scale-95 transition"
          >
            Quit
          </button>
        )}
      </div>
    </div>
  );
}

export default LivePage;

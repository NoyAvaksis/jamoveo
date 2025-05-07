import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SERVER_URL);

function LivePage() {
  const [song, setSong] = useState(null);
  const [user, setUser] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  const scrollSpeedRef = useRef(1); // Default scroll speed
  const isMobileRef = useRef(false);

  useEffect(() => {
    // Check if the device is mobile
    isMobileRef.current = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    // Load stored data
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
    
    // Clear any existing interval
    stopAutoScroll();
    
    // Use requestAnimationFrame for smoother scrolling on mobile
    if (isMobileRef.current) {
      let lastTimestamp = null;
      const scrollSpeed = 0.5; // Slower speed for mobile (adjust as needed)
      
      const step = (timestamp) => {
        if (!isScrolling) return;
        
        if (lastTimestamp) {
          const elapsed = timestamp - lastTimestamp;
          scrollRef.current.scrollTop += (scrollSpeed * elapsed) / 16; // Normalize to roughly 60fps
        }
        
        lastTimestamp = timestamp;
        scrollIntervalRef.current = requestAnimationFrame(step);
      };
      
      setIsScrolling(true);
      scrollIntervalRef.current = requestAnimationFrame(step);
    } else {
      // Original interval-based scrolling for desktop
      scrollIntervalRef.current = setInterval(() => {
        scrollRef.current.scrollBy({ top: scrollSpeedRef.current, behavior: 'auto' });
      }, 40);
      setIsScrolling(true);
    }
  };

  const stopAutoScroll = () => {
    if (isMobileRef.current && scrollIntervalRef.current) {
      cancelAnimationFrame(scrollIntervalRef.current);
    } else {
      clearInterval(scrollIntervalRef.current);
    }
    scrollIntervalRef.current = null;
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
      <div key={i} className="mb-10 bg-white/10 rounded-xl p-4 shadow-md max-w-5xl mx-auto">
        <div className="flex flex-wrap justify-center gap-x-6 text-center">
          {line.map((word, j) => (
            <div key={j} className="flex flex-col items-center min-w-[3ch]">
              {!isSinger && (
                <span className="text-purple-200 text-xl italic mb-1 leading-none drop-shadow">
                  {word.chords || '\u00A0'}
                </span>
              )}
              <span className="text-white text-5xl font-bold leading-tight drop-shadow">
                {word.lyrics}
              </span>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  if (!song || !user) {
    return <p className="text-white p-8">Loading live session...</p>;
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-yellow-600 px-8 py-12 relative">
      <h1 className="text-6xl text-center font-extrabold text-white mb-10 animate-fade-in">
        {song.title}{' '}
        <span className="italic font-light text-4xl">– {song.artist}</span>
      </h1>

      <div
        ref={scrollRef}
        className="h-[calc(100dvh-220px)] overflow-y-auto overscroll-contain px-4 touch-auto"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: isMobileRef.current ? 'auto' : 'smooth'
        }}
      >
        {renderSongContent()}
      </div>

      <div className="absolute bottom-4 left-0 w-full px-8 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto">
          <button
            onClick={toggleScroll}
            className="bg-gray-800 hover:bg-gradient-to-r from-purple-600 to-pink-600 transform transition hover:scale-105 active:scale-95 text-white px-6 py-3 rounded-xl shadow-xl"
          >
            {isScrolling ? 'Stop Scroll' : 'Start Scroll'}
          </button>
        </div>
        {isAdmin && (
          <div className="pointer-events-auto">
            <button
              onClick={handleQuit}
              className="bg-gray-800 hover:bg-gradient-to-r from-red-600 to-pink-500 transform transition hover:scale-105 active:scale-95 text-white px-6 py-3 rounded-xl shadow-xl"
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
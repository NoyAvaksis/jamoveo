import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

// Initialize socket connection
const socket = io(import.meta.env.VITE_SERVER_URL);

function LivePage() {
  // State to store song and user data
  const [song, setSong] = useState(null);
  const [user, setUser] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);

  // Refs for scrolling
  const scrollRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  // On component mount: load song and user from localStorage
  useEffect(() => {
    const storedSong = JSON.parse(localStorage.getItem('currentSong'));
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setSong(storedSong);
    setUser(storedUser);

    return () => stopScroll(); // Cleanup scrolling on unmount
  }, []);

  // Listen for session end event from admin
  useEffect(() => {
    socket.on('sessionEnded', () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const role = storedUser?.role;
      localStorage.removeItem('currentSong');
      window.location.href = role === 'admin' ? '/admin' : '/player';
    });

    return () => socket.off('sessionEnded'); // Cleanup listener
  }, []);

  // Function to start auto-scrolling down
  const scrollToBottom = () => {
    if (!scrollRef.current) return;

    const scrollStep = () => {
      if (!scrollRef.current) return;

      const { scrollTop, clientHeight, scrollHeight } = scrollRef.current;

      if (scrollTop + clientHeight >= scrollHeight) {
        clearInterval(scrollIntervalRef.current);
        setIsScrolling(false);
        return;
      }

      scrollRef.current.scrollTop += 2; // Scroll speed
    };

    scrollIntervalRef.current = setInterval(scrollStep, 30);
    setIsScrolling(true);
  };

  // Function to stop auto-scrolling
  const stopScroll = () => {
    clearInterval(scrollIntervalRef.current);
    setIsScrolling(false);
  };

  // Toggle auto-scroll on/off
  const toggleScroll = () => {
    isScrolling ? stopScroll() : scrollToBottom();
  };

  // Emit session end to all users
  const handleQuit = () => {
    socket.emit('sessionEnded');
  };

  // Detect if current line is in Hebrew
  const isHebrew = (line) => {
    return line.some(word => /[\u0590-\u05FF]/.test(word.lyrics));
  };

  // Render the full song: lyrics (and chords if not singer)
  const renderSongContent = () => {
    if (!song?.data || !Array.isArray(song.data)) {
      return <p className="text-white drop-shadow-md text-center">No content to display.</p>;
    }

    const isSinger = user?.role === 'singer';

    return song.data.map((line, i) => (
      <div
        key={i}
        dir={isHebrew(line) ? 'rtl' : 'ltr'}
        className="flex flex-wrap justify-center gap-x-16 text-center mb-20"
      >
        {line.map((word, j) => (
          <div key={j} className="flex flex-col items-center min-w-[4ch]">
            {!isSinger && (
              <span className="text-purple-300 text-2xl italic mb-0 leading-none drop-shadow">
                {word.chords || '\u00A0'}
              </span>
            )}
            <span className="text-white text-6xl font-extrabold leading-none drop-shadow-2xl mb-6">
              {word.lyrics}
            </span>
          </div>
        ))}
      </div>
    ));
  };

  // If data is still loading
  if (!song || !user) {
    return <p className="text-white p-8 text-center text-5xl">Loading song...</p>;
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-yellow-600 text-white p-4 relative">

      {/* Greeting */}
      <h1 className="text-4xl font-light text-center mb-2 drop-shadow-md">
        Hey {user.username}, let’s make some noise! 🎸🥁🎤
      </h1>

      {/* Song Title and Artist */}
      <h2 className="text-6xl font-extrabold text-center mb-12 drop-shadow-lg">
        {song.title} <span className="text-4xl italic font-light">– {song.artist}</span>
      </h2>

      {/* Control Buttons */}
      <div className="fixed bottom-4 left-0 w-full px-6 flex justify-center gap-4 z-10">
        <button
          onClick={toggleScroll}
          className="flex-1 px-4 py-3 rounded-xl text-white text-base font-medium border border-white/30 bg-white/20 backdrop-blur-md shadow-lg hover:bg-white/30 transition"
        >
          {isScrolling ? 'Stop Scrolling' : 'Scroll to Bottom'}
        </button>

        {isAdmin && (
          <button
            onClick={handleQuit}
            className="flex-1 px-4 py-3 rounded-xl text-white text-base font-medium border border-white/30 bg-white/20 backdrop-blur-md shadow-lg hover:bg-white/30 transition"
          >
            Quit
          </button>
        )}
      </div>

      {/* Scrollable Lyrics & Chords Container */}
      <div
        ref={scrollRef}
        className="h-[75vh] overflow-y-auto bg-white/10 rounded-xl p-8"
        style={{ WebkitOverflowScrolling: 'touch', overflowY: 'auto' }}
      >
        <div className="space-y-20">{renderSongContent()}</div>
      </div>
    </div>
  );
}

export default LivePage;

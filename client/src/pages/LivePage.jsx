import React, { useRef, useState } from 'react';

function LivePage() {
  const scrollRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const song = JSON.parse(localStorage.getItem('currentSong'));
  const user = JSON.parse(localStorage.getItem('user'));
  const isSinger = user?.role === 'singer';
  const isAdmin = user?.role === 'admin';

  const scrollToBottom = () => {
    if (!scrollRef.current) return;

    const scrollStep = () => {
      if (!scrollRef.current) return;

      // בדיקה אם הגענו לסוף הגלילה
      if (scrollRef.current.scrollTop + scrollRef.current.clientHeight >= scrollRef.current.scrollHeight) {
        clearInterval(scrollIntervalRef.current);
        setIsScrolling(false);
        return;
      }

      scrollRef.current.scrollTop += 2; // שינוי קטן בכל צעד כדי להאט את הגלילה
    };

    scrollIntervalRef.current = setInterval(scrollStep, 40); // קצב הגלילה
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
    localStorage.removeItem('currentSong');
    window.location.href = isAdmin ? '/admin' : '/player';
  };

  if (!song || !user) {
    return <p className="text-white p-8 text-center">טוען שיר...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-yellow-600 text-white p-4">
      <h1 className="text-4xl font-bold text-center mb-6">
        {song.title} <span className="text-2xl italic font-light">– {song.artist}</span>
      </h1>

      <div
        ref={scrollRef}
        className="h-[70vh] overflow-y-auto bg-white/10 rounded-xl p-4"
        style={{ WebkitOverflowScrolling: 'touch', overflowY: 'auto' }}
      >
        <div className="space-y-8">
          {song.data.map((line, i) => (
            <div key={i} className="flex flex-wrap justify-center gap-x-6 text-center">
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
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={toggleScroll}
          className="bg-green-600 px-6 py-2 rounded-lg shadow hover:bg-green-500"
        >
          {isScrolling ? 'עצור גלילה' : 'גלול עד הסוף'}
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

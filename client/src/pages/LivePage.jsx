import React, { useRef, useState } from 'react';

function LivePage() {
  const scrollRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollAnimationRef = useRef(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-700 text-white p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">בדיקת גלילה אוטומטית במובייל</h1>

      <div
        ref={scrollRef}
        className="h-[70vh] overflow-y-auto bg-white/10 rounded-xl p-4"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {[...Array(100)].map((_, i) => (
          <p key={i} className="mb-4">
            שורה מספר {i + 1} — טקסט לבדיקה אם יש גלילה אוטומטית...
          </p>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={startScroll}
          className="bg-green-600 px-6 py-2 rounded-lg shadow hover:bg-green-500"
        >
          התחל גלילה
        </button>
        <button
          onClick={stopScroll}
          className="bg-red-600 px-6 py-2 rounded-lg shadow hover:bg-red-500"
        >
          עצור גלילה
        </button>
      </div>
    </div>
  );
}

export default LivePage;

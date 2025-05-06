import Logo from "../components/Logo";
import PrimaryButton from "../components/PrimaryButton";

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-700 via-pink-600 to-yellow-400 text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <Logo size="w-20 h-20 mb-0" />
        <nav className="flex space-x-4">
          <PrimaryButton to="/login" color="pink">Log In</PrimaryButton>
          <PrimaryButton to="/signup" color="purple">Sign Up</PrimaryButton>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <Logo />
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Welcome to JaMoveo</h1>
        <p className="text-xl md:text-2xl max-w-2xl mb-16 text-white/90">
          A seamless web app that lets every musician join the groove.
          <br />
          Register, choose your instrument, and get ready to play live with others —
          anywhere, anytime.
        </p>

        {/* Why JaMoveo */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          <div className="bg-white/10 p-6 rounded-xl shadow-md backdrop-blur-sm">
            <h3 className="text-2xl font-semibold mb-2">🎵 Play Live with Friends</h3>
            <p>Join jam sessions from anywhere and feel the real-time rhythm.</p>
          </div>
          <div className="bg-white/10 p-6 rounded-xl shadow-md backdrop-blur-sm">
            <h3 className="text-2xl font-semibold mb-2">🧑‍🤝‍🧑 Collaborate in Real-Time</h3>
            <p>Connect with fellow musicians instantly and create music together.</p>
          </div>
          <div className="bg-white/10 p-6 rounded-xl shadow-md backdrop-blur-sm">
            <h3 className="text-2xl font-semibold mb-2">📱 Use It Anywhere</h3>
            <p>Optimized for mobile and desktop — jam wherever you are.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 mt-auto text-sm bg-black/30">
        Created by Noy Abecassis © 2025 • <a href="https://github.com/NoyAvaksis" className="underline">GitHub</a>
      </footer>
    </div>
  );
}

export default HomePage;

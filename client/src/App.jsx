// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AdminMainPage from './pages/AdminMainPage';
import PlayerMainPage from './pages/PlayerMainPage';
import AdminResultsPage from './pages/AdminResultsPage';
import LivePage from './pages/LivePage';
import HomePage from './pages/HomePage';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/signup" element={<Signup isAdmin={true} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminMainPage />} />
        <Route path="/player" element={<PlayerMainPage />} />
        <Route path="/admin/results" element={<AdminResultsPage />} />
        <Route path="/live" element={<LivePage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

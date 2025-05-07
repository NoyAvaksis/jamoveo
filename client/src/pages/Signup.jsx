import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import PrimaryButton from '../components/PrimaryButton';
import axios from 'axios';

const baseURL = import.meta.env.VITE_SERVER_URL;

function Signup({ isAdmin }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    instrument: '',
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (password) => {
    const isLengthValid = password.length >= 8 && password.length <= 16;
    const hasUppercase = /[A-Z]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    return isLengthValid && hasUppercase && hasSymbol;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'password') {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value)
          ? ''
          : 'Password must be 8–16 characters, include one uppercase letter and one symbol.',
      }));
    }

    if (name === 'confirmPassword') {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: value === formData.password ? '' : 'Passwords do not match.',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(formData.password)) return;
    if (formData.password !== formData.confirmPassword) return;

    try {
      const role = isAdmin
        ? 'admin'
        : formData.instrument === 'vocals'
        ? 'singer'
        : 'player';

      const payload = {
        username: formData.username,
        password: formData.password,
        role,
      };

      if (!isAdmin) {
        payload.instrument = formData.instrument;
      }

      const url = isAdmin
        ? `${baseURL}/api/admin/signup`
        : `${baseURL}/api/signup`;

      await axios.post(url, payload);
      navigate('/login');
    } catch (err) {
      console.error('Signup failed:', err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-700 via-pink-600 to-yellow-400 text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 md:p-6 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <Link to="/">
          <Logo className="h-16 md:h-20 lg:h-24" />
        </Link>
        <nav className="flex space-x-4">
          <PrimaryButton to="/login" color="purple">Log In</PrimaryButton>
        </nav>
      </header>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md p-8 bg-white/20 backdrop-blur-md rounded-xl shadow-2xl">
          <h1 className="text-3xl font-bold text-center text-white mb-6">Sign Up</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-white font-medium mb-1">Username</label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your username"
                className="w-full px-4 py-2 rounded-md border border-white/30 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 rounded-md border border-white/30 bg-white/10 text-white pr-10 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2.5 text-white/70 hover:text-white"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.27-2.943-9.542-7a10.04 10.04 0 012.442-3.847M21 21L3 3" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-pink-200 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-white font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                className="w-full px-4 py-2 rounded-md border border-white/30 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white"
              />
              {errors.confirmPassword && (
                <p className="text-pink-200 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Instrument Select */}
            {!isAdmin && (
              <div>
                <label className="block text-white font-medium mb-1">Instrument</label>
                <select
                  name="instrument"
                  value={formData.instrument}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-md border border-white/30 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <option value="" className="text-black">Select an instrument</option>
                  <option value="guitar" className="text-black">Guitar</option>
                  <option value="bass" className="text-black">Bass</option>
                  <option value="drums" className="text-black">Drums</option>
                  <option value="keyboard" className="text-black">Keyboard</option>
                  <option value="saxophone" className="text-black">Saxophone</option>
                  <option value="vocals" className="text-black">Vocals</option>
                </select>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg font-medium transition-colors"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-white/80">
            Already have an account?{' '}
            <Link to="/login" className="text-pink-300 hover:underline">Log in</Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-sm bg-black/30">
        Created by Noy Abecassis © 2025 • <a href="https://github.com/NoyAvaksis" className="underline">GitHub</a>
      </footer>
    </div>
  );
}

export default Signup;
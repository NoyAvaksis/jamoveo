// React imports
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// Component imports
import Logo from '../components/Logo';
import PrimaryButton from '../components/PrimaryButton';

// Base URL from environment variable
const baseURL = import.meta.env.VITE_SERVER_URL;

function Login() {
  const navigate = useNavigate();

  // Form state for username and password
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // Error states for form validation and server errors
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Handle changes to form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear previous errors
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
    setServerError('');
  };

  // Validate input before submission
  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  // Handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await axios.post(`${baseURL}/api/login`, formData);
      const user = res.data.user;

      // Save user to localStorage and redirect based on role
      localStorage.setItem('user', JSON.stringify(user));
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/player');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setServerError(err.response?.data?.error || 'Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-700 via-pink-600 to-yellow-400 text-white">
      {/* Header with logo and navigation */}
      <header className="flex justify-between items-center p-4 md:p-6 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <Link to="/">
          <Logo className="h-16 md:h-20 lg:h-24" />
        </Link>
        <nav className="flex space-x-4">
          <PrimaryButton to="/signup" color="purple">Sign Up</PrimaryButton>
        </nav>
      </header>

      {/* Login form container */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-6">
        <div className="w-full max-w-md p-6 md:p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Log In</h2>

          {/* Display server error if exists */}
          {serverError && (
            <div className="bg-red-500/30 border border-red-500 text-white p-3 rounded-lg mb-4">
              {serverError}
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit}>
            {/* Username input field */}
            <div className="mb-4">
              <label className="block text-white font-medium mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-white/10 border ${
                  errors.username ? 'border-red-500' : 'border-white/30'
                } rounded-lg focus:outline-none focus:border-white text-white placeholder-white`}
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="text-red-400 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Password input field with toggle visibility */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-white/10 border ${
                    errors.password ? 'border-red-500' : 'border-white/30'
                  } rounded-lg focus:outline-none focus:border-white text-white placeholder-white`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2.5 text-white/70 hover:text-white"
                >
                  {showPassword ? (
                    // Eye with slash icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.27-2.943-9.542-7a10.04 10.04 0 012.442-3.847M21 21L3 3" />
                    </svg>
                  ) : (
                    // Normal eye icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg font-medium transition-colors"
            >
              Log In
            </button>
          </form>

          {/* Link to signup page */}
          <p className="text-center mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-pink-300 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Footer section */}
      <footer className="text-center py-6 text-sm bg-black/30">
        Created by Noy Abecassis © 2025 • <a href="https://github.com/NoyAvaksis/jamoveo" className="underline">GitHub</a>
      </footer>
    </div>
  );
}

export default Login;

import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import PrimaryButton from '../components/PrimaryButton';

const baseURL = import.meta.env.VITE_SERVER_URL;

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
    setServerError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

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
      {/* Header */}
      <header className="flex justify-between items-center p-4 md:p-6 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <Link to="/">
          <Logo className="h-16 md:h-20 lg:h-24" />
        </Link>
        <nav className="flex space-x-4">
          <PrimaryButton to="/signup" color="purple">Sign Up</PrimaryButton>
        </nav>
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-6">
        <div className="w-full max-w-md p-6 md:p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Log In</h2>
          
          {serverError && (
            <div className="bg-red-500/30 border border-red-500 text-white p-3 rounded-lg mb-4">
              {serverError}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="mb-4">
              <label className="block text-white mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-white/10 border ${
                  errors.username ? 'border-red-500' : 'border-white/30'
                } rounded-lg focus:outline-none focus:border-white text-white`}
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="text-red-400 text-sm mt-1">{errors.username}</p>
              )}
            </div>
            
            {/* Password Field */}
            <div className="mb-6">
              <label className="block text-white mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-white/10 border ${
                    errors.password ? 'border-red-500' : 'border-white/30'
                  } rounded-lg focus:outline-none focus:border-white text-white`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2 text-white/70 hover:text-white"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            
            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg font-medium transition-colors"
            >
              Log In
            </button>
          </form>
          
          {/* Sign Up Redirect */}
          <p className="text-center mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-pink-300 hover:underline">
              Sign up
            </Link>
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

export default Login;
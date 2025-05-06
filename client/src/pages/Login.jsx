import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoginHeader from '../components/login/LoginHeader';
import UsernameField from '../components/login/UsernameField';
import PasswordField from '../components/login/PasswordField';
import ServerErrorMessage from '../components/login/ServerErrorMessage';
import SignupRedirect from '../components/login/SignupRedirect';

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
    <div className="min-h-screen flex flex-col justify-start items-center bg-gradient-to-br from-purple-700 via-pink-600 to-yellow-400 px-4 py-10">
      <LoginHeader />

      <h1 className="text-3xl font-bold text-white mb-8">Log In</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-2xl">
        <UsernameField
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
        />

        <PasswordField
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          show={showPassword}
          toggleShow={() => setShowPassword((prev) => !prev)}
        />

        <button
          type="submit"
          className="w-full py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition"
        >
          Log In
        </button>

        <ServerErrorMessage message={serverError} />

        <SignupRedirect />
      </form>
    </div>
  );
}

export default Login;
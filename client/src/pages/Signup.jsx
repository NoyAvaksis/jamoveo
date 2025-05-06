import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SignupHeader from '../components/signup/SignupHeader';
import UsernameField from '../components/signup/UsernameField';
import PasswordField from '../components/signup/PasswordField';
import ConfirmPasswordField from '../components/signup/ConfirmPasswordField';
import InstrumentSelect from '../components/signup/InstrumentSelect';
import SignupButton from '../components/signup/SignupButton';
import LoginRedirect from '../components/signup/LoginRedirect';

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
          : 'Password must be 8-16 characters, include one uppercase letter and one symbol.',
      }));
    }

    if (name === 'confirmPassword') {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          value === formData.password ? '' : 'Passwords do not match.',
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

      const baseURL = import.meta.env.VITE_SERVER_URL;
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
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-purple-700 via-pink-600 to-yellow-400 px-4 py-10">
      <SignupHeader />

      <div className="bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Signup</h1>
        <form onSubmit={handleSubmit} className="space-y-5">

          <UsernameField
            value={formData.username}
            onChange={handleChange}
          />

          <PasswordField
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            isValid={validatePassword(formData.password)}
            show={showPassword}
            toggleShow={() => setShowPassword(!showPassword)}
          />

          <ConfirmPasswordField
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />

          {!isAdmin && (
            <InstrumentSelect
              value={formData.instrument}
              onChange={handleChange}
            />
          )}

          <SignupButton />
        </form>

        <LoginRedirect />
      </div>
    </div>
  );
}

export default Signup;

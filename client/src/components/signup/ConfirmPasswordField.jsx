import React from 'react';

function ConfirmPasswordField({ value, onChange, error }) {
  return (
    <div>
      <label className="block text-white font-medium mb-1">Confirm Password</label>
      <input
        type="password"
        name="confirmPassword"
        value={value}
        onChange={onChange}
        required
        className="w-full px-4 py-2 rounded-md border border-purple-400 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-black"
      />
      {error && <p className="text-sm text-red-200 mt-1">❌ {error}</p>}
      {!error && value && <p className="text-sm text-green-200 mt-1">✅ Passwords match</p>}
    </div>
  );
}

export default ConfirmPasswordField;

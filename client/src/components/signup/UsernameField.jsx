import React from 'react';

function UsernameField({ value, onChange }) {
  return (
    <div>
      <label className="block text-white font-medium mb-1">Username</label>
      <input
        name="username"
        value={value}
        onChange={onChange}
        required
        className="w-full px-4 py-2 rounded-md border border-purple-400 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-black"
      />
    </div>
  );
}

export default UsernameField;

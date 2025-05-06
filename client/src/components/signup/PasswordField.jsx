import React from 'react';

function PasswordField({ value, onChange, error, isValid, show, toggleShow }) {
  return (
    <div className="relative group">
      <label className="block text-white font-medium mb-1 flex items-center gap-2">
        Password
        <div className="relative group">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-4 h-4 cursor-pointer">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M12 6a9 9 0 100 18 9 9 0 000-18zm.75 4.5h-1.5v6h1.5v-6z" />
          </svg>
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 text-xs bg-black text-white p-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
            Must be 8–16 characters, with one uppercase letter and one symbol.
          </span>
        </div>
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          name="password"
          value={value}
          onChange={onChange}
          required
          className="w-full px-4 py-2 pr-10 rounded-md border border-purple-400 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-black"
        />
        <span className="absolute inset-y-0 right-3 flex items-center cursor-pointer" onClick={toggleShow}>
          {show ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-purple-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-.71.074-1.402.213-2.075M4.667 4.667L19.333 19.333" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-purple-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </span>
      </div>
      {error && <p className="text-sm text-red-200 mt-1">❌ {error}</p>}
      {!error && value && isValid && <p className="text-sm text-green-200 mt-1">✅ Password is valid</p>}
    </div>
  );
}

export default PasswordField;

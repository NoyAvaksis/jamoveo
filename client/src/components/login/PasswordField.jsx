function PasswordField({ value, onChange, error, show, toggleShow }) {
    return (
      <div className="mb-4">
        <label className="block text-white font-medium mb-1">Password</label>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            name="password"
            value={value}
            onChange={onChange}
            className={`w-full px-4 py-2 pr-10 rounded-md border ${error ? 'border-red-400' : 'border-purple-400'} focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-black`}
          />
          <span
            onClick={toggleShow}
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-purple-600 text-lg"
          >
            {show ? '🙈' : '👁️'}
          </span>
        </div>
        {error && <p className="text-sm text-red-200 mt-1">{error}</p>}
      </div>
    );
  }
  
  export default PasswordField;
  
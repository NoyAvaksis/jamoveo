function UsernameField({ value, onChange, error }) {
    return (
      <div className="mb-4">
        <label className="block text-white font-medium mb-1">Username</label>
        <input
          type="text"
          name="username"
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-2 rounded-md border ${error ? 'border-red-400' : 'border-purple-400'} focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-black`}
        />
        {error && <p className="text-sm text-red-200 mt-1">{error}</p>}
      </div>
    );
  }
  
  export default UsernameField;
  
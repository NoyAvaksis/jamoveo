import React from 'react';

function InstrumentSelect({ value, onChange }) {
  return (
    <div>
      <label className="block text-white font-medium mb-1">Instrument</label>
      <select
        name="instrument"
        value={value}
        onChange={onChange}
        required
        className="w-full px-4 py-2 rounded-md border border-purple-400 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-black"
      >
        <option value="">Select an instrument</option>
        <option value="guitar">Guitar</option>
        <option value="piano">Piano</option>
        <option value="drums">Drums</option>
        <option value="violin">Violin</option>
        <option value="vocals">Vocals</option>
      </select>
    </div>
  );
}

export default InstrumentSelect;

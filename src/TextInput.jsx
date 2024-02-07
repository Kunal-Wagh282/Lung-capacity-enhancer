import React from 'react';

function TextInput({ label, value, onChange, id }) {
  return (
    <div>
      <label htmlFor={id}>{label}:</label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
}

export default TextInput;

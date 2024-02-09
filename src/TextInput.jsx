import React from 'react';

function TextInput({ label, value, onChange, id,type }) {
  return (
    <div>
      <label htmlFor={id}>{label}:</label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
}

export default TextInput;

import React from 'react';

function DateInput({ label, value, onChange, id }) {
  return (
    <div>
      <label htmlFor={id}>{label}:</label>
      <input
        type="date"
        id={id}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
}

export default DateInput;

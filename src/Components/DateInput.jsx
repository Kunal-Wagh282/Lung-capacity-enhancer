import React from 'react';



function DateInput({ label, value, onChange, id }) {
  // Format the date value as 'YYYY-MM-DD' for the input element
  const formattedDate = value ? new Date(value).toISOString().split('T')[0] : '';

  return (
    <div>
      <label htmlFor={id}>{label}:</label>
      <input
        type="date"
        id={id}
        value={formattedDate}
        onChange={onChange}
        required
        placeholder="Date of Birth"
       
      />
    </div>
  );
}

export default DateInput;

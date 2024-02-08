import React from 'react';

function SubmitButton({ loading, text }) {
  return (
    <button type="submit" disabled={loading}>
      {loading ? 'Registering...' : text}
    </button>
  );
}

export default SubmitButton;

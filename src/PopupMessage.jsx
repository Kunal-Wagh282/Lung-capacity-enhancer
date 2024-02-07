import React from 'react';
 // Import CSS for styling

function PopupMessage({ message }) {
  return (
    <div className="popup-container">
      <div className="popup-content">
        <p>{message}</p>
      </div>
    </div>
  );
}

export default PopupMessage;

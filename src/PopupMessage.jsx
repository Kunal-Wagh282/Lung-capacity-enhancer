import React, { useState, useEffect } from 'react';
import './PopupMessage.css'; // Import CSS for styling

function PopupMessage({ message }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isVisible && (
        <div className="popup-dialog">
          <div className="popup-content">
            <p>{message}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default PopupMessage;

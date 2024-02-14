import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PopupMessage from './PopupMessage'; // Import the PopupMessage component
import './RegistrationForm.css'; // Import the CSS file
import { Link, useNavigate } from 'react-router-dom';
import API_URL from './config'; // Import the API URL

function Try2() {
  const [error, setError] = useState('');
  //const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${API_URL}/test/`, {
        array:[1,2,3,4,5,6,7,8,9]
      } 
    );
      console.log(response.data);
    
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="registration-form-container">
<button onClick={handleSubmit} >
                send
            </button> 
    </div>
  );
}

export default Try2;

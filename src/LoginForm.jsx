import React, { useState } from 'react';
import axios from 'axios';
import TextInput from './TextInput';
import DateInput from './DateInput';
import SubmitButton from './SubmitButton';
import './LoginForm.css' // Import the CSS file
import { useNavigate } from 'react-router-dom';



function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    

    
    try {
      const response = await axios.post('http://192.168.29.51:8000/api/login/', {
        username: username,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const profiles = response.data;
      if (response.status === 200) {
        navigate('/profiles',{ state: { profiles } }); // Redirect to the profiles page after successful login
      }
       // assuming the server sends back some response
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="registration-form-container"> {/* Apply the CSS class */}
      <h2>Login Form</h2>
      {error && <p className="error-message">{error}</p>} {/* Apply the CSS class */}
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          id="username"
        />
        <TextInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
        />
        
        <SubmitButton loading={loading} text="Login" />
      </form>
    </div>
  );
}

export default LoginForm;
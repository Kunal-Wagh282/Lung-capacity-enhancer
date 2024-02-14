import React, { useState } from 'react';
import axios from 'axios';
import TextInput from './Components/TextInput';
import SubmitButton from './Components/SubmitButton';
import './LoginForm.css' // Import the CSS file
import { useNavigate ,Link } from 'react-router-dom';
import API_URL from './config'; // Import the API URL



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
      const response = await axios.post(`${API_URL}/login/`, {
        username: username,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const userData = response.data;
      console.log(response.data);
      
      console.log(error);
      if (response.status === 200 || response.status === 204) {
        navigate('/profiles', { state: { uid: userData.u_id, profiles: userData.profile,username: username,password: password } }); // Redirect to the profiles page after successful login
      }
       // assuming the server sends back some response
    } catch (error) {
      setError('Invalid Username or Password...Try Again');
      setUsername('');
      setPassword('');
    }

    setLoading(false);
  };

  return (
    <div className="login-form-container"> {/* Apply the CSS class */}
      <h2>Login Form</h2>
      {error && <p className="error-message">{error}</p>} {/* Apply the CSS class */}
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          id="username"
        />
        <TextInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
        />
        
        <SubmitButton loading={loading} text="Login" />
      </form>
      <p>Don't have an account? <Link to="/">Register</Link></p>
    </div>
  );
}

export default LoginForm;
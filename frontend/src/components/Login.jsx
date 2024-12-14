import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css'; // Importing the CSS file

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to hold error message
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error messages

    try {
      const response = await axios.post('http://localhost:3002/api/users/login', {
        userId: userId,
        password: password,
      });

      // Check the response structure
      console.log(response);

      // Check if the response contains token and user name
      if (response && response.data && response.data.token) {
        console.log('Login successful:', response.data);
        
        // Save token and name (can also use localStorage or sessionStorage)
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userName', response.data.name);

        // Redirect to /company
        navigate('/company');
      } else {
        console.error('No data found in the response.');
        setError('Invalid login credentials. Please try again.'); // Set error message
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred during login. Please try again later.'); // Set error message
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="login-title">Login</h2>
        
        {/* Display error message if exists */}
        {error && <div className="error-message">{error}</div>}

        <input
          type="text"
          className="input-field"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <input
          type="password"
          className="input-field"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="submit-btn">Login</button>
      </form>
    </div>
  );
};

export default Login;

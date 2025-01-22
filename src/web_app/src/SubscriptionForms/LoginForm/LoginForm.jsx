import React, { useState, useEffect } from 'react';
import './LoginForm.css';
import createField from '../fieldItem';

function LoginForm() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);  // To store user_id returned from server

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password })
      });

      if (response.ok) {
        const data = await response.json(); // Parse the response JSON
        setUserId(data.userId);  // Set the userId from the response data
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Error while sending data to server');
      console.error(err);
    }
  };

  // useEffect to show the userId alert after it is set
  useEffect(() => {
    if (userId) {
      alert(`User ID: ${userId}`);  // Alert userId when it's set
    }
  }, [userId]);  // Dependency array ensures this effect runs only when userId changes

  return (
    <div className="login-container">
      <div className="login-form">
        <h3 className="text-center">Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          {createField('Name', 'text', 'name', 'Enter your name', name, (e) => setName(e.target.value))}
          
          {/* Password Field */}
          {createField("Password", "password", "password", "Enter your password", password, (e) => setPassword(e.target.value))}

          {/* Submit Button */}
          <div className="d-grid">
            <button type="submit" className="btn btn-danger">Sign In</button>
          </div>
        </form>

        <p className="text-center mt-3">
          New to Netflix? <a href="/signup">Sign up now</a>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;

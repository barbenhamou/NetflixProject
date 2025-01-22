import React, { useState } from 'react';
import './LoginForm.css';
import createField from '../fieldItem';

function LoginForm() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = fetch('http://localhost:3001/api/token', {
        'method': 'POST',
        'headers': {
          'Content-Type': 'application/json',
        },
        'body': JSON.stringify({ name, password })
      });

      console.log(response);

    } catch (err) {
      setError('Error while sending data to server');
      console.error(err);
    }
  };  

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

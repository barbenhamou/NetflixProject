import React, { useState } from 'react';
import './LoginForm.css';
import createField from '../fieldItem';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Normally, you'd handle the login here (API call, etc.)
    alert('Login successful');
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h3 className="text-center">Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          {createField("Email address", "email", "email", "Enter your email", email, (e) => setEmail(e.target.value))}
          
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

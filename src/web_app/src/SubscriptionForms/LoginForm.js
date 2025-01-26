import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Form.css';
import StandAloneField from './fieldItem';
import jwt_decode from 'jwt-decode';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);  // To store user_id returned from server
  const [isAdmin, setIsAdmin] = useState(false);
  const handleInput = (setter) => (e) => {
    setError('');
    setter(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();

        const decodedToken = jwt_decode(data.token);

        setUserId(decodedToken.userId);
        setIsAdmin(decodedToken.isAdmin);
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Error while sending data to server');
      console.error(err);
    }
  };

  useEffect(() => {
    if (userId) {
      alert(`User ID: ${userId}`);
    }
  }, [userId]);

  return (
    <div className='form-container center'>
      <Link to="/">
        <i className="bi bi-arrow-left"></i>
      </Link>
      <div className='form'>
        <h3>Login</h3>
        <form className="row g-3" onSubmit={handleSubmit}>
          <StandAloneField label={'Username'} type={'text'} id={'username'} placeholder={'Enter your username'} value={username} onChange={handleInput(setUsername)} />
          <StandAloneField label={'Password'} type={'password'} id={'password'} placeholder={'Create a password'} value={password} onChange={handleInput(setPassword)} />
          <div className="col-12">
            <button type="submit" className="btn btn-primary btn-danger">Sign in</button>
          </div>
          <div className="col-12">
            <p>New to Netflix? <a cs href='/signup'>Sign Up</a></p>
          </div>
        </form>
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    </div>
  );
}

export default LoginForm;

import React, { useState, useEffect } from 'react';
import './Form.css';
import StandAloneField from './fieldItem';

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
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ name, password })
      });

      if (response.ok) {
        const data = await response.json();
        setUserId(data.userId);
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
    <div className='form-container'>
      <div className='form'>
        <form className="row g-3" onSubmit={handleSubmit}>
          <StandAloneField label={'Username'} type={'text'} id={ 'name'} placeholder={'Enter your name'} value={name} onChange={(e) => setName(e.target.value)} />
          <StandAloneField label={'Password'} type={'password'} id={'password'} placeholder={'Create a password'} value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="col-12">
            <button type="submit" className="btn btn-primary btn-danger">Sign in</button>
          </div>
        </form>
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    </div>
  );
}

export default LoginForm;

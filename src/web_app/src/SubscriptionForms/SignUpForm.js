import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StandAloneField, SideBySideField } from './fieldItem';
import './Form.css';

function SignUpForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [picture, setPicture] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleInput = (setter) => (e) => {
    setError('');
    setter(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!username || !email || !password || !confirmPassword || !phone || !location) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Create the form data
    const userData = {
      username,
      email,
      password,
      phone,
      picture,
      location
    };

    try {
      // Send data to the WebServer (POST request)
      const response = await fetch('http://localhost:3001/api/users', {
        'method': 'POST',
        'headers': {
          'Content-Type': 'application/json',
        },
        'body': JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Assuming the server returns a JSON error message
        setError('Error: ' + errorData.error);
      } else {
        alert('Account created successfully');
        navigate("/login");
      }
    } catch (err) {
      setError('Error while sending data to server');
      console.error(err);
    }
  };

  return (
    <div className="form-container center">
      <Link to="/">
        <i className="bi bi-arrow-left"></i>
      </Link>
      <div className="form">
        <h3>Create an Account</h3>
        <form onSubmit={handleSubmit}>
          {/* Using the createField function for dynamic field generation */}
          <StandAloneField label={'Username'} type={'text'} id={'username'} placeholder={'Enter your username'} value={username} onChange={handleInput(setUsername)} />
          <div className='row'>
            <SideBySideField label={'Password'} type={'password'} id={'password'} placeholder={'Create a password'} value={password} onChange={handleInput(setPassword)} />
            <SideBySideField label={'Confirm Password'} type={'password'} id={'confirmPassword'} placeholder={'Confirm your password'} value={confirmPassword} onChange={handleInput(setConfirmPassword)} />
          </div>
          <StandAloneField label={'Email Address'} type={'email'} id={'email'} placeholder={'Enter your email'} value={email} onChange={handleInput(setEmail)} />
          <StandAloneField label={'Phone (no dashes)'} type={'text'} id={'phone'} placeholder={'Enter your phone number'} value={phone} onChange={handleInput(setPhone)} />
          <StandAloneField label={'Location'} type={'text'} id={'location'} placeholder={'Enter your location'} value={location} onChange={handleInput(setLocation)} />
          <StandAloneField label={'Picture'} type={'text'} id={'pic'} placeholder={'Choose a profile picture'} value={picture} onChange={handleInput(setPicture)} />
          <div className="col-12">
            <button type="submit" className="btn btn-primary btn-danger">Sign up</button>
          </div>
        </form>
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    </div>
  );
}

export default SignUpForm;

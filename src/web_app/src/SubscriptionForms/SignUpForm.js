import React, { useState } from 'react';
import { StandAloneField, SideBySideField } from './fieldItem';
import './Form.css';

function SignUpForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [picture, setPicture] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name || !email || !password || !confirmPassword || !phone || !location) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Create the form data
    const userData = {
      name,
      email,
      password,
      phone,
      picture,
      location
    };

    try {
      // Send data to the backend (POST request)
      const response = await fetch('http://localhost:3001/api/users', {
        'method': 'POST',
        'headers': {
          'Content-Type': 'application/json',
        },
        'body': JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Assuming the server returns a JSON error message
        console.error('Error response:', errorData);
        setError('Error: ' + errorData.message || 'Unknown error');
      } else {
        alert('Account created successfully');
      }
    } catch (err) {
      setError('Error while sending data to server');
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="form">
        <h3 className="text-center">Create an Account</h3>
        <form onSubmit={handleSubmit}>
          {/* Using the createField function for dynamic field generation */}
          <StandAloneField label={'Username'} type={'text'} id={'name'} placeholder={'Enter your name'} value={name} onChange={(e) => setName(e.target.value)} />
          <SideBySideField label={'Password'} type={'password'} id={'password'} placeholder={'Create a password'} value={password} onChange={(e) => setPassword(e.target.value)} />
          <SideBySideField label={'Confirm Password'} type={'password'} id={'confirmPassword'} placeholder={'Confirm your password'} value={email} onChange={(e) => setConfirmPassword(e.target.value)} />
          <StandAloneField label={'Email Address'} type={'email'} id={'email'} placeholder={'Enter your email'} value={email} onChange={(e) => setEmail(e.target.value)} />
          <StandAloneField label={'Phone (no dashes)'} type={'text'} id={'phone'} placeholder={'Enter your phone number'} value={phone} onChange={(e) => setPhone(e.target.value)} />
          <StandAloneField label={'Location'} type={'text'} id={'location'} placeholder={'Enter your location'} value={location} onChange={(e) => setLocation(e.target.value)} />
          <StandAloneField label={'Picture'} type={'text'} id={'pic'} placeholder={'Choose a profile picture'} value={picture} onChange={(e) => setPicture(e.target.value)} />
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

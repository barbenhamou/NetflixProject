import React, { useState } from 'react';
import createField from '../fieldItem'; // Import the helper function to create fields
import './SignUpForm.css'; // Custom CSS for styling

function SignUpForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [picture, setPicture] = useState(''); // Optional field for picture
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
    <div className="sign-up-container">
      <div className="sign-up-form">
        <h3 className="text-center">Create an Account</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          {/* Using the createField function for dynamic field generation */}
          {createField('Name', 'text', 'name', 'Enter your name', name, (e) => setName(e.target.value))}
          {createField('Email Address', 'email', 'email', 'Enter your email', email, (e) => setEmail(e.target.value))}
          {createField('Password', 'password', 'password', 'Create a password', password, (e) => setPassword(e.target.value))}
          {createField('Confirm Password', 'password', 'confirmPassword', 'Confirm your password', confirmPassword, (e) => setConfirmPassword(e.target.value))}
          {createField('Phone (no dashes)', 'text', 'phone', 'Enter your phone number', phone, (e) => setPhone(e.target.value))}
          {createField('Location', 'text', 'location', 'Enter your location', location, (e) => setLocation(e.target.value))}
          
          {/* Optional Picture Field */}
          <div className="mb-4">
            <label htmlFor="picture" className="block text-gray-700">Profile Picture (Optional)</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="picture"
              placeholder="Enter picture URL (optional)"
              value={picture}
              onChange={(e) => setPicture(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="d-grid">
            <button type="submit" className="btn btn-danger">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpForm;

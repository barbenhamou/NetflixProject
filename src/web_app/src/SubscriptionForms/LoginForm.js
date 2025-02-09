import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Form.css';
import StandAloneField from './fieldItem';
import { backendPort } from '../config';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleInput = (setter) => (e) => {
        setError('');
        setter(e.target.value);
    }

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const response = await fetch(`http://localhost:${backendPort}/api/tokens`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();

                localStorage.setItem('authToken', data.tokenId.token);
                localStorage.setItem('userId', data.tokenId.userId);
                localStorage.setItem('isAdmin', data.tokenId.isAdmin);

                navigate("/");
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('Error while sending data to server');
            console.error(err);
        }
    };

    return (
        <div className='form-container center'>
            <Link to="/">
                <i className="bi bi-arrow-left"></i>
            </Link>
            <div className='form'>
                <h3>Login</h3>
                <form className="row g-3" onSubmit={handleSubmit}>
                    <StandAloneField label={'Username'} type={'text'} id={'username'} placeholder={'Enter your username'} value={username} onChange={handleInput(setUsername)} />
                    <StandAloneField label={'Password'} type={'password'} id={'password'} placeholder={'Enter your password'} value={password} onChange={handleInput(setPassword)} />
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary btn-danger">Sign in</button>
                    </div>
                    <div className="col-12">
                        <p>New to Nexflit? <Link to='/signup'>Sign Up</Link></p>
                    </div>
                </form>
                {error && <div className="alert alert-danger">{error}</div>}
            </div>
        </div>
    );
}

export default LoginForm;

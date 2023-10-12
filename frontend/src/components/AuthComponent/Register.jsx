import React, { useState } from 'react';
import axios from 'axios';
import  { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
    const navigate = useNavigate();

    const [rusername, setRusername] = useState('');
    const [rpassword, setRpassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:5001/register', { rusername, rpassword });
            setMessage('Registration successful.');
            navigate("/");
        } catch (error) {
            setMessage('An error occurred during registration.');
        }
    };

  return (
    <div className='register-container'>
        <h2 className='register-title'>Register</h2>
        <input className='register-input' type="text" placeholder="Username" value={rusername} onChange={e => setRusername(e.target.value)} />
        <input className='register-input' type="password" placeholder="Password" value={rpassword} onChange={e => setRpassword(e.target.value)} />
        <button className='register-button' onClick={handleRegister}>Register</button>

        <p className='register-message'>{message}</p>
        <p>Already have an account? <a href="/" className='login-link'>Login here</a></p>
    </div>
  );
};

export default RegisterPage;

'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';

export default function Register({ setCurrentView }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (event) => {
        event.preventDefault();

        if (!email || !password || !phone || !dob) {
            setError('All fields are required.');
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, phone, dob }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Registration successful! Redirecting to login...');
                setTimeout(() => setCurrentView('login'), 2000);
            } else {
                setError(data.message || 'Registration failed.');
            }
        } catch (err) {
            console.error('Registration Error:', err);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 400, margin: 'auto', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>Register</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                margin="normal"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <TextField
                label="Date of Birth"
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
                margin="normal"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleRegister}
            >
                Register
            </Button>
            <Typography variant="body2" sx={{ mt: 2 }}>
                Already registered?{' '}
                <Button color="secondary" onClick={() => setCurrentView('login')}>
                    Login
                </Button>
            </Typography>
        </Box>
    );
}

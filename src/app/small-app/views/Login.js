'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';

export default function Login({ setCurrentView, setUser }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();

        if (!username || !password) {
            setError('All fields are required.');
            return;
        }
        
        if (username.length > 50 || password.length > 50) {
            setError('Input too long.');
            return;
        }
        

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, pass: password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Save token in localStorage
                localStorage.setItem('token', data.token);
                setUser({ ...data.user, role: data.user.acc_type }); // Store user info
                setCurrentView('dashboard'); // Navigate to dashboard
            } else {
                setError(data.message || 'Login failed.');
            }
        } catch (err) {
            console.error('Login Error:', err);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 400, margin: 'auto', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>Login</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleLogin}
            >
                Login
            </Button>
            <Typography variant="body2" sx={{ mt: 2 }}>
                New here?{' '}
                <Button color="secondary" onClick={() => setCurrentView('register')}>
                    Register
                </Button>
            </Typography>
        </Box>
    );
}

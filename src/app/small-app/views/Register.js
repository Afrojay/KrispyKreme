'use client';

import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Box, Grid } from '@mui/material';

export default function Register({ setCurrentView }) {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, phone, dob, password }), // Ensure 'password' is used consistently
            });

            const result = await res.json();

            if (result.status === 'success') {
                setSuccess('Registration successful! Redirecting to dashboard...');
                setTimeout(() => {
                    setCurrentView('dashboard');
                }, 2000);
            } else {
                setError(result.message || 'Registration failed');
            }
        } catch (err) {
            console.error('Register Error:', err);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
            <Grid item xs={10} sm={8} md={4}>
                <Paper sx={{ p: 4 }} elevation={3}>
                    <Typography variant="h4" gutterBottom align="center">
                        Register
                    </Typography>
                    {error && (
                        <Typography variant="body2" color="error" gutterBottom align="center">
                            {error}
                        </Typography>
                    )}
                    {success && (
                        <Typography variant="body2" color="success" gutterBottom align="center">
                            {success}
                        </Typography>
                    )}
                    <Box
                        component="form"
                        onSubmit={handleRegister}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            mt: 2,
                        }}
                    >
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            label="Phone"
                            variant="outlined"
                            fullWidth
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <TextField
                            label="Date of Birth"
                            type="date"
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextField
                            label="Confirm Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button type="submit" variant="contained" fullWidth>
                            Register
                        </Button>
                    </Box>
                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        <Button
                            variant="text"
                            color="primary"
                            onClick={() => setCurrentView('login')}
                            sx={{ textTransform: 'none', p: 0, m: 0 }}
                        >
                            Back to Login
                        </Button>
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
}

'use client';

import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Box, Grid } from '@mui/material';

export default function Login({ setUser, setCurrentView }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, pass: password }),
            });

            const result = await res.json();

            if (res.status === 200) {
                setUser({ username: result.user.username, role: result.user.acc_type });
                setCurrentView(result.user.acc_type === 'manager' ? 'managerDashboard' : 'dashboard');
            } else {
                setError(result.message || 'Invalid username or password');
            }
        } catch (err) {
            console.error('Login Error:', err);
            setError('An error occurred. Please try again.');
        }
    };

    const handleRegisterRedirect = () => {
        setCurrentView('register');
    };

    return (
        <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
            <Grid item xs={10} sm={8} md={4}>
                <Paper sx={{ p: 4 }} elevation={3}>
                    <Typography variant="h4" gutterBottom align="center">
                        Login
                    </Typography>
                    {error && (
                        <Typography variant="body2" color="error" gutterBottom align="center">
                            {error}
                        </Typography>
                    )}
                    <Box
                        component="form"
                        onSubmit={handleLogin}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            mt: 2,
                        }}
                    >
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button type="submit" variant="contained" fullWidth>
                            Login
                        </Button>
                    </Box>
                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        New user?{' '}
                        <Button
                            variant="text"
                            color="primary"
                            onClick={handleRegisterRedirect}
                            sx={{ textTransform: 'none', p: 0, m: 0 }}
                        >
                            Register here
                        </Button>
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
}

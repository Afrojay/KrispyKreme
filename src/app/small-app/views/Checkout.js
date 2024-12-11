'use client';

import React from 'react';
import { Grid, Paper, Typography, Button, Box } from '@mui/material';

export default function Checkout({ user, cart, setCart, setCurrentView }) {
    const total = cart?.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const handleOrderPlacement = async () => {
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: user?.username,
                }),
            });

            const data = await res.json();
            if (data.status === 'success') {
                alert('Order placed successfully!');
                setCart([]); // Clear the cart
                setCurrentView('dashboard'); // Redirect to dashboard
            } else {
                alert(`Checkout failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            alert('Checkout failed. Please try again.');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Checkout
            </Typography>
            <Grid container spacing={3}>
                {cart?.map((item, index) => (
                    <Grid item xs={12} key={index}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6">{item.pname}</Typography>
                            <Typography>
                                Quantity: {item.quantity} x ${item.price.toFixed(2)}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            <Typography variant="h5" sx={{ mt: 3 }}>
                Grand Total: ${total?.toFixed(2) || 0}
            </Typography>
            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                onClick={handleOrderPlacement}
            >
                Confirm and Place Order
            </Button>
        </Box>
    );
}

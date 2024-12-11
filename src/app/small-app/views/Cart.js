'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';

export default function Cart({ user, cart, setCart, setCurrentView }) {
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (!cart.length) {
            fetch(`/api/getCart?username=${user?.username}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === 'success') {
                        setCart(data.cart);

                        // Calculate total cost
                        const totalCost = data.cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
                        setTotal(totalCost);
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Error fetching cart:', err);
                    setLoading(false);
                });
        } else {
            const totalCost = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
            setTotal(totalCost);
            setLoading(false);
        }
    }, [user, cart, setCart]);

    const handleCheckout = () => {
        setCurrentView('checkout');
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Your Cart
            </Typography>
            {loading ? (
                <Typography>Loading cart...</Typography>
            ) : cart.length > 0 ? (
                <>
                    <Grid container spacing={3}>
                        {cart.map((item, index) => (
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
                        Grand Total: ${total.toFixed(2)}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={handleCheckout}
                    >
                        Proceed to Checkout
                    </Button>
                </>
            ) : (
                <Typography>Your cart is empty.</Typography>
            )}
        </Box>
    );
}

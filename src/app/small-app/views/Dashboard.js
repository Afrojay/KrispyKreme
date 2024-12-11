import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';

export default function Dashboard({ user, setCart, setCurrentView }) {
    const [data, setData] = useState([]); // Stores orders or products
    const [loading, setLoading] = useState(true); // Tracks loading state
    const [weather, setWeather] = useState(null); // Stores weather data
    const isManager = user?.acc_type === 'manager'; // Check if the user is a manager

    useEffect(() => {
        if (!user) {
            console.error('No user session available.');
            return;
        }

        // Fetch weather data
        fetch('/api/getWeather')
            .then((res) => res.json())
            .then((result) => {
                if (result.status === 'success') {
                    setWeather(result.weather);
                } else {
                    console.error('Weather API Error:', result.message);
                }
            })
            .catch((err) => {
                console.error('Error fetching weather data:', err);
            });

        // Fetch orders or products based on user role
        const endpoint = isManager ? '/api/getOrders' : '/api/getProducts';
        fetch(endpoint)
            .then((res) => res.json())
            .then((result) => {
                if (result.status === 'success') {
                    setData(result.data || []); // Set orders or products
                } else {
                    console.error(result.message);
                }
                setLoading(false); // Data fetched, stop loading
            })
            .catch((err) => {
                console.error(`Error fetching ${isManager ? 'orders' : 'products'}:`, err);
                setLoading(false); // Stop loading on error
            });
    }, [isManager, user]);

    const addToCart = (product) => {
        fetch('/api/putInCart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: user.username,
                pname: product.pname,
                quantity: 1,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.status === 'success') {
                    alert(`${product.pname} added to your cart!`);
                    setCart(result.cart); // Update cart
                } else {
                    alert(result.message);
                }
            })
            .catch((err) => {
                console.error('Error adding to cart:', err);
                alert('Failed to add item.');
            });
    };

    if (!user) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h6" color="error">
                    No session available. Please log in.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                {isManager ? 'Manager Dashboard' : 'Customer Dashboard'}
            </Typography>
            {weather && (
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Current Weather: {weather.temp}°C, {weather.condition}
                </Typography>
            )}
            {loading ? (
                <Typography>Loading...</Typography>
            ) : data.length === 0 ? (
                <Typography>No {isManager ? 'orders' : 'products'} available.</Typography>
            ) : isManager ? (
                <Grid container spacing={3}>
                    {data.map((order) => (
                        <Grid item xs={12} key={order.order_id}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6">Order ID: {order.order_id}</Typography>
                                <Typography>Total: ${order.total.toFixed(2)}</Typography>
                                <Typography>Placed by: {order.username}</Typography>
                                <Typography>
                                    Timestamp: {new Date(order.timestamp).toLocaleString()}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Grid container spacing={3}>
                    {data.map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product._id}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6">{product.pname}</Typography>
                                <Typography>${product.price.toFixed(2)}</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => addToCart(product)}
                                >
                                    Add to Cart
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}

import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

export default function ManagerDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/getOrders');
                const result = await response.json();
                if (result.status === 'success') {
                    setOrders(result.data || []);
                }
            } catch (err) {
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false); // Ensure loading state is updated after fetch
            }
        };

        fetchOrders();
    }, []); // Only run on component mount

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Manager Dashboard
            </Typography>
            {loading ? (
                <Typography>Loading orders...</Typography>
            ) : orders.length === 0 ? (
                <Typography>No orders available.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {orders.map((order) => (
                        <Grid item xs={12} key={order.order_id}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6">Order ID: {order.order_id}</Typography>
                                <Typography>
                                    Total: ${order.total ? order.total.toFixed(2) : '0.00'}
                                </Typography>
                                <Typography>Placed by: {order.username}</Typography>
                                <Typography>
                                    Timestamp: {order.timestamp
                                        ? new Date(order.timestamp).toLocaleString()
                                        : 'Unknown'}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}

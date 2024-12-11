import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';

export default function CustomerDashboard({ user, setCart }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        // Fetch products
        fetch('/api/getProducts')
            .then((res) => res.json())
            .then((result) => {
                if (result.products) {
                    setProducts(result.products);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching products:', err);
                setLoading(false);
            });

        // Fetch weather
        fetch('/api/getWeather')
            .then((res) => res.json())
            .then((result) => {
                setWeather(result);
            })
            .catch((err) => {
                console.error('Error fetching weather:', err);
            });
    }, []);

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
                    setCart(result.cart);
                } else {
                    alert(result.message);
                }
            })
            .catch((err) => {
                console.error('Error adding to cart:', err);
            });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Customer Dashboard
            </Typography>
            {weather && (
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Current Weather: {weather.temp}°C, {weather.condition}
                </Typography>
            )}
            {loading ? (
                <Typography>Loading products...</Typography>
            ) : products.length === 0 ? (
                <Typography>No products available.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {products.map((product) => (
                       <Grid item xs={12} sm={6} md={4} key={product._id}>
                       <Paper sx={{ p: 2 }}>
                           {/* Display the product image */}
                           <img
                               src={product.image}
                               alt={product.pname}
                               style={{ width: '100%', height: 'auto', marginBottom: '10px' }}
                           />
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

'use client';

import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Define the global theme
const theme = createTheme({
  palette: {
    primary: { main: '#006941' }, // Krispy Kreme green
    secondary: { main: '#D2232A' }, // Krispy Kreme red
    background: { default: '#F5F5F5' }, // Light gray
  },
  typography: {
    fontFamily: `'Open Sans', 'Arial', sans-serif`,
    button: { textTransform: 'none', fontWeight: 'bold' },
  },
});

export default function Layout({ children, setCurrentView, user, setUser }) {
  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <AppBar position="static" sx={{ padding: '0 16px' }}>
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <img
                src="/Krispy_Kreme_logo.svg" // Ensure this file is in the public folder
                alt="Krispy Kreme Logo"
                style={{ height: '40px', cursor: 'pointer' }}
                onClick={() => setCurrentView('dashboard')}
              />
            </Box>
            <Button color="inherit" onClick={() => setCurrentView('dashboard')}>
              Home
            </Button>
            <Button color="inherit" onClick={() => setCurrentView('cart')}>
              Cart
            </Button>
            {user ? (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button color="inherit" onClick={() => setCurrentView('login')}>
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    </ThemeProvider>
  );
}

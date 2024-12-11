'use client';

import React, { useState } from 'react';
import Layout from './components/Layout';
import Login from './views/Login';
import Register from './views/Register';
import CustomerDashboard from './views/CustomerDashboard';
import ManagerDashboard from './views/ManagerDashboard';
import Cart from './views/Cart';
import Checkout from './views/Checkout';

export default function App() {
    const [currentView, setCurrentView] = useState('login'); // Tracks current view
    const [user, setUser] = useState(null); // Stores logged-in user info
    const [cart, setCart] = useState([]); // Cart state

    const renderView = () => {
        if (!user) {
            // If not logged in, allow only login and register views
            switch (currentView) {
                case 'login':
                    return <Login setUser={setUser} setCurrentView={setCurrentView} />;
                case 'register':
                    return <Register setUser={setUser} setCurrentView={setCurrentView} />;
                default:
                    return <Login setUser={setUser} setCurrentView={setCurrentView} />;
            }
        }

        // Logged-in views
        switch (currentView) {
            case 'dashboard':
                // Check the user role to render the correct dashboard
                return user.role === 'manager' ? (
                    <ManagerDashboard setCurrentView={setCurrentView} user={user} />
                ) : (
                    <CustomerDashboard setCurrentView={setCurrentView} user={user} setCart={setCart} />
                );
            case 'cart':
                return <Cart setCurrentView={setCurrentView} user={user} cart={cart} setCart={setCart} />;
            case 'checkout':
                return <Checkout setCurrentView={setCurrentView} user={user} cart={cart} setCart={setCart} />;
            default:
                return user.role === 'manager' ? (
                    <ManagerDashboard setCurrentView={setCurrentView} user={user} />
                ) : (
                    <CustomerDashboard setCurrentView={setCurrentView} user={user} setCart={setCart} />
                );
        }
    };

    return (
        <Layout setCurrentView={setCurrentView} user={user} setUser={setUser}>
            {renderView()}
        </Layout>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './views/Login';
import Register from './views/Register';
import CustomerDashboard from './views/CustomerDashboard';
import ManagerDashboard from './views/ManagerDashboard';
import Cart from './views/Cart';
import Checkout from './views/Checkout';

export default function App() {
    const [currentView, setCurrentView] = useState('login');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === 'success') {
                        setUser(data.user);
                        setCurrentView('dashboard');
                    } else {
                        localStorage.removeItem('token'); // Remove invalid token
                    }
                })
                .catch(() => localStorage.removeItem('token'));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token
        setUser(null); // Clear user info
        setCurrentView('login'); // Redirect to login
    };

    const renderView = () => {
        if (!user) {
            switch (currentView) {
                case 'login':
                    return <Login setUser={setUser} setCurrentView={setCurrentView} />;
                case 'register':
                    return <Register setUser={setUser} setCurrentView={setCurrentView} />;
                default:
                    return <Login setUser={setUser} setCurrentView={setCurrentView} />;
            }
        }

        switch (currentView) {
            case 'dashboard':
                return user.acc_type === 'manager' ? (
                    <ManagerDashboard setCurrentView={setCurrentView} user={user} />
                ) : (
                    <CustomerDashboard setCurrentView={setCurrentView} user={user} />
                );
            default:
                return <Login setUser={setUser} setCurrentView={setCurrentView} />;
        }
    };

    return (
        <Layout setCurrentView={setCurrentView} user={user} setUser={setUser}>
            {renderView()}
        </Layout>
    );
}

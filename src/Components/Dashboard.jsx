import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
    FaHistory,
    FaExchangeAlt,
    FaGem,
    FaUser,
    FaBell,
    FaCog,
    FaSignOutAlt
} from 'react-icons/fa';
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recentTransactions, setRecentTransactions] = useState([
        { type: 'Diamond Transfer', amount: 500, date: '2024-01-20' },
        { type: 'Purchase', amount: 1000, date: '2024-01-19' },
        { type: 'Sale', amount: 750, date: '2024-01-18' },
    ]);

    useEffect(() => {
        const userId = localStorage.getItem('user_id'); // Assuming user_phone is the ID
        if (userId) {
            fetchUserData(userId);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'No User ID Found',
                text: 'Please log in again.',
            });
            navigate('/login');
        }
    }, []);

    const fetchUserData = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8090/api/collections/resellers/records/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Failed to load user data',
                text: 'Please try refreshing the page.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (route) => {
        navigate(route);
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure you want to logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, logout',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                // Handle logout logic here
                navigate('/login');
            }
        });
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Welcome, {user?.firstname}</h1>
                <div className="user-info">
                    <div className="notification-badge">
                        <FaBell />
                    </div>
                </div>
            </header>

            <section className="diamond-balance">
                <FaGem className="diamond-icon" />
                <div className="balance-info">
                    <h2>Diamond Balance</h2>
                    <p>{user?.diomand_balance}</p>
                </div>
            </section>

            <section className="stats-section">
                <div className="stat-card">
                    <h4>Today's Transfers</h4>
                    <p>23</p>
                </div>
            </section>

            <section className="dashboard-cards">
                <div className="card" onClick={() => handleCardClick('/transactions')}>
                    <FaHistory className="card-icon" />
                    <h3>Payment History</h3>
                </div>
                <div className="card" onClick={() => handleCardClick('/transfer')}>
                    <FaExchangeAlt className="card-icon" />
                    <h3>Transfer Diamonds</h3>
                </div>
                <div className="card" onClick={() => handleCardClick('/editprofile')}>
                    <FaUser className="card-icon" />
                    <h3>My Profile</h3>
                </div>
            </section>

            <section className="recent-transactions">
                <h2>Recent Transactions</h2>
                <div className="transaction-list">
                    {recentTransactions.map((transaction, index) => (
                        <div key={index} className="transaction-item">
                            <div className="transaction-info">
                                <span className="transaction-type">{transaction.type}</span>
                                <span className="transaction-amount">{transaction.amount} diamonds</span>
                            </div>
                            <span className="transaction-date">{transaction.date}</span>
                        </div>
                    ))}
                </div>
            </section>

            <div className="quick-actions">
                <button onClick={handleLogout} className="action-button logout">
                    <FaSignOutAlt /> Logout
                </button>
            </div>

            {/* Corrected button for buying diamonds */}
            <button className="floating-button" onClick={() => navigate('/buydiamonds')}>
                <FaGem /> Buy Diamonds
            </button>
        </div>
    );
}

export default Dashboard;
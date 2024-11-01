import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
    FaHistory, 
    FaExchangeAlt, 
    FaGem,  // Use FaGem instead of FaDiamond
    FaUser,
    FaChartLine,
    FaBell,
    FaCog,
    FaSignOutAlt 
  } from 'react-icons/fa';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([
    { type: 'Diamond Transfer', amount: 500, date: '2024-01-20' },
    { type: 'Purchase', amount: 1000, date: '2024-01-19' },
    { type: 'Sale', amount: 750, date: '2024-01-18' },
  ]);
  const userPhone = localStorage.getItem('user_phone');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://109.199.99.84:8090/api/collections/resellers_registration/records/record_id');
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

    fetchUserData();
  }, []);

  const handleCardClick = (route) => {
    navigate(route);
  };

  const handleBuyDiamonds = () => {
    Swal.fire({
      title: 'Buy Diamonds',
      html: `
        <input type="number" id="diamondAmount" class="swal2-input" placeholder="Enter amount">
      `,
      confirmButtonText: 'Buy',
      showCancelButton: true,
      preConfirm: () => {
        const amount = Swal.getPopup().querySelector('#diamondAmount').value;
        if (!amount || amount <= 0) {
          Swal.showValidationMessage('Please enter a valid amount');
        }
        return { amount };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Purchase Successful', `You've bought ${result.value.amount} diamonds!`, 'success');
      }
    });
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
          <img src={user?.profile_picture || 'default-avatar.png'} alt="Profile" className="profile-picture" />
          <span>{user?.leo_number}</span>
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
        <div className="stat-card">
          <h4>Monthly Sales</h4>
          <p>$2,456</p>
        </div>
        <div className="stat-card">
          <h4>Active Users</h4>
          <p>156</p>
        </div>
      </section>

      <section className="dashboard-cards">
        <div className="card" onClick={() => handleCardClick('/payment-history')}>
          <FaHistory className="card-icon" />
          <h3>Payment History</h3>
        </div>
        <div className="card" onClick={() => handleCardClick('/transfer-diamonds')}>
          <FaExchangeAlt className="card-icon" />
          <h3>Transfer Diamonds</h3>
        </div>
        <div className="card" onClick={() => handleCardClick('/profile')}>
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
        <button onClick={() => navigate('/settings')} className="action-button">
          <FaCog /> Settings
        </button>
        <button onClick={handleLogout} className="action-button logout">
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <button className="floating-button" onClick={handleBuyDiamonds}>
      <FaGem />  Buy Diamonds
      </button>
    </div>
  );
}

export default Dashboard;
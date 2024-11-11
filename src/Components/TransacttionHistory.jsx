import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './TransactionHistory.css'; // Ensure to style your component in this CSS file

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('user_id'); // Assuming user_id is stored in localStorage

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Fetch all transactions
        const response = await fetch('http://127.0.0.1:8090/api/collections/transaction_history/records');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Filter transactions by user_id
        const filteredTransactions = data.items.filter(transaction => transaction.user_id === userId);
        setTransactions(filteredTransactions); // Set filtered transactions
      } catch (error) {
        console.error('Error fetching transactions:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to load transactions',
          text: 'Please try refreshing the page.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="transaction-history">
      <h1>Last Transactions</h1>
      <div className="transaction-list">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div key={transaction.id} className="transaction-card">
              <div className="transaction-details">
                <p><strong>Amount:</strong> {transaction.diamond_amount} Diamonds</p>
                <p><strong>Price:</strong> ${transaction.price}</p>
                <p><strong>Status:</strong> {transaction.succcess_or_fail}</p>
                <p><strong>Date:</strong> {new Date(transaction.created).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No transactions found.</p>
        )}
      </div>
    </div>
  );
}

export default TransactionHistory;
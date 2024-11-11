import React, { useState, useEffect } from 'react';

const DiamondTransfer = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [userExists, setUserExists] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resellerId, setResellerId] = useState('');
  const [resellerBalance, setResellerBalance] = useState(0);

  // Fetch reseller details on component mount
  useEffect(() => {
    const fetchResellerDetails = async () => {
      const userId = localStorage.getItem('user_id'); // Ensure this is the correct key
      if (!userId) {
        setErrorMessage('User ID not found in local storage.');
        return;
      }

      try {
        // Fetch reseller data using userId
        const response = await fetch(`http://127.0.0.1:8090/api/collections/resellers/records/${userId}`);
        if (!response.ok) {
          const errorDetails = await response.json();
          console.error('Error fetching reseller:', errorDetails);
          setErrorMessage('Failed to fetch reseller data.');
          return;
        }

        const data = await response.json();
        if (data) {
          setResellerId(userId);
          setResellerBalance(data.diamond_balance); // Assuming diamond_balance is the correct field
        } else {
          setErrorMessage('No reseller found for this user.');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setErrorMessage('Error fetching reseller details.');
      }
    };

    fetchResellerDetails();
  }, []);

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
    setUserExists(false);
  };

  const checkUserExists = async () => {
    setLoading(true);
    if (!phoneNumber.trim()) { // Check if phoneNumber is empty
      setErrorMessage('Please enter a phone number.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8090/api/collections/users/records?filter=(phonenumber=${phoneNumber})`);
      const data = await response.json();
      if (data && data.items.length > 0) {
        setUserExists(true);
        setErrorMessage('');
      } else {
        setErrorMessage('User with this phone number does not exist.');
      }
    } catch (error) {
      setErrorMessage('Error checking user existence.');
    }
    setLoading(false);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    if (!userExists) {
      setErrorMessage('Please verify the recipient’s phone number.');
      setLoading(false);
      return;
    }

    if (transferAmount <= 0) {
      setErrorMessage('Please enter a valid transfer amount.');
      setLoading(false);
      return;
    }

    try {
      // Check current reseller balance
      if (transferAmount > resellerBalance) {
        setErrorMessage('Insufficient balance for this transfer.');
        setLoading(false);
        return;
      }

      // Fetch user details by phone number
      const userResponse = await fetch(`http://127.0.0.1:8090/api/collections/users/records?filter=(phonenumber=${phoneNumber})`);
      const userData = await userResponse.json();
      const recipient = userData.items[0];

      // Deduct diamonds from reseller's balance
      const updatedResellerBalance = resellerBalance - transferAmount;

      await fetch(`http://127.0.0.1:8090/api/collections/resellers/records/${resellerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ diamond_balance: updatedResellerBalance }),
      });

      // Add diamonds to recipient's wallet
      const updatedRecipientBalance = recipient.wallet + parseInt(transferAmount);

      await fetch(`http://127.0.0.1:8090/api/collections/users/records/${recipient.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet: updatedRecipientBalance }),
      });

      // Log transaction
      await fetch(`http://127.0.0.1:8090/api/collections/reseller_diamond_send_history/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Replace with actual token if needed
        },
        body: JSON.stringify({
          leo_mobile_number: phoneNumber,
          reciever_username: recipient.firstname,
          diamond_amount: transferAmount,
        }),
      });

      // Update state and notify user
      setSuccessMessage('Transfer successful!');
      setResellerBalance(updatedResellerBalance); // Update state with new balance
      setTransferAmount('');
      setPhoneNumber('');
      setUserExists(false);
    } catch (error) {
      console.error(error); // Log error for debugging
      setErrorMessage('Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <style>
        {`
          .diamond-transfer-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: linear-gradient(145deg, #ffffff, #f5f7fa);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.diamond-transfer-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, #3498db, #2ecc71);
}

.diamond-transfer-title {
  font-size: 2rem;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 600;
  position: relative;
}

.diamond-transfer-title::after {
  content: '';
  display: block;
  width: 50px;
  height: 3px;
  background: #3498db;
  margin: 0.5rem auto;
  border-radius: 2px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: #34495e;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.input-wrapper {
  position: relative;
}

.form-control {
  width: 100%;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  border: 2px solid #e1e8ed;
  border-radius: 12px;
  transition: all 0.3s ease;
  background-color: #ffffff;
  color: #2c3e50;
}

.form-control:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.1);
}

.form-control:hover {
  border-color: #bdc3c7;
}

.phone-verification {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.verification-icon {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
}

.verification-icon.success {
  color: #2ecc71;
  transform: scale(1.1);
}

.transfer-button {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #3498db, #2980b9);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  position: relative;
  overflow: hidden;
}

.transfer-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
}

.transfer-button:active {
  transform: translateY(0);
}

.transfer-button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
}

.alert {
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  font-weight: 500;
  animation: slideIn 0.3s ease;
}

.alert-success {
  background-color: rgba(46, 204, 113, 0.1);
  border: 1px solid rgba(46, 204, 113, 0.2);
  color: #27ae60;
}

.alert-error {
  background-color: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.2);
  color: #c0392b;
}

/* Loading animation */
.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;
}

/* Balance display */
.balance-display {
  background: rgba(52, 152, 219, 0.1);
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  text-align: center;
}

.balance-amount {
  font-size: 1.5rem;
  color: #2c3e50;
  font-weight: 600;
}

.balance-label {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

/* Animations */
@keyframes slideIn {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .diamond-transfer-container {
    margin: 1rem;
    padding: 1.5rem;
  }

  .diamond-transfer-title {
    font-size: 1.5rem;
  }
}

/* Input number spinner removal */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* Focus styles for accessibility */
.form-control:focus-visible {
  outline: 2px solid #3498db;
  outline-offset: 1px;
}

/* Hover effects for interactive elements */
.form-group:hover label {
  color: #3498db;
}

/* Custom placeholder style */
.form-control::placeholder {
  color: #95a5a6;
  opacity: 0.7;
}

/* Error state for inputs */
.form-control.error {
  border-color: #e74c3c;
}

.form-control.error:focus {
  box-shadow: 0 0 0 4px rgba(231, 76, 60, 0.1);
}

/* Success state for inputs */
.form-control.success {
  border-color: #2ecc71;
}

.form-control.success:focus {
  box-shadow: 0 0 0 4px rgba(46, 204, 113, 0.1);
}

/* Custom scrollbar */
.diamond-transfer-container::-webkit-scrollbar {
  width: 8px;
}

.diamond-transfer-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.diamond-transfer-container::-webkit-scrollbar-thumb {
  background: #bdc3c7;
  border-radius: 4px;
}

.diamond-transfer-container::-webkit-scrollbar-thumb:hover {
  background: #95a5a6;
}
        `}
      </style>

      <div className="transfer-container">
        <h2>Transfer Diamonds</h2>

        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <form onSubmit={handleTransfer} className="p-3">
          <div className="form-group">
            <label htmlFor="phoneNumber">Recipient Phone Number</label>
            <div className="d-flex">
              <input
                type="text"
                className="form-control mr-2"
                id="phoneNumber"
                name="phoneNumber"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                onBlur={checkUserExists}
              />
              {userExists && <span className="text-success">✔</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="transferAmount">Diamond Amount to Transfer</label>
            <input
              type="number"
              className="form-control"
              id="transferAmount"
              name="transferAmount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              min="1" // Ensure at least a value of one can be entered
              required // Make the field required for form submission
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Processing...' : 'Transfer Diamonds'}
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default DiamondTransfer;

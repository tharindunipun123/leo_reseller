import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './BuyDiamonds.css'; // Ensure to style your component in this CSS file

function BuyDiamonds() {
  const [diamonds, setDiamonds] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('user_id'); // Assuming user_id is stored in localStorage
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiamonds = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8090/api/collections/reseller_diamonds/records');
        const data = await response.json();
        setDiamonds(data.items); // Adjust based on your API response structure
      } catch (error) {
        console.error('Error fetching diamonds:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to load diamonds',
          text: 'Please try refreshing the page.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDiamonds();
  }, []);

  const handleBuy = async (diamond) => {
    const { price, Diamon_Amount } = diamond;

    // Confirm purchase with the user
    Swal.fire({
      title: 'Confirm Purchase',
      text: `Are you sure you want to buy ${Diamon_Amount} diamonds for $${price}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Buy Now'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Simulate payment processing (replace this with actual payment integration)
          const paymentSuccess = await processPayment(price);
          if (!paymentSuccess) {
            Swal.fire('Payment Failed', 'There was an issue processing your payment.', 'error');
            return;
          }

          // Create transaction record
          await fetch('http://127.0.0.1:8090/api/collections/transaction_history/records', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: userId,
              diamond_amount: Diamon_Amount,
              price: price,
              succcess_or_fail: 'success'
            })
          });

          // Update user balance by adding diamonds
          await fetch(`http://127.0.0.1:8090/api/collections/resellers/records/${userId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              // Replace with your admin token if needed
            },
            body: JSON.stringify({
              diomand_balance: (await getCurrentBalance()) + Diamon_Amount // Add the diamond amount to current balance
            })
          });

          // Notify user of success
          Swal.fire('Purchase Successful', `You've bought ${Diamon_Amount} diamonds!`, 'success');
          navigate('/dashboard'); // Navigate back to the dashboard or any other page
        } catch (error) {
          console.error('Error completing purchase:', error);
          Swal.fire({
            icon: 'error',
            title: 'Purchase Failed',
            text: 'Please try again later.',
          });
        }
      }
    });
  };

  const processPayment = async (amount) => {
    // Placeholder for payment processing logic
    // Implement your payment gateway integration here (e.g., Stripe, PayPal)
    return true; // Simulate successful payment for now
  };

  const getCurrentBalance = async () => {
    const response = await fetch(`http://127.0.0.1:8090/api/collections/resellers/records/${userId}`);
    const userData = await response.json();
    return userData.diomand_balance;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="buy-diamonds">
      <h1>Buy Diamonds</h1>
      <div className="diamond-list">
        {diamonds.map((diamond) => (
          <div key={diamond.id} className="diamond-card">
            <img src={diamond.image_url || 'https://i.pinimg.com/originals/ca/6f/91/ca6f91105d3a008e3f9fb9cd4c5607f2.png'} alt={`${diamond.Diamon_Amount} Diamonds`} className="diamond-image" />
            <h2>{diamond.Diamon_Amount} Diamonds</h2>
            <p>Price: ${diamond.price}</p>
            <button onClick={() => handleBuy(diamond)} className="buy-button">Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuyDiamonds;
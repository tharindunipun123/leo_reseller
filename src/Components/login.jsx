import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Ensure to style your component in this CSS file
import LoginIllustration from './undraw_Mobile_development_re_wwsn.png';

const PhoneNumberOtp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 for phone number, 2 for OTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState(null); // Store userId from API response

  // Handle the submission of the phone number
  const handlePhoneNumberSubmit = async (e) => {
    e.preventDefault();
    // Simulate sending OTP (you would actually call your API here)
    Swal.fire('OTP Sent', 'An OTP has been sent to your phone number.', 'success');
    setStep(2); // Move to the OTP step
  };

  // Handle the submission of the OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    // Simulate OTP verification (you would actually verify with your API here)
    if (otp === '123456') { // Replace this with actual OTP verification logic
      try {
        const response = await fetch(`http://127.0.0.1:8090/api/collections/resellers/records?filter=(leo_number='${phoneNumber}')`);
        const data = await response.json();

        if (data.items.length > 0) {
          const user = data.items[0];
          setUserId(user.id);
          localStorage.setItem('user_id', user.id); // Save userId in local storage
          Swal.fire('Login Successful', 'You are now logged in!', 'success');
          navigate('/dashboard'); // Redirect to the dashboard or another page
        } else {
          Swal.fire('Error', 'User not found!', 'error');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Swal.fire('Error', 'Failed to fetch user data!', 'error');
      }
    } else {
      Swal.fire('Error', 'Invalid OTP!', 'error');
    }
  };

  return (
    <div className="login-container">
    <div className="login-wrapper">
        <div className="login-illustration">
            <img src={LoginIllustration} alt="Login Illustration" />
        </div>
        <div className="login-form-section">
            <h2 className="login-title">
                {step === 1 ? 'Enter Phone Number' : 'Enter OTP'}
            </h2>
            <form 
                className="login-form" 
                onSubmit={step === 1 ? handlePhoneNumberSubmit : handleOtpSubmit}
            >
                {step === 1 ? (
                    <>
                        <input
                            type="tel"
                            className="login-input"
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                        <button type="submit" className="login-button">
                            Send OTP
                        </button>
                    </>
                ) : (
                    <>
                        <input
                            type="text"
                            className="login-input"
                            placeholder="OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                        <button type="submit" className="login-button">
                            Verify OTP
                        </button>
                    </>
                )}
            </form>
        </div>
    </div>
</div>
  );
};

export default PhoneNumberOtp;
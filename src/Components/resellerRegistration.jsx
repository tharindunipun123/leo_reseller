import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Registration.css';

function Registration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    leo_number: '',
    addres: '',
    email: '',
    reason_for_choosing_reseller: '',
    National_Id_Card: null,
    diomand_balance: 0,
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === 'National_Id_Card') {
      const file = e.target.files[0];
      setFormData({ ...formData, National_Id_Card: file });
      
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewImage(null);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show loading alert
    Swal.fire({
      title: 'Processing...',
      html: 'Please wait while we submit your registration.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const formDataToSubmit = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'National_Id_Card') {
          if (formData[key]) {
            formDataToSubmit.append(key, formData[key]);
          }
        } else {
          formDataToSubmit.append(key, formData[key]);
        }
      });

      const response = await fetch('http://127.0.0.1:8090/api/collections/resellers_registration/records', {
        method: 'POST',
        body: formDataToSubmit,
      });

      if (response.ok) {
        // Success alert
        await Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'You will be redirected to the login page.',
          timer: 2000,
          showConfirmButton: false
        });
        navigate('/login');
      } else {
        const errorData = await response.json();
        // Error alert
        await Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: errorData.message || 'Something went wrong. Please try again.',
        });
        console.error('Registration failed:', errorData);
      }
    } catch (error) {
      // Network error alert
      await Swal.fire({
        icon: 'error',
        title: 'Connection Error',
        text: 'Unable to connect to the server. Please check your internet connection.',
      });
      console.error('Error:', error);
    }
  };

  // Function to validate file size and type
  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: 'Please upload only JPG, JPEG or PNG images.',
      });
      return false;
    }

    if (file.size > maxSize) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Please upload an image less than 5MB in size.',
      });
      return false;
    }

    return true;
  };

  // Updated handleChange to include file validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setFormData({ ...formData, National_Id_Card: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      e.target.value = null; // Reset file input
      setPreviewImage(null);
      setFormData({ ...formData, National_Id_Card: null });
    }
  };

  return (
    <div className="registration-container">
      <h2>LEO Reseller</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstname"
          placeholder="First Name"
          value={formData.firstname}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastname"
          placeholder="Last Name"
          value={formData.lastname}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="leo_number"
          placeholder="LEO Number"
          value={formData.leo_number}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="addres"
          placeholder="Address"
          value={formData.addres}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="reason_for_choosing_reseller"
          placeholder="Reason for choosing reseller"
          value={formData.reason_for_choosing_reseller}
          onChange={handleChange}
          required
        ></textarea>
        
        <div className="file-upload-container">
          <label htmlFor="National_Id_Card" className="file-upload-label">
            Upload National ID Card
            <input
              type="file"
              id="National_Id_Card"
              name="National_Id_Card"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="file-input"
            />
          </label>
          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="ID Card Preview" />
            </div>
          )}
        </div>
      
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}

export default Registration;
import React, { useState } from 'react';

const EditProfile = ({ userId }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    leo_number: '',
    address: '',
    email: '',
    National_Id_Card: null,
    reason_for_choosing_reseller: '',
    diomand_balance: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    const form = new FormData();
    for (let key in formData) {
      if (formData[key] !== '') {
        form.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch(`http://127.0.0.1:8090/api/collections/resellers/records/${userId}`, {
        method: 'PATCH',
        body: form,
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage('Profile updated successfully!');
        setFormData(data);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <style>
        {`
          .edit-profile-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
}

.edit-profile-container h2 {
  color: #2d3748;
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  flex: 1 1 300px;
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #2d3748;
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  border-color: #4299e1;
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

.btn {
  display: inline-block;
  font-weight: 600;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.5rem;
  transition: all 0.15s ease-in-out;
  cursor: pointer;
}

.btn-primary {
  color: #ffffff;
  background-color: #4299e1;
  border: none;
  width: 100%;
  margin-top: 1rem;
}

.btn-primary:hover:not(:disabled) {
  background-color: #3182ce;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background-color: #90cdf4;
  cursor: not-allowed;
}

.alert {
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
}

.alert-success {
  background-color: #c6f6d5;
  color: #2f855a;
  border: 1px solid #9ae6b4;
}

.alert-danger {
  background-color: #fed7d7;
  color: #c53030;
  border: 1px solid #feb2b2;
}

/* File input styling */
input[type="file"] {
  padding: 0.5rem;
  font-size: 0.875rem;
}

input[type="file"]::file-selector-button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  background-color: #e2e8f0;
  border: none;
  color: #4a5568;
  font-weight: 500;
  margin-right: 1rem;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

input[type="file"]::file-selector-button:hover {
  background-color: #cbd5e0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .edit-profile-container {
    margin: 1rem;
    padding: 1.5rem;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .form-group {
    flex: 1 1 100%;
  }
}

/* Input hover states */
.form-control:hover:not(:focus) {
  border-color: #cbd5e0;
}

/* Loading state animation */
.btn-primary:disabled {
  position: relative;
  overflow: hidden;
}

.btn-primary:disabled::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: loading 1.5s infinite;
}

@keyframes loading {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(100%);
  }
}

/* Focus outline for accessibility */
:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.4);
}

/* Error state for inputs */
.form-control.is-invalid {
  border-color: #fc8181;
  padding-right: calc(1.5em + 0.75rem);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23fc8181' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23fc8181' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.form-control.is-invalid:focus {
  border-color: #fc8181;
  box-shadow: 0 0 0 3px rgba(252, 129, 129, 0.2);
}

/* Success state for inputs */
.form-control.is-valid {
  border-color: #68d391;
  padding-right: calc(1.5em + 0.75rem);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2368d391' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.form-control.is-valid:focus {
  border-color: #68d391;
  box-shadow: 0 0 0 3px rgba(104, 211, 145, 0.2);
}
        `}
      </style>
      <div className="edit-profile-container">
        <h2>Edit Profile</h2>
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <form onSubmit={handleSubmit} className="p-3">
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="firstname">First Name</label>
              <input
                type="text"
                className="form-control"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="lastname">Last Name</label>
              <input
                type="text"
                className="form-control"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="leo_number">LEO Number</label>
              <input
                type="text"
                className="form-control"
                id="leo_number"
                name="leo_number"
                value={formData.leo_number}
                onChange={handleChange}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="diomand_balance">Diamond Balance</label>
              <input
                type="number"
                className="form-control"
                id="diomand_balance"
                name="diomand_balance"
                value={formData.diomand_balance}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              className="form-control"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reason_for_choosing_reseller">Reason for Choosing Reseller</label>
            <textarea
              className="form-control"
              id="reason_for_choosing_reseller"
              name="reason_for_choosing_reseller"
              rows="3"
              value={formData.reason_for_choosing_reseller}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="National_Id_Card">National ID Card</label>
            <input
              type="file"
              className="form-control"
              id="National_Id_Card"
              name="National_Id_Card"
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary  " disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

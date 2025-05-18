import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';



function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    number: '',
    password: '',
    confirmPassword: '',
    city: '',
    pincode: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Password & Confirm password do not match!");
      return;
    }

    // Create a copy of formData without confirmPassword
    const { confirmPassword, ...dataToSubmit } = formData;

      axios.post('http://localhost:3300/api/user/register', dataToSubmit)
      .then(res => {
        console.log(res.data);
        toast.success(" Registration successful!");

        // Optional: Reset form
        setFormData({
          username: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          city: '',
          pincode: '',
        });
      })
      .catch(err => {
        const errorMsg =
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : 'Something went wrong. Please try again.';
            
        toast.error(errorMsg);
      });
  };

  return (
    <>

    <ToastContainer position="top-right" autoClose={3000} />


    <div className="container mt-5">
      <div className="card shadow-lg rounded-4">
        <div className="card-body p-4">
          <h3 className="text-center mb-4">Registration Form</h3>
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">number</label>
                <input
                  type="tel"
                  className="form-control"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Pincode</label>
              <input
                type="text"
                className="form-control"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
              />
            </div>
            <div className='text-center'>
              <button type="submit" className="btn btn-primary w-50">
                Register
              </button>
            </div>
              <p className="mt-2 mb-2">
                <Link to="/login">Login</Link>
              </p>

          </form>
        </div>
      </div>
    </div>
    </>
  );
}

export default Register;

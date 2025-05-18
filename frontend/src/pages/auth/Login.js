import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Link,useNavigate  } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {userlogin} from '../../redux/slices/userSlice';



function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    number: '',
    password: '',
    confirmPassword: '',
    city: '',
    pincode: '',
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

      axios.post('http://localhost:3300/api/user/login', formData)
      .then(res => {
        // console.log(("token", res.data.token));
        if(res.status===200 && res.data.token)
        {
          toast.success("Login successful!");

          localStorage.setItem("token", res.data.token);
          dispatch(userlogin(res.data.token));

          // Navigate to dashboard/home page
           navigate('/my-profile');
        }else{
          navigate('/login');
        }



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


    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-lg rounded-4 w-50 mt-5">
        <div className="card-body p-4">
          <h3 className="text-center mb-4">Login Form</h3>
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
                <label className="form-label">Number</label>
                <input
                  type="tel"
                  className="form-control"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  required
                />
              
            </div>

            <div className="row mb-3">
                <label className="form-label">password</label>
                <input
                  type="tel"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
            </div>

            <div className='text-center'>
              <button type="submit" className="btn btn-primary w-50">
                Login
              </button>
            </div>
              <p className="mt-2 mb-2">
                <Link to="/register">Register</Link>
              </p>

          </form>
        </div>
      </div>
    </div>
    </>
  );
}

export default Login;

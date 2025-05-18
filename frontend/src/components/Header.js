import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import {userlogin} from '../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';

function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector((state) => state.users.token);
    // console.log('ss'+token);

      const handleLogout = () => {
     // Optional: Clear token from storage and Redux
      localStorage.removeItem("token");
      dispatch(userlogin(null)); // Assuming userlogin(null) resets token
      navigate('/login');
    };

  return (
    <>
     <Navbar bg="danger" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/register">Register</Nav.Link>
            {token ? (
            <Nav.Link as={Link} to="/" onClick={handleLogout}>Logout</Nav.Link>
          ) : (
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
          )}
          </Nav>
        </Container>
      </Navbar>
    </>
  )
}

export default Header

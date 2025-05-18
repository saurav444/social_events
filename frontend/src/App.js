// import logo from './logo.svg';
// import './App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import Profile from './pages/auth/Profile';
import PrivateRoute from './PrivateRoute';


function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/my-profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

      </Routes>
    </>


  );
}

export default App;

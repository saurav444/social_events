
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {


//   const token = useSelector((state) => state.auth.token);
const token = localStorage.getItem("token"); 

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;

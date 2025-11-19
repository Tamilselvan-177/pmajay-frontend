import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is specified and user's role is not in the list, redirect to no-access
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/no-access" replace />;
  }

  // User is authenticated and authorized
  return children;
};

export default PrivateRoute;
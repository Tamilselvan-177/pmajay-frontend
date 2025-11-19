import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import NoAccess from './pages/NoAccess';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/no-access" element={<NoAccess />} />
        
        <Route
          path="/user"
          element={
            <PrivateRoute allowedRoles={['user', 'admin', 'superadmin']}>
              <UserDashboard />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={['admin', 'superadmin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/superadmin"
          element={
            <PrivateRoute allowedRoles={['superadmin']}>
              <SuperAdminDashboard />
            </PrivateRoute>
          }
        />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
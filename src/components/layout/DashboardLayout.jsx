import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { officerNavigation, collectorNavigation, primeMinisterNavigation } from '../../config/navigation';

const DashboardLayout = ({ children, userRole }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState('');
  const [userLocation, setUserLocation] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setUserLocation(storedRole === 'collector' ? 'DISTRICT' : storedRole === 'officer' ? 'BLOCK' : 'INDIA');
  }, []);

  const getNavigation = () => {
    switch (userRole) {
      case 'officer':
        return officerNavigation;
      case 'collector':
        return collectorNavigation;
      case 'primeminister':
        return primeMinisterNavigation;
      default:
        return officerNavigation;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        userRole={userRole}
        userName={userName}
        userLocation={userLocation}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          navigation={getNavigation()}
          isOpen={sidebarOpen}
          userRole={userRole}
        />
        
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

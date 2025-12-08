import { useState, useEffect } from 'react';
import { Menu, Globe, Bell, ChevronDown, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PmagyLogo from '../../../assests/pmagy_logo.jpg';

const Header = ({ onMenuToggle, userRole, userName, userLocation }) => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getRoleLabel = (role) => {
    const labels = {
      officer: 'Nodal Officer',
      collector: 'District Collector',
      primeminister: 'Prime Minister Office',
    };
    return labels[role] || 'User';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <header className="bg-gov-green-dark h-16 flex items-center justify-between px-4 shadow-lg border-b border-gov-green-700">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2 hover:bg-gov-green-700 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
        
        <div className="flex items-center gap-3">
          <img src={PmagyLogo} alt="PMAGY" className="w-10 h-10 object-contain rounded" />
          <div className="hidden md:block">
            <p className="text-white font-semibold text-sm">PMAGY</p>
            <p className="text-green-200 text-xs">Adarsh Gram Component</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 text-green-100 text-sm">
          <span>Last Login: {formatDateTime(currentTime)}</span>
        </div>

        <div className="flex items-center gap-2 text-white text-sm cursor-pointer hover:text-green-200 transition-colors">
          <Globe className="w-4 h-4" />
          <span>English</span>
          <ChevronDown className="w-3 h-3" />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 hover:bg-gov-green-700 px-3 py-2 rounded-lg transition-colors"
          >
            <div className="w-9 h-9 bg-gov-green-light rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-white font-semibold text-sm">{getRoleLabel(userRole)}</p>
              <p className="text-green-200 text-xs uppercase">{userLocation || 'INDIA'}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-white" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

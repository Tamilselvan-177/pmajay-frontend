import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Headphones, Mail, Phone } from 'lucide-react';
import PmagyLogo from '../../../assests/pmagy_logo.jpg';

const Sidebar = ({ navigation, isOpen, userRole }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const getRoleTitle = (role) => {
    const titles = {
      officer: 'Officer Panel',
      collector: 'Collector Panel',
      primeminister: 'PMO Dashboard',
    };
    return titles[role] || 'Dashboard';
  };

  return (
    <aside
      className={`bg-sidebar-bg h-screen flex flex-col transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-0 overflow-hidden'
      }`}
    >
      <div className="p-4 border-b border-gov-green-700">
        <div className="flex items-center gap-3">
          <img src={PmagyLogo} alt="PMAGY" className="w-12 h-12 object-contain rounded" />
          <div>
            <p className="text-white font-bold text-lg">PMAGY</p>
            <p className="text-green-300 text-xs">Adarsh Gram</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems[item.id];
            const isActive = isActiveRoute(item.path);

            if (hasChildren) {
              return (
                <li key={item.id}>
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sidebar-text hover:bg-sidebar-hover transition-colors ${
                      isExpanded ? 'bg-sidebar-hover' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  
                  {isExpanded && (
                    <ul className="mt-1 ml-4 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <NavLink
                            to={child.path}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                                isActive
                                  ? 'bg-sidebar-active text-white font-semibold'
                                  : 'text-sidebar-muted hover:bg-sidebar-hover hover:text-white'
                              }`
                            }
                          >
                            <ChevronRight className="w-3 h-3" />
                            <span>{child.label}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-sidebar-active text-white font-semibold'
                        : 'text-sidebar-text hover:bg-sidebar-hover'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gov-green-700 bg-gov-green-900">
        <div className="text-green-200">
          <p className="text-xs font-semibold mb-2 flex items-center gap-2">
            <Headphones className="w-4 h-4" />
            Technical Support:
          </p>
          <p className="text-xs text-green-300 mb-1">support[dot]pmagy-msje[at]gov[dot]in</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

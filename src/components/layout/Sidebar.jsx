import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = ({ navigation, isOpen, userRole, activeTab, onTabChange }) => {
  const location = useLocation();

  return (
    <aside
      className={`bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-0 overflow-hidden'
      }`}
    >
      <nav className="flex-1 py-6 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = item.tab 
              ? activeTab === item.tab 
              : location.pathname === item.path;

            if (item.tab && onTabChange) {
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onTabChange(item.tab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gov-green-600 text-white font-semibold shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            }

            return (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive: navActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      navActive || isActive
                        ? 'bg-gov-green-600 text-white font-semibold shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
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
    </aside>
  );
};

export default Sidebar;

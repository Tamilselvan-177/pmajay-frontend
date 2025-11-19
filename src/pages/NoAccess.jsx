import { useNavigate } from 'react-router-dom';

const NoAccess = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const handleGoBack = () => {
    if (role === 'superadmin') {
      navigate('/superadmin');
    } else if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'user') {
      navigate('/user');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Error Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-red-300 text-lg mb-2">403 - Forbidden</p>

          {/* Description */}
          <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
            <p className="text-gray-300 text-sm leading-relaxed">
              You don't have permission to access this page. Your current role is{' '}
              <span className="text-yellow-400 font-semibold">{role || 'unknown'}</span>.
            </p>
          </div>

          {/* Role Info */}
          <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
            <h3 className="text-white font-semibold mb-2 text-sm">Access Levels:</h3>
            <div className="space-y-2 text-left text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300"><span className="text-blue-400">User</span> - Basic access</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300"><span className="text-purple-400">Admin</span> - Management access</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-300"><span className="text-yellow-400">SuperAdmin</span> - Full access</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoBack}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition transform hover:scale-105 shadow-lg"
            >
              Go to My Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition border border-white/20"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Need access? Contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoAccess;
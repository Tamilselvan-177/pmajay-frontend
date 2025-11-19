import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/auth/superadmin', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h1 className="text-white text-xl font-bold">SuperAdmin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">
                Welcome, <span className="font-semibold">{username}</span>
              </span>
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs rounded-full font-medium">
                {role}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">SuperAdmin Control Center</h2>
              <p className="text-purple-100">Full system access and administrative privileges.</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-white mt-2">$124.5K</p>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-300 text-sm">↑ 23% from last month</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">System Uptime</p>
                <p className="text-3xl font-bold text-white mt-2">99.9%</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-300 text-sm">Last 30 days</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Admins</p>
                <p className="text-3xl font-bold text-white mt-2">45</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-blue-300 text-sm">↑ 3 new this week</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Security Alerts</p>
                <p className="text-3xl font-bold text-white mt-2">0</p>
              </div>
              <div className="bg-yellow-500 p-3 rounded-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-300 text-sm">All systems secure</span>
            </div>
          </div>
        </div>

        {/* API Response */}
        {loading ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center mb-8">
            <p className="text-white">Loading...</p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">API Response</h3>
            <pre className="bg-black/30 p-4 rounded-lg text-green-300 text-sm overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}

        {/* Advanced Management Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Configuration */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">System Configuration</h3>
            <div className="space-y-4">
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">Database Status</span>
                  <span className="px-2 py-1 bg-green-500/30 text-green-200 text-xs rounded-full">Online</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">API Health</span>
                  <span className="px-2 py-1 bg-green-500/30 text-green-200 text-xs rounded-full">Healthy</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">Storage</span>
                  <span className="px-2 py-1 bg-yellow-500/30 text-yellow-200 text-xs rounded-full">75%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg text-sm font-medium transition">
              Configure Settings
            </button>
          </div>

          {/* Role Management */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Role Management</h3>
            <div className="space-y-3">
              {[
                { role: 'SuperAdmin', count: 5, color: 'from-yellow-400 to-orange-500' },
                { role: 'Admin', count: 45, color: 'from-purple-400 to-pink-500' },
                { role: 'User', count: 1184, color: 'from-blue-400 to-cyan-500' },
              ].map((item, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 bg-gradient-to-r ${item.color} rounded-full`}></div>
                      <span className="text-white font-medium">{item.role}</span>
                    </div>
                    <span className="text-purple-200 text-sm">{item.count} users</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition">
              Manage Roles
            </button>
          </div>

          {/* Critical Actions */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Critical Actions</h3>
            <div className="space-y-3">
              <button className="w-full p-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-left transition group">
              
              </button>
              <button className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition flex items-center justify-between group">
                  <span className="font-medium">System Backup</span>
                  <span className="text-xs opacity-0 group-hover:opacity-100 transition">Execute →</span>
                </button>
                <button className="w-full px-4 py-3 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-lg transition flex items-center justify-between group">
                  <span className="font-medium">Reset All Passwords</span>
                  <span className="text-xs opacity-0 group-hover:opacity-100 transition">Execute →</span>
                </button>
                <button className="w-full px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition flex items-center justify-between group">
                  <span className="font-medium">Export All Data</span>
                  <span className="text-xs opacity-0 group-hover:opacity-100 transition">Execute →</span>
                </button>
                <button className="w-full px-4 py-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition flex items-center justify-between group">
                  <span className="font-medium">Audit System Logs</span>
                  <span className="text-xs opacity-0 group-hover:opacity-100 transition">Execute →</span>
                </button>
              </div>
            </div>

            {/* Analytics Overview */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Analytics Overview</h3>
              <div className="space-y-4">
                {[
                  { label: 'Daily Active Users', value: 856, max: 1000, color: 'bg-blue-500' },
                  { label: 'API Requests', value: 12453, max: 15000, color: 'bg-green-500' },
                  { label: 'Error Rate', value: 0.5, max: 5, color: 'bg-yellow-500' },
                  { label: 'Response Time (ms)', value: 120, max: 500, color: 'bg-purple-500' },
                ].map((metric, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{metric.label}</span>
                      <span className="text-white font-semibold">{metric.value}</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <div
                        className={`${metric.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${(metric.value / metric.max) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Global Activity Timeline</h3>
            <div className="space-y-4">
              {[
                { event: 'System backup completed successfully', time: '10 min ago', type: 'success', icon: '✓' },
                { event: 'New admin role assigned to john@example.com', time: '25 min ago', type: 'info', icon: 'i' },
                { event: 'Security scan completed - No threats detected', time: '1 hour ago', type: 'success', icon: '✓' },
                { event: 'Database optimization in progress', time: '2 hours ago', type: 'warning', icon: '⚠' },
                { event: '150+ new user registrations today', time: '3 hours ago', type: 'info', icon: 'i' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                    ${activity.type === 'success' ? 'bg-green-500/20 text-green-400' : ''}
                    ${activity.type === 'info' ? 'bg-blue-500/20 text-blue-400' : ''}
                    ${activity.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                  `}>
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.event}</p>
                    <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

export default SuperAdminDashboard;
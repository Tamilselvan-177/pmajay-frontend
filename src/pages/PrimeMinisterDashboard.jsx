import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, 
  TrendingUp, 
  MapPin, 
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  BarChart3
} from 'lucide-react';

const PrimeMinisterDashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState('all');

  useEffect(() => {
    fetchAllDocuments();
  }, [stateFilter]);

  const fetchAllDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/documents/all${stateFilter !== 'all' ? `?state=${stateFilter}` : ''}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(response.data.documents);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Prime Minister Dashboard</h1>
                <p className="text-sm text-gray-500">PM-AJAY National Control Center</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{username}</div>
                <div className="text-xs text-gray-500 capitalize">{role}</div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl p-8 mb-8 shadow-xl">
          <h2 className="text-4xl font-bold text-white mb-2">Welcome, Prime Minister</h2>
          <p className="text-yellow-100 text-lg">National Infrastructure & Governance Monitoring System</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats && [
            { 
              label: 'Total Documents', 
              value: stats.total, 
              color: 'from-blue-400 to-blue-500',
              icon: FileText
            },
            { 
              label: 'Pending Review', 
              value: stats.pending, 
              color: 'from-yellow-400 to-yellow-500',
              icon: Clock
            },
            { 
              label: 'Approved', 
              value: stats.approved, 
              color: 'from-green-400 to-green-500',
              icon: CheckCircle
            },
            { 
              label: 'Rejected', 
              value: stats.rejected, 
              color: 'from-red-400 to-red-500',
              icon: XCircle
            },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className={`bg-gradient-to-br ${stat.color} text-white p-6 rounded-xl shadow-lg`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold opacity-90">{stat.label}</div>
                  <Icon className="w-6 h-6 opacity-80" />
                </div>
                <div className="text-4xl font-bold">{stat.value}</div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/primeminister/national-projects')}
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105 text-left"
          >
            <TrendingUp className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-bold mb-1">National Projects</h3>
            <p className="text-sm opacity-90">Monitor all infrastructure projects</p>
          </button>

          <button
            onClick={() => navigate('/primeminister/state-overview')}
            className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105 text-left"
          >
            <MapPin className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-bold mb-1">State Overview</h3>
            <p className="text-sm opacity-90">View state-wise performance</p>
          </button>

          <button
            onClick={() => navigate('/primeminister/analytics')}
            className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105 text-left"
          >
            <BarChart3 className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-bold mb-1">Analytics & Reports</h3>
            <p className="text-sm opacity-90">Detailed insights and metrics</p>
          </button>
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">All National Documents</h2>
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 font-semibold"
                >
                  <option value="all">All States</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Documents Found</h3>
              <p className="text-gray-500">No documents match the current filter</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Document</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Officer</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Collector</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Budget</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {documents.map((doc) => (
                    <tr key={doc._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{doc.title}</div>
                            <div className="text-xs text-gray-500">{doc.documentType}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{doc.submittedBy?.fullName || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{doc.block}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{doc.assignedCollector?.fullName || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{doc.district}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{doc.village}</div>
                        <div className="text-xs text-gray-500">{doc.state}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-900">
                          ₹{(doc.projectBudget / 100000).toFixed(1)}L
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                          doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          doc.status === 'under-review' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrimeMinisterDashboard;
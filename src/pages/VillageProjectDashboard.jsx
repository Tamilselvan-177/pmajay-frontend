import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ArrowLeft,
  School,
  Heart,
  Droplet,
  Zap,
  Truck,
  Wifi,
  Building2,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  IndianRupee
} from 'lucide-react';

const VillageProjectDashboard = () => {
  const { villageId } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [villageId]);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/projects/village/${villageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // FIXED — valid JS object mapping
  const getProjectIcon = (name) => {
    const iconMap = {
      School: School,
      Health: Heart,
      Water: Droplet,
      Electricity: Zap,
      Road: Truck,
      Internet: Wifi,
      Bank: Building2
    };
    return iconMap[name] || Building2;
  };

  const getProjectColor = (name) => {
    const colors = {
      School: 'from-blue-400 to-blue-600',
      Health: 'from-red-400 to-red-600',
      Water: 'from-cyan-400 to-cyan-600',
      Electricity: 'from-yellow-400 to-yellow-600',
      Road: 'from-gray-400 to-gray-600',
      Internet: 'from-purple-400 to-purple-600',
      Bank: 'from-green-400 to-green-600'
    };
    return colors[name] || 'from-gray-400 to-gray-600';
  };

  const getStatusIcon = (status) => {
    if (status === 'accepted') return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (status === 'rejected') return <XCircle className="w-5 h-5 text-red-500" />;
    if (status === 'progress') return <TrendingUp className="w-5 h-5 text-blue-500" />;
    return <Clock className="w-5 h-5 text-gray-400" />;
  };

  const getStatusColor = (status) => {
    if (status === 'accepted') return 'bg-green-100 text-green-800';
    if (status === 'rejected') return 'bg-red-100 text-red-800';
    if (status === 'progress') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-600';
  };

  // Sample data fallback
  const sampleProjects = [
    {
      _id: '1',
      projectName: 'School',
      budget: 5000000,
      expenditure: 2500000,
      statuses: {
        requesting: 'accepted',
        acknowledgement: 'accepted',
        fundsAllocated: 'accepted',
        workAssigned: 'accepted',
        workInProgress: { status: 'progress', percentage: 60 },
        completed: 'pending',
      }
    },
    {
      _id: '2',
      projectName: 'Health',
      budget: 3000000,
      expenditure: 1500000,
      statuses: {
        requesting: 'accepted',
        acknowledgement: 'accepted',
        fundsAllocated: 'accepted',
        workAssigned: 'pending',
        workInProgress: { status: 'pending', percentage: 0 },
        completed: 'pending',
      }
    }
  ];

  const displayProjects = projects.length > 0 ? projects : sampleProjects;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      {/* Header */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/officer/projects')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Villages
          </button>
        </div>
      </nav>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Village Project Monitoring</h1>
          <p className="text-gray-600">Track progress of all infrastructure projects</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-6">

            {displayProjects.map((project) => {
              const Icon = getProjectIcon(project.projectName);
              const color = getProjectColor(project.projectName);

              return (
                <div key={project._id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

                  {/* Project Header */}
                  <div className={`bg-gradient-to-r ${color} px-6 py-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">{project.projectName} Development</h2>
                          <p className="text-white/80 text-sm">Infrastructure Project</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white/90 text-sm font-semibold">Overall Progress</div>
                        <div className="text-3xl font-bold text-white">
                          {project.statuses.workInProgress.percentage}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Budget Section */}
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-600 mb-1">Total Budget</div>
                        <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                          <IndianRupee className="w-5 h-5" />
                          {(project.budget / 100000).toFixed(1)}L
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-semibold text-gray-600 mb-1">Expenditure</div>
                        <div className="flex items-center gap-1 text-lg font-bold text-blue-600">
                          <IndianRupee className="w-5 h-5" />
                          {(project.expenditure / 100000).toFixed(1)}L
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-semibold text-gray-600 mb-1">Remaining</div>
                        <div className="flex items-center gap-1 text-lg font-bold text-green-600">
                          <IndianRupee className="w-5 h-5" />
                          {((project.budget - project.expenditure) / 100000).toFixed(1)}L
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Project Timeline</h3>

                    <div className="space-y-4">

                      {/* --- REPEATED SECTIONS CLEAN --- */}
                      {[
                        { key: "requesting", label: "Requesting" },
                        { key: "acknowledgement", label: "Acknowledgement" },
                        { key: "fundsAllocated", label: "Funds Allocated" },
                        { key: "workAssigned", label: "Work Assigned" }
                      ].map(({ key, label }) => (
                        <div className="flex items-center gap-4" key={key}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            project.statuses[key] === 'accepted'
                              ? 'bg-green-100'
                              : project.statuses[key] === 'rejected'
                              ? 'bg-red-100'
                              : 'bg-gray-100'
                          }`}>
                            {getStatusIcon(project.statuses[key])}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-gray-900">{label}</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(project.statuses[key])}`}>
                                {project.statuses[key]}
                              </span>
                            </div>

                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  project.statuses[key] === 'accepted'
                                    ? 'bg-green-500'
                                    : project.statuses[key] === 'rejected'
                                    ? 'bg-red-500'
                                    : 'bg-gray-400'
                                }`}
                                style={{
                                  width: project.statuses[key] === 'pending' ? '50%' : '100%'
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Work in Progress */}
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          project.statuses.workInProgress.status === 'progress'
                            ? 'bg-blue-100'
                            : 'bg-gray-100'
                        }`}>
                          {getStatusIcon(project.statuses.workInProgress.status)}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-gray-900">Work In Progress</span>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                              {project.statuses.workInProgress.percentage}% Complete
                            </span>
                          </div>

                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 transition-all duration-500"
                              style={{
                                width: `${project.statuses.workInProgress.percentage}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Completed FIXED JSX */}
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          project.statuses.completed === 'accepted'
                            ? 'bg-green-100'
                            : 'bg-gray-100'
                        }`}>
                          {getStatusIcon(project.statuses.completed)}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-gray-900">Completed</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(project.statuses.completed)}`}>
                              {project.statuses.completed}
                            </span>
                          </div>

                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                project.statuses.completed === 'accepted'
                                  ? 'bg-green-500'
                                  : 'bg-gray-400'
                              }`}
                              style={{
                                width: project.statuses.completed === 'pending' ? '0%' : '100%'
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Button */}
                  <div className="px-6 pb-6">
                    <button
                      onClick={() => navigate(`/officer/project/${project._id}`)}
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-bold transition"
                    >
                      View Full Details & Submit Updates
                    </button>
                  </div>

                </div>
              );
            })}

          </div>
        )}
      </div>
    </div>
  );
};

export default VillageProjectDashboard;

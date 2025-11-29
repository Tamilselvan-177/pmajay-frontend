// src/pages/OfficerVerificationList.jsx (Black & White Theme)
import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, NavLink } from "react-router-dom";
import { 
  CheckCircle, Clock, MapPin, AlertTriangle, Map, Eye, Shield, 
  Building2, FileText
} from "lucide-react";

const OfficerVerificationList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/verifications/map");
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      alert("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      not_started: "bg-gray-200 text-gray-800",
      in_progress: "bg-gray-300 text-gray-900",
      completed: "bg-gray-400 text-black",
      delayed: "bg-gray-300 text-gray-800"
    };
    return colors[status] || "bg-gray-200 text-gray-800";
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white text-black">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-300 shadow-sm p-5 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-5 flex items-center gap-2 text-black">
          <Building2 className="text-black" /> Officer Panel
        </h2>
        <div className="space-y-2 mb-6">
          <NavLink
            to="/officer"
            className={({ isActive }) =>
              `w-full block p-3 rounded-lg font-semibold flex items-center gap-2 transition ${
                isActive ? "bg-black text-white shadow-md" : "text-black hover:bg-gray-100"
              }`
            }
            end
          >
            <FileText size={18} /> Project Requests
          </NavLink>
          <NavLink
            to="/officer/verification"
            className={({ isActive }) =>
              `w-full block p-3 rounded-lg font-semibold flex items-center gap-2 transition ${
                isActive ? "bg-black text-white shadow-md" : "text-black hover:bg-gray-100"
              }`
            }
          >
            <Shield size={18} /> Verification
          </NavLink>
          <NavLink
            to="/officer/verification/map"
            className={({ isActive }) =>
              `w-full block p-3 rounded-lg font-semibold flex items-center gap-2 transition ${
                isActive ? "bg-black text-white shadow-md" : "text-black hover:bg-gray-100"
              }`
            }
          >
            <MapPin size={18} /> District Map
          </NavLink>
        </div>

        {/* Quick Stats */}
        <div className="space-y-3 mb-6 p-4 bg-gray-100 rounded-xl border border-gray-300 text-black">
          <h3 className="font-semibold flex items-center gap-2">
            <Shield size={20} /> Verification Stats
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Total Projects: <span className="font-bold">{projects.length}</span></div>
            <div>Overdue: <span className="font-bold">{projects.filter(p => p.needsVerification).length}</span></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Top Nav Bar */}
        <div className="bg-white shadow border-b border-gray-300 px-8 py-4">
          <div className="flex items-center gap-4">
            <NavLink
              to="/officer"
              className={({ isActive }) => `px-6 py-3 font-semibold rounded-lg transition flex items-center gap-2 ${
                isActive ? "bg-black text-white shadow-sm" : "text-black hover:bg-gray-100"
              }`}
              end
            >
              <FileText size={18} /> Project Requests
            </NavLink>
            <NavLink
              to="/officer/verification"
              className={({ isActive }) => `px-6 py-3 font-semibold rounded-lg transition flex items-center gap-2 ${
                isActive ? "bg-black text-white shadow-sm" : "text-black hover:bg-gray-100"
              }`}
            >
              <Shield size={18} /> Verification
            </NavLink>
            <NavLink
              to="/officer/verification/map"
              className={({ isActive }) => `px-6 py-3 font-semibold rounded-lg transition flex items-center gap-2 ${
                isActive ? "bg-black text-white shadow-sm" : "text-black hover:bg-gray-100"
              }`}
            >
              <MapPin size={18} /> District Map
            </NavLink>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 overflow-auto h-[calc(100vh-140px)] bg-white text-black">
          <div>
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
                  <Shield className="w-12 h-12 text-black" />
                  Project Verification
                </h1>
                <p className="text-black">
                  {projects.length} project{projects.length !== 1 ? "s" : ""} in your block
                </p>
              </div>

              {/* Map Button */}
              <button
                onClick={() => navigate("/officer/verification/map")}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition font-semibold shadow-lg hover:shadow-xl"
              >
                <Map size={20} />
                View on Map
              </button>
            </div>

            {/* Projects List */}
            {projects.length === 0 ? (
              <div className="bg-gray-100 p-8 rounded-xl border-2 border-gray-300 text-center text-black">
                <AlertTriangle className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                <p className="text-xl font-semibold mb-2">No projects found in your block</p>
                <p>Projects will appear here once assigned to your jurisdiction</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {projects.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => navigate(`/officer/project/${p._id}/verification`)}
                    className="bg-white p-6 border-2 border-gray-300 rounded-xl shadow-sm hover:shadow-md hover:border-black cursor-pointer transition-all group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h2 className="text-xl font-bold text-black group-hover:text-gray-800">
                              {p.projectName}
                            </h2>
                            <p className="text-gray-700 mt-1">
                              {p.village?.name} • {p.schemeName || "No scheme assigned"}
                            </p>
                          </div>
                          
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ml-3 ${getStatusColor(p.currentStatus)}`}>
                            {p.currentStatus?.replace("_", " ").toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="mt-4 flex flex-wrap gap-3 text-sm mb-4">
                          <span className="flex items-center gap-1 text-gray-800 bg-gray-200 px-2 py-1 rounded-md">
                            <CheckCircle size={16} />
                            {p.verificationCount || 0} Verifications
                          </span>

                          <span className="flex items-center gap-1 text-gray-800 bg-gray-200 px-2 py-1 rounded-md">
                            <Clock size={16} />
                            {p.verificationFrequency || "weekly"}
                          </span>

                          {p.location && (
                            <span className="flex items-center gap-1 text-black bg-gray-300 px-2 py-1 rounded-md font-semibold">
                              <MapPin size={16} />
                              GPS Tracked
                            </span>
                          )}
                        </div>

                        {p.needsVerification && (
                          <div className="mb-4 flex items-center gap-2 text-black text-sm bg-gray-300 p-3 rounded-lg border border-gray-400">
                            <AlertTriangle size={18} />
                            <span className="font-bold">
                              Verification Overdue ({p.verificationOverdueDays} days)
                            </span>
                          </div>
                        )}

                        {p.lastVerifiedAt && (
                          <p className="mb-3 text-sm text-gray-700">
                            Last verified: {new Date(p.lastVerifiedAt).toLocaleDateString()}
                          </p>
                        )}

                        {p.latestVerification && (
                          <div className="mb-4 p-4 bg-gray-200 border border-gray-400 rounded-lg">
                            <p className="text-xs font-semibold mb-2">
                              Latest Update:
                            </p>
                            <p className="text-sm mb-1">
                              {p.latestVerification.description}
                            </p>
                            <p className="text-xs">
                              By {p.latestVerification.verifiedBy?.fullName}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="text-right ml-6">
                        <div className="text-4xl font-bold text-black group-hover:text-gray-800">
                          {p.currentProgress || 0}%
                        </div>
                        <p className="text-sm text-gray-700 mt-1">Progress</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-300">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-black h-3 rounded-full transition-all group-hover:shadow-md"
                          style={{ width: `${p.currentProgress || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerVerificationList;

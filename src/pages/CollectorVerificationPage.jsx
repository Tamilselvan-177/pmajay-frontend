// src/pages/CollectorVerificationPage.jsx - Black & White + Green/Red Theme
import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import api from "../api";
import {
  ShieldCheck, XCircle, Trash2, Clock, MapPin, FileText, ChevronLeft,
  AlertTriangle, Award, User, Calendar, IndianRupee, Search, Filter, Building2,
  Home, ChevronRight, CheckCircle
} from "lucide-react";

const CollectorVerificationPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [verificationsLoading, setVerificationsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/verifications/projects");
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error("Error fetching verification projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVerifications = async (projectId) => {
    setVerificationsLoading(true);
    try {
      const res = await api.get(`/api/verifications/project/${projectId}`);
      setVerifications(res.data.verifications || []);
    } catch (err) {
      console.error("Error fetching verifications:", err);
    } finally {
      setVerificationsLoading(false);
    }
  };

  const handleDeleteVerification = async (verificationId) => {
    if (!window.confirm("Are you sure you want to delete this verification? This action cannot be undone.")) return;
    try {
      await api.delete(`/api/verifications/delete/${verificationId}`);
      alert("✅ Verification deleted successfully!");
      if (selectedProject) {
        fetchVerifications(selectedProject._id);
      }
    } catch (err) {
      alert("❌ Failed to delete verification: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchVerifications(selectedProject._id);
    } else {
      setVerifications([]);
    }
  }, [selectedProject]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black"></div>
      </div>
    );
  }

  const filteredProjects = projects.filter(project =>
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.village?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const config = {
      in_progress: { bg: "bg-gray-200", text: "text-gray-800", icon: Clock, label: "In Progress" },
      completed: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle, label: "Completed" },
      stalled: { bg: "bg-gray-300", text: "text-gray-900", icon: Clock, label: "Stalled" },
      issues: { bg: "bg-red-100", text: "text-red-800", icon: AlertTriangle, label: "Issues" }
    };
    return config[status] || config.in_progress;
  };

  return (
    <div className="flex h-screen bg-white text-black">
      {/* SIDEBAR - Black & White */}
      <div className="w-80 bg-white border-r border-gray-300 shadow-sm p-5 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-5 flex items-center gap-2 text-black">
          <Building2 className="text-black" /> Collector Panel
        </h2>

        <div className="space-y-2 mb-6">
          <NavLink
            to="/collector"
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
            to="/collector/verification"
            className={({ isActive }) =>
              `w-full block p-3 rounded-lg font-semibold flex items-center gap-2 transition ${
                isActive ? "bg-black text-white shadow-md" : "text-black hover:bg-gray-100"
              }`
            }
          >
            <ShieldCheck size={18} /> Verification
          </NavLink>
        </div>

        <div className="space-y-3 mb-6 p-4 bg-gray-100 rounded-xl border border-gray-300">
          <h3 className="font-semibold flex items-center gap-2 text-black">
            <ShieldCheck size={20} /> Verification Stats
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Total Projects: <span className="font-bold">{projects.length}</span></div>
            <div>Pending Verifs: <span className="font-bold text-red-600">{projects.filter(p => p.needsVerification).length}</span></div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-hidden">
        <div className="bg-white shadow border-b border-gray-300 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all text-black"
                title="Go Back"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-4">
                <NavLink
                  to="/collector"
                  className={({ isActive }) =>
                    `px-6 py-3 font-semibold rounded-lg transition flex items-center gap-2 ${
                      isActive
                        ? "bg-black text-white shadow-sm"
                        : "text-black hover:bg-gray-100"
                    }`
                  }
                  end
                >
                  <FileText className="w-4 h-4" />
                  Project Requests
                </NavLink>
                <NavLink
                  to="/collector/verification"
                  className={({ isActive }) =>
                    `px-6 py-3 font-semibold rounded-lg transition flex items-center gap-2 ${
                      isActive
                        ? "bg-black text-white shadow-sm"
                        : "text-black hover:bg-gray-100"
                    }`
                  }
                >
                  <ShieldCheck className="w-4 h-4" />
                  Verification
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 overflow-auto h-[calc(100vh-140px)] bg-white">
          <div>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold flex items-center gap-3 text-black">
                <ShieldCheck size={40} className="text-black" />
                Verification Dashboard
              </h1>
            </div>

            <div className="flex gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search projects or villages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-4 focus:ring-gray-200 focus:border-black shadow-sm transition-all text-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[70vh]">
              {/* PROJECTS LIST - LEFT PANEL */}
              <div className="bg-white border-2 border-gray-300 rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-black text-white p-6">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <FileText size={28} />
                    Projects ({filteredProjects.length})
                  </h2>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(100%-100px)]">
                  {filteredProjects.length === 0 ? (
                    <div className="text-center py-12 text-gray-600">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg">No projects found</p>
                      <p className="text-sm">Try adjusting your search</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredProjects.map((project) => {
                        const badge = getStatusBadge(project.currentStatus);
                        const BadgeIcon = badge.icon;
                        return (
                          <div
                            key={project._id}
                            onClick={() => setSelectedProject(project)}
                            className={`group p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md hover:border-black ${
                              selectedProject?._id === project._id
                                ? "border-black bg-gray-50 shadow-xl"
                                : "border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-xl font-bold text-black group-hover:text-gray-900">
                                {project.projectName}
                              </h3>
                              <div className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${badge.bg} ${badge.text}`}>
                                <BadgeIcon size={14} /> {badge.label}
                              </div>
                            </div>
                            <p className="text-gray-700 mb-4">{project.village?.name || "Unknown Village"}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-gray-700">
                                <span>Budget: ₹{project.budget?.toLocaleString()}</span>
                                <span>Progress: <span className="font-bold text-green-600">{project.currentProgress || 0}%</span></span>
                              </div>
                              <div className="flex items-center gap-2 text-xs bg-gray-200 px-3 py-1 rounded-full font-semibold text-black">
                                <ShieldCheck size={14} />
                                {project.verificationCount || 0} verifs
                              </div>
                            </div>
                            {project.needsVerification && (
                              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-xs text-red-800 font-semibold flex items-center gap-1">
                                  <AlertTriangle size={14} />
                                  Verification needed ({project.verificationOverdueDays || 0} days overdue)
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* VERIFICATION DETAILS - RIGHT PANEL */}
              <div className="bg-white border-2 border-gray-300 rounded-2xl shadow-sm overflow-hidden">
                {selectedProject ? (
                  <>
                    <div className="bg-black text-white p-6 sticky top-0 z-10">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold">{selectedProject.projectName}</h2>
                          <p className="text-gray-200">{selectedProject.village?.name}</p>
                        </div>
                        <button
                          onClick={() => setSelectedProject(null)}
                          className="p-2 hover:bg-gray-800 rounded-lg transition-all text-white"
                          title="Close"
                        >
                          <XCircle size={24} />
                        </button>
                      </div>
                    </div>

                    <div className="p-6 overflow-y-auto max-h-[calc(100%-120px)]">
                      {verificationsLoading ? (
                        <div className="flex items-center justify-center h-64">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-black"></div>
                          <span className="ml-3 text-lg text-gray-700">Loading verifications...</span>
                        </div>
                      ) : verifications.length === 0 ? (
                        <div className="text-center py-20 text-gray-600">
                          <ShieldCheck className="w-20 h-20 mx-auto mb-6 text-gray-400" />
                          <h3 className="text-2xl font-bold mb-2 text-gray-800">No Verifications Yet</h3>
                          <p className="text-lg">No verification records found for this project.</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {verifications.map((verif) => (
                            <div key={verif._id} className="group border border-gray-300 rounded-xl p-6 bg-gray-50 hover:shadow-md hover:border-black transition-all">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <h4 className="font-bold text-xl mb-2 text-black">
                                    {verif.description || `Verification #${verif.verificationNumber}`}
                                  </h4>
                                  <div className="flex items-center gap-4 text-sm mb-2">
                                    <span className="font-semibold text-green-700">
                                      {verif.progressPercentage}%
                                    </span>
                                    <span className="px-2 py-1 bg-gray-200 text-black rounded-full text-xs font-medium">
                                      {verif.workStatus.replace("_", " ").toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDeleteVerification(verif._id)}
                                  className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 text-sm shadow-sm hover:shadow-md transition-all ml-4 opacity-0 group-hover:opacity-100"
                                  title="Delete Verification"
                                >
                                  <Trash2 size={16} />
                                  Delete
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
                                <div>
                                  <span className="text-gray-600">Verified By:</span>
                                  <p className="font-semibold text-black">{verif.verifiedBy?.fullName || "Unknown"}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Date:</span>
                                  <p className="font-semibold text-black">
                                    {new Date(verif.createdAt).toLocaleDateString()} {new Date(verif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </p>
                                </div>
                                {verif.location?.address && (
                                  <div className="md:col-span-2">
                                    <span className="text-gray-600">Location:</span>
                                    <p className="font-semibold flex items-center gap-2 mt-1 text-black">
                                      <MapPin size={16} />
                                      {verif.location.address}
                                    </p>
                                  </div>
                                )}
                                {verif.issues && (
                                  <div className="md:col-span-2">
                                    <span className="text-gray-600">Issues:</span>
                                    <p className="font-semibold text-red-800 mt-1 bg-red-50 p-2 rounded-lg">
                                      {verif.issues}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {verif.photo?.fileUrl && (
                                <div className="border-2 border-gray-300 rounded-xl overflow-hidden shadow-sm">
                                  <img
                                    src={`http://localhost:5000${verif.photo.fileUrl}`}
                                    alt="Verification photo"
                                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="bg-black text-white text-xs p-2 text-center">
                                    📸 Photo evidence ({verif.photo.fileSize ? `${(verif.photo.fileSize/1024/1024).toFixed(1)}MB` : 'N/A'})
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-50">
                    <div className="text-center text-gray-600 max-w-md">
                      <ShieldCheck className="w-24 h-24 mx-auto mb-6 text-gray-400" />
                      <h3 className="text-2xl font-bold mb-4 text-gray-800">Select a Project</h3>
                      <p className="text-lg">Click on any project from the left panel to view its verification history and manage records.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectorVerificationPage;

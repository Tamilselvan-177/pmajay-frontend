// src/pages/CollectorDashboard.jsx - ✅ PROPER JSX ALIGNMENT FIXED
import React, { useState, useEffect } from "react";
import api from "../api";
import DocumentReviewModal from "./CollectorDocView";
import { useNavigate, NavLink } from "react-router-dom";
import {
  FileText, CheckCircle, XCircle, Clock, FileCheck, Building2, Home,
  Award, Plus, ChevronRight, AlertCircle, ShieldCheck, MapPin, Filter, Search, X
} from "lucide-react";

const CollectorDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [schemeFilters, setSchemeFilters] = useState({ category: "", budget: "" });
  const [schemeSearch, setSchemeSearch] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [heatmapLoading, setHeatmapLoading] = useState(false);
  const [gapInsights, setGapInsights] = useState([]);
  const navigate = useNavigate();

  const fetchOfficers = async () => {
    try {
      const res = await api.get("/api/projects/collector/officers");
      setOfficers(res.data.officers || []);
    } catch (err) {
      console.error("Error loading officers", err);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/projects/collector/requests");
      setProjects(res.data.requests || []);
      if (selectedProject) {
        const updated = res.data.requests.find(p => p._id === selectedProject._id);
        if (updated) setSelectedProject(updated);
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredSchemes = async (category = "", budget = "") => {
    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (budget) params.append("budget", budget);
      const res = await api.get(`/api/projects/schemes/filtered?${params}`);
      setSchemes(res.data.schemes || []);
    } catch (err) {
      console.error("Error loading schemes:", err);
      setSchemes([]);
    }
  };

  const fetchCollectorHeatmap = async () => {
    try {
      setHeatmapLoading(true);
      const res = await api.get("/api/dashboard/heatmap");
      setDashboardData(res.data);

      const priorityVillages = res.data.heatmapData
        ?.filter(v => v.color === "red" || v.color === "yellow")
        ?.slice(0, 6) || [];

      const insights = priorityVillages.map(v => {
        const gaps = Object.entries(v.readiness?.domainScores || {})
          .filter(([_, d]) => d.percentage < 50)
          .sort((a, b) => b[1].gap - a[1].gap)
          .slice(0, 3)
          .map(([key, d]) => ({
            domain: key,
            gapPercent: 100 - d.percentage,
            cost: Math.round(d.gap * 50000)
          }));

        const totalCost = gaps.reduce((sum, g) => sum + g.cost, 0);
        return {
          villageName: v.villageName,
          color: v.color,
          readiness: v.readiness?.overallReadiness || 0,
          priority: v.priority,
          gaps,
          totalCost
        };
      });

      setGapInsights(insights);
    } catch (err) {
      console.error("Error loading collector heatmap:", err);
    } finally {
      setHeatmapLoading(false);
    }
  };

  const handleCollectorSchemeAction = async (action, schemeId = null) => {
    try {
      setLoading(true);
      const payload = { action };
      if (schemeId) payload.schemeId = schemeId;

      const res = await api.put(`/api/projects/collector/request/${selectedProject._id}/scheme`, payload);

      if (res.data.success) {
        alert(`✅ ${res.data.message}`);
        setShowSchemeModal(false);
        setSchemeFilters({ category: "", budget: "" });
        setSchemeSearch("");
        await fetchProjects();
      }
    } catch (err) {
      console.error("Scheme action failed:", err);
      const errorMsg = err.response?.data?.message || "Scheme action failed";
      alert(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      const allDocsApproved = selectedProject.documents.every(doc => doc.status === "approved");
      if (!allDocsApproved) {
        alert("Please approve all documents before approving the project.");
        setShowApprovalModal(false);
        return;
      }

      await api.put(`/api/projects/request/${selectedProject._id}/review`, {
        decision: "approved",
        reason: reviewNote
      });

      alert("✅ Project approved successfully!");
      setShowApprovalModal(false);
      setReviewNote("");
      setSelectedProject(null);
      await fetchProjects();
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Approval failed"));
    }
  };

  const handleReject = async () => {
    try {
      if (!reviewNote.trim()) {
        alert("Please provide a rejection reason.");
        return;
      }

      await api.put(`/api/projects/request/${selectedProject._id}/review`, {
        decision: "rejected",
        reason: reviewNote
      });

      alert("✅ Project rejected.");
      setShowApprovalModal(false);
      setReviewNote("");
      setSelectedProject(null);
      await fetchProjects();
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Rejection failed"));
    }
  };

  useEffect(() => {
    fetchOfficers();
    fetchProjects();
    fetchFilteredSchemes();
    fetchCollectorHeatmap();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesStatus = filterStatus === "all" || project.status === filterStatus;
    const matchesSearch =
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.village?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    if (selectedOfficer) {
      return matchesStatus && matchesSearch && project.requestedBy._id === selectedOfficer;
    }
    return matchesStatus && matchesSearch;
  });

  const filteredSchemes = schemes.filter(scheme =>
    scheme.schemeName.toLowerCase().includes(schemeSearch.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const config = {
      pending: { bg: "bg-gray-200", text: "text-gray-800", icon: Clock, label: "Pending" },
      approved: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle, label: "Approved" },
      rejected: { bg: "bg-red-100", text: "text-red-800", icon: XCircle, label: "Rejected" }
    };
    return config[status] || config.pending;
  };

  const categories = [
    { value: "health", label: "🏥 Health/Hospital" },
    { value: "road", label: "🛣️ Road/Infrastructure" },
    { value: "water", label: "💧 Water/Jal Jeevan" },
    { value: "education", label: "📚 Education/School" },
    { value: "housing", label: "🏠 Housing/Awas" },
    { value: "agriculture", label: "🌾 Agriculture/Farming" },
    { value: "sanitation", label: "🚽 Sanitation/Swachh" },
    { value: "employment", label: "💼 Employment/MGNREGA" },
    { value: "electricity", label: "⚡ Electricity/Solar" },
    { value: "women", label: "♀️ Women Welfare" },
    { value: "sports", label: "⚽ Sports/Stadium" }
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white text-black">
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r border-gray-300 shadow-sm p-5 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-black">
          <Building2 className="text-black" />
          Collector Panel
        </h2>

        <div className="space-y-1 mb-8">
          <NavLink
            to="/collector"
            className={({ isActive }) =>
              `w-full block p-3 rounded-lg font-semibold flex items-center gap-2 transition ${isActive ? "bg-black text-white shadow-md" : "text-black hover:bg-gray-100"
              }`
            }
            end
          >
            <FileText size={18} />
            Project Requests
          </NavLink>
          <NavLink
            to="/collector/verification"
            className={({ isActive }) =>
              `w-full block p-3 rounded-lg font-semibold flex items-center gap-3 transition ${isActive ? "bg-black text-white shadow-md" : "text-black hover:bg-gray-100"
              }`
            }
          >
            <ShieldCheck size={20} />
            Verification
          </NavLink>
          <NavLink
            to="/collector/verification/map"
            className={({ isActive }) =>
              `w-full block p-3 rounded-lg font-semibold flex items-center gap-3 transition ${isActive ? "bg-black text-white shadow-md" : "text-black hover:bg-gray-100"
              }`
            }
          >
            <MapPin size={20} />
            District Map
          </NavLink>
        </div>

        <div className="h-px bg-gray-200 my-4"></div>

        <div className="mb-4">
          <button
            onClick={() => setSelectedOfficer(null)}
            className={`w-full p-3 rounded-lg mb-2 font-semibold ${!selectedOfficer ? "bg-black text-white" : "bg-gray-100 text-black"
              }`}
          >
            All Officers
          </button>
        </div>

        <h3 className="font-semibold text-black mb-3">Villages & Officers</h3>
        {officers.map((off) => (
          <button
            key={off._id}
            onClick={() => setSelectedOfficer(off._id)}
            className={`w-full flex items-center justify-between p-3 rounded-lg border mb-2 ${selectedOfficer === off._id ? "bg-gray-100 border-black" : "hover:bg-gray-50 border-gray-300"
              }`}
          >
            <div className="flex items-center gap-3">
              <Home className="text-black" />
              <div>
                <p className="font-bold text-black">{off.fullName}</p>
                <p className="text-sm text-gray-700">{off.village?.name}</p>
              </div>
            </div>
            <ChevronRight className="text-black" />
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-hidden">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Project Requests</h1>
        </div>

        <div className="p-8 overflow-auto h-[calc(100vh-140px)] bg-white text-black">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-3 text-black">Gap Identification</h2>
            {heatmapLoading ? (
              <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl text-center">
                <p className="text-gray-700">Loading gap insights...</p>
              </div>
            ) : gapInsights.length === 0 ? (
              <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl text-center">
                <p className="text-gray-700">No critical gaps identified</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gapInsights.map((item, idx) => (
                  <div key={idx} className="p-6 border-2 border-gray-200 rounded-2xl hover:shadow-lg transition bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-bold text-lg text-black">{item.villageName}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.color === 'red' ? 'bg-red-100 text-red-800' : item.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{(item.priority || 'unknown').toUpperCase()}</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-700">Readiness</span>
                      <span className="font-bold text-black">{item.readiness}%</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      {item.gaps.map((g, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-gray-800">{g.domain.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="font-semibold text-red-700">-{Math.round(g.gapPercent)}%</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-sm text-gray-700">Estimated Budget</span>
                      <span className="font-bold text-black">₹{item.totalCost.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>


          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search project or village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-black"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 text-black"
            >
              <option value="all">All</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg">No projects found</p>
              </div>
            ) : (
              filteredProjects.map((project) => {
                const badge = getStatusBadge(project.status);
                const BadgeIcon = badge.icon;
                const docsApproved = project.documents?.filter(d => d.status === "approved").length || 0;
                const docsTotal = project.documents?.length || 0;

                return (
                  <div
                    key={project._id}
                    onClick={() => setSelectedProject(project)}
                    className={`bg-white p-6 border-2 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all ${selectedProject?._id === project._id ? "border-black ring-2 ring-black/20" : "border-gray-300"
                      }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-xl font-bold text-black">{project.projectName}</h2>
                      <div className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${badge.bg} ${badge.text}`}>
                        <BadgeIcon size={14} />
                        {badge.label}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-2">{project.village?.name || "Unknown Village"}</p>
                    <p className="font-bold text-lg mb-3 text-black">₹{project.budget?.toLocaleString()}</p>

                    <div className="flex items-center gap-2 text-sm mb-4">
                      <FileCheck size={16} className="text-gray-700" />
                      <span className="text-gray-800">
                        {docsApproved}/{docsTotal} documents approved
                      </span>
                    </div>

                    {project.assignedScheme && (
                      <div className="bg-green-50 border border-green-200 p-3 rounded-lg mb-4">
                        <div className="flex items-center gap-2">
                          <Award size={16} className="text-green-600" />
                          <span className="font-semibold text-green-800">{project.assignedScheme.schemeName}</span>
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            ₹{project.assignedScheme.budgetLimit}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="mt-auto border-t border-gray-200 pt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/collector/work-packages/${project._id}`);
                        }}
                        className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
                      >
                        <FileText size={18} />
                        View Work Packages
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT PANEL - PROJECT DETAILS */}
          {selectedProject && (
            <div className="fixed right-0 top-0 w-[550px] h-full bg-white shadow-2xl border-l-2 border-gray-300 z-40 overflow-auto">
              <div className="sticky top-0 bg-black text-white p-6 z-10 shadow-lg">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-white font-bold mb-4 hover:underline flex items-center gap-2"
                >
                  <ChevronRight className="rotate-180" />
                  Close
                </button>
                <h1 className="text-2xl font-bold">{selectedProject.projectName}</h1>
                <p className="text-gray-200">{selectedProject.village?.name}</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Project Summary */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-1">PROJECT BUDGET</p>
                      <p className="text-2xl font-bold text-black">₹{selectedProject.budget?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-1">STATUS</p>
                      {(() => {
                        const badge = getStatusBadge(selectedProject.status);
                        const Icon = badge.icon;
                        return (
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${badge.bg} ${badge.text} font-bold`}>
                            <Icon size={20} />
                            {badge.label}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* DOCUMENTS */}
                <div>
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <FileCheck className="text-black" />
                    Documents ({selectedProject.documents?.length || 0})
                  </h3>
                  {selectedProject.documents?.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {selectedProject.documents.map((doc) => {
                        const docBadge = getStatusBadge(doc.status);
                        const DocIcon = docBadge.icon;
                        return (
                          <div key={doc._id} className={`p-4 border-2 rounded-xl ${docBadge.bg} ${docBadge.text} hover:shadow-md transition`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-lg">
                                  <FileText size={20} />
                                </div>
                                <div>
                                  <p className="font-bold text-black">{doc.fileName}</p>
                                  <p className="text-sm opacity-75">{doc.documentType}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/50">
                                <DocIcon size={16} />
                                <span className="font-bold text-xs">{doc.status}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedDoc(doc)}
                              className="mt-3 w-full border border-gray-300 hover:border-black text-black py-2 rounded-lg font-medium transition-all"
                            >
                              Review Document
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-500 text-lg">No documents uploaded</p>
                    </div>
                  )}
                </div>

                {/* SCHEME SECTION */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                    <Award className="text-black" />
                    Government Scheme
                  </h3>

                  {selectedProject.assignedScheme ? (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-6 rounded-2xl mb-6 shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-green-500 p-4 rounded-2xl">
                            <Award className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h4 className="text-2xl font-bold text-green-900">{selectedProject.assignedScheme.schemeName}</h4>
                            <p className="text-green-700 text-lg">Budget Limit: ₹{selectedProject.assignedScheme.budgetLimit.toLocaleString()}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowSchemeModal(true)}
                          disabled={loading}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all disabled:opacity-50"
                        >
                          ✏️ Edit Scheme
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-black transition-all bg-gray-50 hover:bg-gray-100">
                      <Award className="w-20 h-20 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-2xl font-bold text-gray-700 mb-2">No Scheme Assigned</h3>
                      <p className="text-gray-500 mb-6">Assign a government scheme to this approved project</p>
                      <button
                        onClick={() => setShowSchemeModal(true)}
                        disabled={loading || selectedProject.status !== "approved"}
                        className="bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 mx-auto shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus size={24} />
                        Assign Scheme Now
                      </button>
                    </div>
                  )}
                </div>

                {/* APPROVAL SECTION */}
                {selectedProject.status === "pending" && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-bold text-xl mb-4">Final Decision</h3>
                    <textarea
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      placeholder="Enter decision notes (required for rejection)..."
                      className="w-full p-4 border-2 border-gray-300 rounded-xl mb-6 resize-vertical min-h-[100px] text-black focus:border-black focus:outline-none"
                      rows={4}
                    />
                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          setActionType("approve");
                          setShowApprovalModal(true);
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg transition-all"
                      >
                        <CheckCircle size={24} />
                        Approve Project
                      </button>
                      <button
                        onClick={() => {
                          setActionType("reject");
                          setShowApprovalModal(true);
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg transition-all"
                      >
                        <XCircle size={24} />
                        Reject Project
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SCHEME MODAL */}
          {showSchemeModal && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
                <div className="p-8 border-b border-gray-200 sticky top-0 bg-white z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-black mb-2">
                        {selectedProject.assignedScheme ? "✏️ Edit Scheme" : "➕ Assign Scheme"}
                      </h2>
                      <p className="text-gray-600 text-lg">
                        Project: <span className="font-bold text-black">{selectedProject.projectName}</span> |
                        Budget: ₹{selectedProject.budget?.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowSchemeModal(false);
                        setSchemeFilters({ category: "", budget: "" });
                        setSchemeSearch("");
                      }}
                      className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all shadow-sm"
                    >
                      <X className="w-7 h-7 text-gray-600 hover:text-black" />
                    </button>
                  </div>
                </div>

                <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                  {/* Filters */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl shadow-inner">
                    <div>
                      <label className="block text-sm font-bold text-black mb-4 uppercase tracking-wide">Category</label>
                      <select
                        value={schemeFilters.category}
                        onChange={(e) => {
                          setSchemeFilters(prev => ({ ...prev, category: e.target.value }));
                          fetchFilteredSchemes(e.target.value, schemeFilters.budget);
                        }}
                        className="w-full p-5 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none text-black font-semibold text-lg shadow-md hover:shadow-lg transition-all"
                      >
                        <option value="">🗂️ All Categories</option>
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-black mb-4 uppercase tracking-wide">Min Budget</label>
                      <input
                        type="number"
                        value={schemeFilters.budget}
                        onChange={(e) => {
                          setSchemeFilters(prev => ({ ...prev, budget: e.target.value }));
                          fetchFilteredSchemes(schemeFilters.category, e.target.value);
                        }}
                        className="w-full p-5 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none text-black font-semibold text-lg shadow-md hover:shadow-lg transition-all"
                        placeholder="₹ 0"
                      />
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                      <button
                        onClick={() => fetchFilteredSchemes(schemeFilters.category, schemeFilters.budget)}
                        className="flex-1 lg:flex-none bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all"
                      >
                        <Filter size={24} />
                        Apply Filters
                      </button>
                      {selectedProject.assignedScheme && (
                        <button
                          onClick={() => handleCollectorSchemeAction("remove")}
                          className="flex-1 lg:flex-none bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all"
                        >
                          <XCircle size={24} />
                          Remove Scheme
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Search */}
                  <div className="mb-10">
                    <div className="relative bg-white shadow-2xl rounded-3xl p-1 border-4 border-gray-100">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-400" />
                      <input
                        type="text"
                        value={schemeSearch}
                        onChange={(e) => setSchemeSearch(e.target.value)}
                        placeholder="🔍 Search 500+ schemes by name..."
                        className="w-full pl-20 pr-6 py-6 border-none rounded-2xl focus:outline-none text-black text-xl font-semibold bg-transparent shadow-none"
                      />
                    </div>
                  </div>

                  {/* Schemes Grid */}
                  {filteredSchemes.length === 0 ? (
                    <div className="text-center py-24 bg-gradient-to-b from-gray-50 to-gray-100 rounded-3xl shadow-xl">
                      <Award className="w-32 h-32 mx-auto text-gray-300 mb-8 opacity-50" />
                      <h3 className="text-3xl font-bold text-gray-600 mb-4">No schemes match your filters</h3>
                      <p className="text-xl text-gray-500 mb-8">Try different category or budget range</p>
                      <button
                        onClick={() => {
                          setSchemeFilters({ category: "", budget: "" });
                          fetchFilteredSchemes();
                        }}
                        className="bg-black hover:bg-gray-900 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                      {filteredSchemes.map((scheme) => {
                        const isCurrent = selectedProject.assignedScheme?._id === scheme._id;
                        const isSuitable = scheme.budgetLimitNum >= selectedProject.budget;

                        return (
                          <div
                            key={scheme._id}
                            className={`group p-8 border-4 rounded-3xl hover:shadow-3xl transition-all cursor-pointer overflow-hidden hover:-translate-y-2 bg-gradient-to-br ${isCurrent
                                ? "from-green-50 to-emerald-50 border-green-400 shadow-2xl ring-8 ring-green-100/50"
                                : isSuitable
                                  ? "from-white to-gray-50 border-gray-200 hover:border-black/50 shadow-xl"
                                  : "from-orange-50 to-red-50 border-orange-300 shadow-lg opacity-90"
                              }`}
                            onClick={() => handleCollectorSchemeAction("assign", scheme._id)}
                          >
                            <div className={`w-full h-4 rounded-2xl mb-8 shadow-inner ${isSuitable ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gradient-to-r from-orange-400 to-red-500"
                              }`} />

                            <div className="flex items-start justify-between mb-6">
                              <h4 className="font-black text-2xl text-black group-hover:text-gray-900 line-clamp-2 pr-8 flex-1 leading-tight">
                                {scheme.schemeName}
                              </h4>
                              <div className={`px-6 py-3 rounded-2xl text-lg font-black shadow-lg ${isCurrent
                                  ? "bg-green-600 text-white shadow-green-500/50"
                                  : isSuitable
                                    ? "bg-emerald-500 text-white shadow-emerald-500/50"
                                    : "bg-orange-500 text-white shadow-orange-500/50"
                                }`}>
                                {isCurrent ? "✅ CURRENT" : isSuitable ? "✅ FITS" : "⚠️ LOW"}
                              </div>
                            </div>

                            <p className="text-gray-700 mb-8 text-lg leading-relaxed line-clamp-4 bg-white/60 p-5 rounded-2xl shadow-sm border backdrop-blur-sm">
                              {scheme.description}
                            </p>

                            <div className="pt-8 border-t-4 border-gray-100">
                              <div className="flex justify-between items-center mb-8">
                                <span className="text-xl font-bold text-gray-600 uppercase tracking-wider">Max Budget</span>
                                <span className={`text-3xl font-black ${isSuitable ? "text-emerald-700 drop-shadow-lg" : "text-orange-700 drop-shadow-lg"
                                  }`}>
                                  ₹{scheme.budgetLimit}
                                </span>
                              </div>
                              <button
                                disabled={!isSuitable}
                                className={`w-full py-6 px-8 rounded-3xl font-black text-xl flex items-center justify-center gap-4 shadow-2xl hover:shadow-4xl transition-all backdrop-blur-md ${isCurrent
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : isSuitable
                                      ? "bg-gradient-to-r from-black to-gray-900 hover:from-gray-900 hover:to-black text-white"
                                      : "bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed"
                                  }`}
                              >
                                {isCurrent ? (
                                  <>
                                    <CheckCircle size={28} />
                                    Currently Assigned
                                  </>
                                ) : isSuitable ? (
                                  <>
                                    <Award size={28} />
                                    Assign This Scheme
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle size={28} />
                                    Budget Too Low
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* DOCUMENT REVIEW MODAL */}
          {selectedDoc && (
            <DocumentReviewModal
              doc={selectedDoc}
              close={() => setSelectedDoc(null)}
              refresh={fetchProjects}
            />
          )}

          {/* APPROVAL MODAL */}
          {showApprovalModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  {actionType === "approve" ? (
                    <div className="bg-green-100 p-4 rounded-2xl">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  ) : (
                    <div className="bg-red-100 p-4 rounded-2xl">
                      <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                  )}
                  <h2 className="text-2xl font-bold">
                    Confirm {actionType === "approve" ? "Approval" : "Rejection"}
                  </h2>
                </div>
                <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                  {actionType === "approve"
                    ? "All documents are approved. This will create the project in the system."
                    : "Please ensure rejection reason is provided above."}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowApprovalModal(false)}
                    className="flex-1 border-2 border-gray-300 text-black py-4 rounded-xl font-bold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={actionType === "approve" ? handleApprove : handleReject}
                    className={`flex-1 py-4 rounded-xl font-bold shadow-xl transition-all ${actionType === "approve"
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                  >
                    {actionType === "approve" ? "✅ Approve Project" : "❌ Reject Project"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectorDashboard;

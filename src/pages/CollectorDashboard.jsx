import React, { useState, useEffect } from "react";
import api from "../api";
import DocumentReviewModal from "./CollectorDocView";
import { useNavigate } from "react-router-dom";

import {
  FileText, CheckCircle, XCircle, Clock, Download, Eye, AlertCircle, IndianRupee,
  Calendar, User, Building2, FileCheck, Search, Filter, ChevronDown, ChevronRight, Home,
  Award, Plus
} from "lucide-react";

const CollectorDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
const navigate = useNavigate();

  // ================= API CALLS =================
  const fetchOfficers = async () => {
    try {
      const res = await api.get("/api/projects/collector/officers");
      setOfficers(res.data.officers);
    } catch (err) {
      console.error("Error loading officers", err);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/projects/collector/requests");
      setProjects(res.data.requests);
      
      // If a project is selected, update it with fresh data
      if (selectedProject) {
        const updated = res.data.requests.find(p => p._id === selectedProject._id);
        if (updated) {
          setSelectedProject(updated);
        }
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
    setLoading(false);
  };

  const fetchSchemes = async () => {
    try {
      const res = await api.get("/api/projects/schemes");
      setSchemes(res.data.schemes);
    } catch (err) {
      console.error("Failed to fetch schemes", err);
    }
  };

  const handleApprove = async () => {
    try {
      // Check if all documents are approved
      const allDocsApproved = selectedProject.documents.every(
        doc => doc.status === "approved"
      );

      if (!allDocsApproved) {
        alert("⚠️ Please approve all documents before approving the project!");
        setShowApprovalModal(false);
        return;
      }

      await api.put(`/api/projects/request/${selectedProject._id}/review`, {
        decision: "approved",
        reason: reviewNote
      });

      alert("✅ Project approved successfully!");
      await fetchProjects();
      setShowApprovalModal(false);
      setReviewNote("");
      setSelectedProject(null);
    } catch (err) {
      console.error("Approval failed", err);
      alert("❌ Approval failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleReject = async () => {
    try {
      if (!reviewNote.trim()) {
        alert("⚠️ Please provide a rejection reason!");
        return;
      }

      await api.put(`/api/projects/request/${selectedProject._id}/review`, {
        decision: "rejected",
        reason: reviewNote
      });

      alert("✅ Project rejected!");
      await fetchProjects();
      setShowApprovalModal(false);
      setReviewNote("");
      setSelectedProject(null);
    } catch (err) {
      console.error("Reject failed", err);
      alert("❌ Rejection failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleAssignScheme = async () => {
    try {
      if (!selectedScheme) {
        alert("⚠️ Please select a scheme!");
        return;
      }

      await api.put(`/api/projects/assign-scheme/${selectedProject._id}`, {
        schemeId: selectedScheme
      });

      alert("🎉 Scheme assigned successfully!");
      setShowSchemeModal(false);
      setSelectedScheme("");
      await fetchProjects();
    } catch (error) {
      console.error("Failed to assign scheme", error);
      alert("❌ Failed to assign scheme: " + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    fetchOfficers();
    fetchProjects();
    fetchSchemes();
  }, []);

  const filteredProjects = projects.filter((project) => {
  const matchesStatus = filterStatus === "all" || project.status === filterStatus;
  const matchesSearch =
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.village?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase());

  if (selectedOfficer) return matchesStatus && matchesSearch && project.requestedBy._id === selectedOfficer;
  return matchesStatus && matchesSearch;
});

  const getStatusBadge = (status) => {
    const config = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock, label: "Pending" },
      approved: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle, label: "Approved" },
      rejected: { bg: "bg-red-100", text: "text-red-800", icon: XCircle, label: "Rejected" }
    };
    return config[status] || config.pending;
  };

  const getDocStatusBadge = (status) => {
    const config = {
      pending: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-300", icon: Clock, label: "Pending Review" },
      approved: { bg: "bg-green-50", text: "text-green-700", border: "border-green-300", icon: CheckCircle, label: "Approved" },
      rejected: { bg: "bg-red-50", text: "text-red-700", border: "border-red-300", icon: XCircle, label: "Rejected" }
    };
    return config[status] || config.pending;
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-80 bg-white border-r shadow-md p-5 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
          <Building2 className="text-blue-600" /> Collector Panel
        </h2>

        <div className="mb-4">
          <button
            onClick={() => setSelectedOfficer(null)}
            className={`w-full p-3 rounded-lg mb-2 font-semibold ${
              !selectedOfficer ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            All Officers
          </button>
        </div>

        <h3 className="font-semibold text-gray-700 mb-3">Villages & Officers</h3>

        {officers.map((off) => (
          <button
            key={off._id}
            onClick={() => setSelectedOfficer(off._id)}
            className={`w-full flex items-center justify-between p-3 rounded-lg border mb-2 ${
              selectedOfficer === off._id ? "bg-blue-50 border-blue-600" : "hover:bg-gray-50 border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <Home className="text-blue-700" />
              <div className="text-left">
                <p className="font-bold">{off.fullName}</p>
                <p className="text-sm text-gray-600">{off.village?.name}</p>
              </div>
            </div>
            <ChevronRight />
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-4">Project Requests</h1>

        {/* Search + Filter */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search project or village..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg border"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 rounded-lg border"
          >
            <option value="all">All</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* PROJECT CARDS */}
        <div className="grid grid-cols-2 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <p className="text-gray-500 text-lg">No projects found</p>
            </div>
          ) : (
            filteredProjects.map((project) => {
              const badge = getStatusBadge(project.status);
              const BadgeIcon = badge.icon;
              
              // Count document statuses
              const docsApproved = project.documents.filter(d => d.status === "approved").length;
              const docsTotal = project.documents.length;
              
              return (
                <div
                  key={project._id}
                  onClick={() => setSelectedProject(project)}
                  className={`bg-white p-6 border-2 rounded-xl shadow-sm hover:shadow-xl cursor-pointer transition ${
                    selectedProject?._id === project._id ? "border-blue-500" : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold">{project.projectName}</h2>
                    <div className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${badge.bg} ${badge.text}`}>
                      <BadgeIcon size={14} /> {badge.label}
                    </div>
                  </div>

<p className="text-gray-600 mb-2">{project.village?.name || "Unknown Village"}</p>
                  <p className="font-bold text-lg mb-3">₹{project.budget?.toLocaleString()}</p>
                  
                  {/* Document Status Summary */}
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <FileCheck size={16} className="text-gray-500" />
                    <span className="text-gray-700">
                      Documents: <span className="font-semibold">{docsApproved}/{docsTotal}</span> approved
                    </span>
                  </div>

                  {/* Scheme Status */}
                  {project.assignedScheme && (
                    <div className="flex items-center gap-2 text-sm">
                      <Award size={16} className="text-green-600" />
                      <span className="text-green-700 font-semibold">
                        Scheme Assigned
                      </span>
                    </div>
                  )}
                  {/* View Work Packages */}
<div className="mt-6 border-t pt-6">
  <button
    onClick={() => navigate(`/collector/work-packages/${selectedProject._id}`)}
    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
  >
    <FileText size={20} />
    View Work Packages
  </button>
</div>

                </div>
              );
            })
          )}
        </div>

        {/* PROJECT DETAILS PANEL */}
        {selectedProject && (
          <div className="fixed right-0 top-0 w-[520px] h-full bg-white shadow-2xl overflow-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 z-10">
              <button 
                onClick={() => setSelectedProject(null)} 
                className="text-white font-bold mb-4 hover:underline"
              >
                ← Close
              </button>
              <h1 className="text-2xl font-bold">{selectedProject.projectName}</h1>
<p className="text-blue-100 mt-1">{selectedProject.village?.name || "Unknown Village"}</p>
            </div>

            <div className="p-6">
              {/* Project Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold mb-1">BUDGET</p>
                    <p className="font-bold text-lg">₹{selectedProject.budget?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold mb-1">STATUS</p>
                    {(() => {
                      const badge = getStatusBadge(selectedProject.status);
                      const Icon = badge.icon;
                      return (
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded ${badge.bg} ${badge.text}`}>
                          <Icon size={14} />
                          <span className="text-sm font-semibold">{badge.label}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                
                {selectedProject.description && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 font-semibold mb-1">DESCRIPTION</p>
                    <p className="text-sm text-gray-700">{selectedProject.description}</p>
                  </div>
                )}
              </div>

              {/* Documents Section */}
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <FileCheck className="text-blue-600" />
                Documents ({selectedProject.documents.length})
              </h3>
              
              {selectedProject.documents.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <FileText className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-gray-500">No documents uploaded</p>
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  {selectedProject.documents.map((doc) => {
                    const docBadge = getDocStatusBadge(doc.status);
                    const DocIcon = docBadge.icon;
                    
                    return (
                      <div 
                        key={doc._id} 
                        className={`p-4 bg-white border-2 ${docBadge.border} rounded-lg hover:shadow-md transition`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="bg-blue-100 p-2 rounded">
                              <FileText className="text-blue-600" size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{doc.fileName}</p>
                              <p className="text-xs text-gray-500">{doc.documentType}</p>
                            </div>
                          </div>
                          
                          <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${docBadge.bg} ${docBadge.text}`}>
                            <DocIcon size={12} />
                            {docBadge.label}
                          </div>
                        </div>
                        
                        {doc.reviewComments && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                            <p className="font-semibold text-gray-700">Review Note:</p>
                            <p className="text-gray-600">{doc.reviewComments}</p>
                          </div>
                        )}
                        
                        <button 
                          className="mt-3 w-full text-blue-600 hover:bg-blue-50 py-2 rounded font-medium text-sm border border-blue-300"
                          onClick={() => setSelectedDoc(doc)}
                        >
                          Review Document
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Approval Section */}
              {selectedProject.status === "pending" && (
                <div className="border-t pt-6">
                  <h3 className="font-bold mb-3">Final Decision</h3>
                  
                  <textarea
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="Enter your decision note (required for rejection)..."
                    className="w-full p-3 border rounded-lg mb-4 resize-none"
                    rows="4"
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowApprovalModal(true);
                        setActionType("approve");
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={20} />
                      Approve Project
                    </button>

                    <button
                      onClick={() => {
                        setShowApprovalModal(true);
                        setActionType("reject");
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2"
                    >
                      <XCircle size={20} />
                      Reject Project
                    </button>
                  </div>
                </div>
              )}

              {/* Assign Scheme Section */}
              {selectedProject.status === "approved" && !selectedProject.assignedScheme && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Award className="text-blue-600" />
                    Assign Scheme
                  </h3>
                  <button
                    onClick={() => setShowSchemeModal(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    Assign Scheme to Project
                  </button>
                </div>
              )}

              {/* Display Assigned Scheme */}
              {selectedProject.assignedScheme && (
                <div className="mt-6 border-t pt-6">
                  <div className="bg-green-50 border-2 border-green-300 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="text-green-600" size={20} />
                      <p className="text-sm font-semibold text-green-700">Scheme Assigned:</p>
                    </div>
                    <p className="text-lg font-bold text-green-900">
                      {selectedProject.assignedScheme.schemeName}
                    </p>
                    {selectedProject.assignedScheme.description && (
                      <p className="text-sm text-green-800 mt-2">
                        {selectedProject.assignedScheme.description}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Show rejection reason if rejected */}
              {selectedProject.status === "rejected" && selectedProject.rejectionReason && (
                <div className="border-t pt-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="text-red-600 mt-0.5" size={18} />
                      <div>
                        <p className="font-bold text-red-900 mb-1">Rejection Reason:</p>
                        <p className="text-red-800 text-sm">{selectedProject.rejectionReason}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* REVIEW MODAL */}
        {selectedDoc && (
          <DocumentReviewModal
            doc={selectedDoc}
            close={() => setSelectedDoc(null)}
            refresh={fetchProjects}
          />
        )}

        {/* APPROVE / REJECT CONFIRM MODAL */}
        {showApprovalModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 w-[420px] rounded-xl shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                {actionType === "approve" ? (
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                ) : (
                  <div className="bg-red-100 p-3 rounded-full">
                    <XCircle className="text-red-600" size={24} />
                  </div>
                )}
                <h2 className="text-xl font-bold">
                  Confirm {actionType === "approve" ? "Approval" : "Rejection"}
                </h2>
              </div>

              <p className="text-gray-600 mb-4">
                {actionType === "approve" 
                  ? "Are you sure you want to approve this project? This action will create a new project in the system."
                  : "Are you sure you want to reject this project? Please ensure you have provided a rejection reason."}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                
                <button
                  onClick={actionType === "approve" ? handleApprove : handleReject}
                  className={`flex-1 text-white py-3 rounded-lg font-bold ${
                    actionType === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  Confirm {actionType === "approve" ? "Approval" : "Rejection"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ASSIGN SCHEME MODAL */}
        {showSchemeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 w-[450px] rounded-xl shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Award className="text-blue-600" size={24} />
                </div>
                <h2 className="text-xl font-bold">Assign Scheme</h2>
              </div>

              <p className="text-gray-600 mb-4">
                Select a government scheme to assign to this approved project:
              </p>

              <select
                value={selectedScheme}
                onChange={(e) => setSelectedScheme(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Select a Scheme --</option>
                {schemes.map((scheme) => (
                  <option key={scheme._id} value={scheme._id}>
                    {scheme.schemeName}
                  </option>
                ))}
              </select>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSchemeModal(false);
                    setSelectedScheme("");
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignScheme}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold"
                >
                  Assign Scheme
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectorDashboard;
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { Plus, Upload, FileText, ArrowLeft, CheckCircle, XCircle, Clock, Eye, Download } from "lucide-react";

const WorkPackageDashboard = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [packages, setPackages] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [additionalFile, setAdditionalFile] = useState(null);
  const [docType, setDocType] = useState("bill");

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    documentType: "bill",
  });
  const [file, setFile] = useState(null);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/work-packages/project/${projectId}/officer`);
      setPackages(res.data.data || []);
    } catch (err) {
      console.error("Failed fetching packages:", err);
      alert("Failed to load work packages");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPackages();
  }, [projectId]);

  const handleCreatePackage = async (e) => {
    e.preventDefault();
    if (!file) return alert("Upload document required");

    const fd = new FormData();
    fd.append("projectId", projectId);
    fd.append("title", formData.title);
    fd.append("amount", formData.amount);
    fd.append("documentType", formData.documentType);
    fd.append("document", file);

    try {
      await api.post("/api/work-packages/request", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Work package created successfully!");
      setShowCreateForm(false);
      setFormData({ title: "", amount: "", documentType: "bill" });
      setFile(null);
      fetchPackages();
    } catch (err) {
      alert(err.response?.data?.message || "Creation failed");
    }
  };

  const handleUploadAdditionalDoc = async (e) => {
    e.preventDefault();
    if (!additionalFile) return alert("Upload file is required");

    const fd = new FormData();
    fd.append("documentType", docType);
    fd.append("document", additionalFile);

    try {
      await api.post(`/api/work-packages/${selectedPackage}/upload`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Document uploaded successfully!");
      setShowUploadModal(false);
      setAdditionalFile(null);
      setDocType("bill");
      fetchPackages();
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    }
  };

  const getStatusConfig = (status) => {
    const config = {
      pending: { 
        bg: "bg-yellow-100", 
        text: "text-yellow-800", 
        icon: Clock,
        label: "Pending Review"
      },
      approved: { 
        bg: "bg-green-100", 
        text: "text-green-800", 
        icon: CheckCircle,
        label: "Approved"
      },
      rejected: { 
        bg: "bg-red-100", 
        text: "text-red-800", 
        icon: XCircle,
        label: "Rejected"
      }
    };
    return config[status] || config.pending;
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading work packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate("/officer")}
          className="flex items-center gap-2 text-gray-700 hover:text-black font-semibold mb-6 bg-white px-4 py-2 rounded-lg shadow-sm border"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Work Packages</h1>
            <p className="text-gray-600 mt-1">Manage your project work packages and documents</p>
          </div>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus className="w-5 h-5" /> New Work Package
          </button>
        </div>

        {/* Stats */}
        {packages.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {packages.filter(p => p.status === "pending").length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
              <p className="text-sm text-gray-600 mb-1">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {packages.filter(p => p.status === "approved").length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
              <p className="text-sm text-gray-600 mb-1">Rejected</p>
              <p className="text-2xl font-bold text-red-600">
                {packages.filter(p => p.status === "rejected").length}
              </p>
            </div>
          </div>
        )}

        {/* Work Packages List */}
        {packages.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FileText className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Work Packages Yet</h3>
            <p className="text-gray-500 mb-6">Create your first work package to get started.</p>
            <button
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              onClick={() => setShowCreateForm(true)}
            >
              Create Work Package
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {packages.map((pkg) => {
              const statusConfig = getStatusConfig(pkg.status);
              const StatusIcon = statusConfig.icon;
              const approvedDocs = pkg.documents?.filter(d => d.status === "approved").length || 0;
              const totalDocs = pkg.documents?.length || 0;

              return (
                <div key={pkg._id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="font-bold text-2xl text-gray-800 mb-1">{pkg.title}</h2>
                      <p className="text-xl text-blue-600 font-semibold">₹{pkg.amount?.toLocaleString()}</p>
                    </div>
                    <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${statusConfig.bg} ${statusConfig.text}`}>
                      <StatusIcon size={16} />
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Document Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span className="font-semibold">Documents ({totalDocs})</span>
                      <span>{approvedDocs}/{totalDocs} approved</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: totalDocs > 0 ? `${(approvedDocs / totalDocs) * 100}%` : '0%' }}
                      ></div>
                    </div>
                  </div>

                  {/* Documents List */}
                  <div className="space-y-3 mb-4">
                    {pkg.documents && pkg.documents.length > 0 ? (
                      pkg.documents.map((doc) => {
                        const docStatus = getStatusConfig(doc.status || "pending");
                        const DocIcon = docStatus.icon;

                        return (
                          <div key={doc._id} className="bg-gray-50 p-4 rounded-lg border">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-start gap-3 flex-1">
                                <FileText className="w-5 h-5 text-gray-600 mt-1" />
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-800">{doc.fileName}</p>
                                  <p className="text-sm text-gray-600 capitalize">{doc.documentType}</p>
                                </div>
                              </div>
                              <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${docStatus.bg} ${docStatus.text}`}>
                                <DocIcon size={12} />
                                {doc.status || "pending"}
                              </span>
                            </div>

                            {/* Document Actions */}
                            <div className="flex gap-2 mt-3">
                              <a
                                href={`${BASE_URL}${doc.fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition"
                              >
                                <Eye size={16} /> View
                              </a>
                              <a
                                href={`${BASE_URL}${doc.fileUrl}`}
                                download
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition"
                              >
                                <Download size={16} /> Download
                              </a>
                            </div>

                            {/* Show review comments if rejected */}
                            {doc.status === "rejected" && doc.reviewComments && (
                              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                                <p className="text-sm font-semibold text-red-800 mb-1">Rejection Reason:</p>
                                <p className="text-sm text-red-700">{doc.reviewComments}</p>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500 text-center py-4">No documents uploaded yet</p>
                    )}
                  </div>

                  {/* Upload Additional Document Button */}
                  <button
                    className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition"
                    onClick={() => {
                      setSelectedPackage(pkg._id);
                      setShowUploadModal(true);
                    }}
                  >
                    <Upload className="w-5 h-5" />
                    Upload Additional Document
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Upload Additional Doc Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-6 z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
              <h2 className="text-2xl font-bold mb-6">Upload Additional Document</h2>

              <form onSubmit={handleUploadAdditionalDoc} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Document Type</label>
                  <select
                    className="border-2 w-full p-3 rounded-lg focus:border-blue-500 focus:outline-none"
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                  >
                    <option value="bill">Bill</option>
                    <option value="invoice">Invoice</option>
                    <option value="material">Material Receipt</option>
                    <option value="completion">Completion Certificate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Select File</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="border-2 w-full p-3 rounded-lg focus:border-blue-500 focus:outline-none"
                    onChange={(e) => setAdditionalFile(e.target.files[0])}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Supported: PDF, JPG, PNG (Max 10MB)</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    className="flex-1 border-2 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                    onClick={() => {
                      setShowUploadModal(false);
                      setAdditionalFile(null);
                      setDocType("bill");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Work Package Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-6 z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
              <h2 className="text-2xl font-bold mb-6">Create New Work Package</h2>

              <form onSubmit={handleCreatePackage} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Package Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Road Construction Phase 1"
                    className="border-2 w-full p-3 rounded-lg focus:border-blue-500 focus:outline-none"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="border-2 w-full p-3 rounded-lg focus:border-blue-500 focus:outline-none"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Document Type</label>
                  <select
                    className="border-2 w-full p-3 rounded-lg focus:border-blue-500 focus:outline-none"
                    value={formData.documentType}
                    onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                  >
                    <option value="bill">Bill</option>
                    <option value="invoice">Invoice</option>
                    <option value="material">Material Receipt</option>
                    <option value="completion">Completion Certificate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Document</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="border-2 w-full p-3 rounded-lg focus:border-blue-500 focus:outline-none"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Supported: PDF, JPG, PNG (Max 10MB)</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    className="flex-1 border-2 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                    onClick={() => {
                      setShowCreateForm(false);
                      setFormData({ title: "", amount: "", documentType: "bill" });
                      setFile(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Create Package
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkPackageDashboard;
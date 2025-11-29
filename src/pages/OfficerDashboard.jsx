// src/pages/OfficerDashboard.jsx - FULL CODE WITH SCHEME ASSIGNMENT
import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { 
  FolderOpen, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  FileText, 
  Plus, 
  X, 
  Upload,
  Camera,
  Eye,
  Shield,
  Award,
  Filter,
  Search
} from "lucide-react";

const ProjectRequestsDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    projectName: "",
    budget: "",
    description: "",
    documentType: "supporting",
    category: "general" // NEW: project category for scheme filtering
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formLoading, setFormLoading] = useState(false);

  // Scheme state
  const [schemes, setSchemes] = useState([]);
  const [schemeLoading, setSchemeLoading] = useState(false);
  const [schemeFilters, setSchemeFilters] = useState({
    category: "",
    budget: ""
  });
  const [schemeSearch, setSchemeSearch] = useState("");

  // Fetch requests
  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/projects/my-requests");
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error("Error loading requests:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch filtered schemes for officer
  const fetchFilteredSchemes = async (category = "", budget = "") => {
    try {
      setSchemeLoading(true);
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (budget) params.append("budget", budget);
      
      const res = await api.get(`/api/projects/schemes/filtered?${params}`);
      setSchemes(res.data.schemes || []);
    } catch (err) {
      console.error("Error loading schemes:", err);
    } finally {
      setSchemeLoading(false);
    }
  };

  // Assign scheme to request
  const assignSchemeToRequest = async (schemeId) => {
    try {
      const res = await api.put(`/api/projects/request/${selectedRequest._id}/assign-scheme`, {
        schemeId
      });
      
      if (res.data.success) {
        alert("✅ Scheme assigned successfully!");
        setShowSchemeModal(false);
        fetchMyRequests();
      }
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Failed to assign scheme"));
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const approvedRequests = requests.filter(r => r.status === "approved");
  const pendingRequests = requests.filter(r => r.status === "pending");

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatBudget = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  // File handling
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("projectName", formData.projectName);
      formDataToSend.append("budget", formData.budget);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("documentType", formData.documentType);

      selectedFiles.forEach(file => {
        formDataToSend.append("documents", file);
      });

      const res = await api.post("/api/projects/request", formDataToSend);

      if (res.data.success) {
        alert("✅ Project request created successfully!");
        setShowCreateForm(false);
        setFormData({
          projectName: "",
          budget: "",
          description: "",
          documentType: "supporting",
          category: "general"
        });
        setSelectedFiles([]);
        fetchMyRequests();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create project request");
    } finally {
      setFormLoading(false);
    }
  };

  // Open scheme modal for request
  const openSchemeModal = (request) => {
    setSelectedRequest(request);
    setSchemeFilters({
      category: "",
      budget: request.budget || ""
    });
    fetchFilteredSchemes("", request.budget);
    setShowSchemeModal(true);
  };

  // Filter schemes based on inputs
  const filteredSchemes = schemes.filter(scheme =>
    scheme.schemeName.toLowerCase().includes(schemeSearch.toLowerCase())
  );

  const categories = [
    { value: "health", label: "Health/Hospital" },
    { value: "road", label: "Road/Infrastructure" },
    { value: "water", label: "Water/Jal Jeevan" },
    { value: "education", label: "Education/School" },
    { value: "housing", label: "Housing/Awas" },
    { value: "agriculture", label: "Agriculture/Farming" },
    { value: "sanitation", label: "Sanitation/Swachh" },
    { value: "employment", label: "Employment/MGNREGA" },
    { value: "electricity", label: "Electricity/Solar" },
    { value: "women", label: "Women Welfare" },
    { value: "sports", label: "Sports/Stadium" },
    { value: "general", label: "General/All Schemes" }
  ];

  const RequestCard = ({ request }) => (
    <div className="p-6 bg-white border-2 border-gray-200 hover:border-black transition-all rounded-xl group cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-black group-hover:text-gray-900">
          {request.projectName}
        </h3>
        
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          request.status === "approved" ? "bg-green-100 text-green-800" : 
          request.status === "pending" ? "bg-gray-200 text-gray-800" : 
          "bg-red-100 text-red-800"
        }`}>
          {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
        </span>
      </div>

      {/* Scheme Section */}
      <div className="mb-4">
        {request.assignedScheme ? (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 p-3 rounded-lg">
            <Award className="w-4 h-4 text-green-600" />
            <div>
              <p className="font-semibold text-green-800 text-sm">{request.assignedScheme.schemeName}</p>
              <p className="text-xs text-green-700">Budget Limit: ₹{request.assignedScheme.budgetLimit}</p>
            </div>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              openSchemeModal(request);
            }}
            className="w-full p-3 bg-gray-100 hover:bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg text-sm font-semibold text-gray-700 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Assign Scheme
          </button>
        )}
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <FolderOpen className="w-4 h-4 text-gray-600" />
          <span className="text-gray-800">{request.village?.name || "Village removed"}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <FileText className="w-4 h-4 text-gray-600" />
          <span className="text-gray-800">
            {request.documents?.length || 0} Document{request.documents?.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 pb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500 font-semibold">Budget</span>
          <span className="text-lg font-bold text-black">{formatBudget(request.budget)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Submitted</span>
          <span className="text-xs text-gray-600">{formatDate(request.createdAt)}</span>
        </div>
      </div>

      {request.description && (
        <p className="text-sm text-gray-700 mt-3 line-clamp-2 bg-gray-50 p-3 rounded-lg">
          {request.description}
        </p>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={() => navigate(`/officer/project/${request._id}/work-packages`)}
          className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
        >
          <Eye className="w-4 h-4" />
          View Work Packages
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Top Navigation - Black & White */}
      <div className="flex items-center gap-1 mb-6 border-b border-gray-300 pb-4 bg-white shadow-sm max-w-7xl mx-auto px-8 rounded-t-lg">
        <button
          onClick={() => navigate("/officer/")}
          className="group relative px-6 py-3 font-semibold text-black hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 rounded-lg"
        >
          <FolderOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Dashboard
        </button>

        <button
          onClick={() => navigate("/officer/verification")}
          className="group relative px-6 py-3 font-semibold text-black hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 rounded-lg"
        >
          <Shield className="w-5 h-5" />
          Verification
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">My Project Requests</h1>
            <p className="text-gray-700">Total {requests.length} request{requests.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition font-bold"
          >
            <Plus className="w-5 h-5" />
            New Request
          </button>
        </div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-gray-300 flex justify-between items-center sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-black">Create Project Request</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-5">
                  {/* NEW: Project Category */}
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      Project Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none text-black"
                    >
                      <option value="general">General Project</option>
                      <option value="health">Health/Hospital</option>
                      <option value="road">Road/Infrastructure</option>
                      <option value="water">Water Supply</option>
                      <option value="education">Education/School</option>
                      <option value="housing">Housing</option>
                      <option value="agriculture">Agriculture</option>
                    </select>
                  </div>

                  {/* Project Name */}
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Project Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.projectName}
                      onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none text-black"
                      placeholder="e.g., Village Hospital Construction"
                    />
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Budget (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none text-black"
                      placeholder="5000000"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none text-black"
                      rows="3"
                      placeholder="Describe project details..."
                    />
                  </div>

                  {/* File Upload - unchanged */}
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Documents</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-500 transition">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                        <Upload className="w-12 h-12 text-gray-500 mb-3" />
                        <span className="text-sm font-bold text-gray-800">Click to upload documents</span>
                        <span className="text-xs text-gray-600 mt-1">PDF, DOC, JPG, PNG (Max 10MB each)</span>
                      </label>
                    </div>

                    {selectedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-600" />
                              <span className="text-sm text-gray-800 truncate flex-1">{file.name}</span>
                              <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <X className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-400 text-black rounded-xl hover:bg-gray-50 transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formLoading ? "Creating..." : "Create Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* SCHEME ASSIGNMENT MODAL - NEW */}
        {showSchemeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-gray-300 sticky top-0 bg-white z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-black">Assign Scheme</h2>
                    <p className="text-gray-700">
                      Project: <span className="font-semibold">{selectedRequest?.projectName}</span> | Budget: {formatBudget(selectedRequest?.budget)}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSchemeModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Category</label>
                    <select
                      value={schemeFilters.category}
                      onChange={(e) => {
                        setSchemeFilters({...schemeFilters, category: e.target.value});
                        fetchFilteredSchemes(e.target.value, schemeFilters.budget);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black text-black"
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Budget Filter</label>
                    <input
                      type="number"
                      value={schemeFilters.budget}
                      onChange={(e) => {
                        setSchemeFilters({...schemeFilters, budget: e.target.value});
                        fetchFilteredSchemes(schemeFilters.category, e.target.value);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black text-black"
                      placeholder="5000000"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={() => fetchFilteredSchemes(schemeFilters.category, schemeFilters.budget)}
                      disabled={schemeLoading}
                      className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {schemeLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Filter className="w-4 h-4" />
                      )}
                      Filter
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={schemeSearch}
                      onChange={(e) => setSchemeSearch(e.target.value)}
                      placeholder="Search schemes..."
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none text-black"
                    />
                  </div>
                </div>

                {/* Schemes Grid */}
                {schemeLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-700">Loading schemes...</p>
                  </div>
                ) : filteredSchemes.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-2xl">
                    <Award className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No schemes found</h3>
                    <p className="text-gray-600">Try adjusting your filters</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSchemes.map((scheme) => (
                      <div
                        key={scheme._id}
                        className={`p-6 border-2 rounded-xl hover:shadow-xl transition-all cursor-pointer group ${
                          scheme.suitable 
                            ? "border-gray-200 hover:border-black bg-white" 
                            : "border-red-200 bg-red-50 opacity-75"
                        }`}
                        onClick={() => assignSchemeToRequest(scheme._id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-bold text-lg text-black group-hover:text-gray-900">
                            {scheme.schemeName}
                          </h4>
                          <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                            scheme.suitable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {scheme.suitable ? "✅ Suitable" : "❌ Budget Low"}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{scheme.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                            <span className="text-xs text-gray-500 font-semibold">Budget Limit</span>
                            <span className="text-lg font-bold text-black">₹{scheme.budgetLimit}</span>
                          </div>
                          <button className="w-full bg-black hover:bg-gray-900 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 group-hover:scale-105 transition-all">
                            Assign Scheme
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Loading, Empty, and Requests sections - unchanged structure */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-700 font-semibold">Loading requests...</p>
          </div>
        ) : requests.length === 0 && !showCreateForm ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl p-12">
            <FolderOpen className="w-20 h-20 mx-auto text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No requests found</h2>
            <p className="text-gray-600 mb-6">Create your first project request</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-900 transition"
            >
              Create Request
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Approved Projects */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-7 h-7 text-green-600" />
                <h2 className="text-2xl font-bold text-black">Approved Projects</h2>
                <span className="px-4 py-2 bg-green-100 text-green-800 text-sm font-bold rounded-full">
                  {approvedRequests.length}
                </span>
              </div>
              {approvedRequests.length === 0 ? (
                <div className="p-12 bg-white border-2 border-dashed border-gray-300 rounded-2xl text-center">
                  <p className="text-gray-600 text-lg">No approved projects yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {approvedRequests.map(request => (
                    <RequestCard key={request._id} request={request} />
                  ))}
                </div>
              )}
            </section>

            {/* Pending Requests */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-7 h-7 text-gray-600" />
                <h2 className="text-2xl font-bold text-black">Pending Approval</h2>
                <span className="px-4 py-2 bg-gray-200 text-gray-900 text-sm font-bold rounded-full">
                  {pendingRequests.length}
                </span>
              </div>
              {pendingRequests.length === 0 ? (
                <div className="p-12 bg-white border-2 border-dashed border-gray-300 rounded-2xl text-center">
                  <p className="text-gray-600 text-lg">No pending requests</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingRequests.map(request => (
                    <RequestCard key={request._id} request={request} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectRequestsDashboard;

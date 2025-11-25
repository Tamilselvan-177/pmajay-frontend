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
  Upload 
} from "lucide-react";

const ProjectRequestsDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    projectName: "",
    budget: "",
    description: "",
    documentType: "supporting"
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch requests
  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/projects/my-requests");
      setRequests(res.data.requests || []);
    } catch (err) {
      // More detailed logging to help debug ngrok/CORS/auth failures
      console.error("Error loading requests:", err);
      console.error("Error status:", err.response?.status, "response data:", err.response?.data);
    } finally {
      setLoading(false);
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

    // Let the browser set the Content-Type (including the multipart boundary)
    const res = await api.post("/api/projects/request", formDataToSend);

    if (res.data.success) {
      alert("Project request created successfully!");
      setShowCreateForm(false);
      setFormData({
        projectName: "",
        budget: "",
        description: "",
        documentType: "supporting",
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


const RequestCard = ({ request }) => (
  <div
    onClick={() => navigate(`/officer/project/${request._id}/work-packages`)}
    className="p-5 bg-white border-2 border-gray-200 hover:border-gray-900 transition-all rounded-lg cursor-pointer group"
  >

    <div className="flex justify-between items-start mb-3">
      <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700">
        {request.projectName}
      </h3>
      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition" />
    </div>

    {/* Scheme Section */}
    {request.assignedScheme ? (
      <div className="mb-3 px-2 py-1 rounded-md bg-green-100 text-green-800 text-sm font-semibold">
        Scheme: {request.assignedScheme.schemeName}
      </div>
    ) : (
      <div className="mb-3 px-2 py-1 rounded-md bg-yellow-100 text-yellow-800 text-sm font-semibold">
        Scheme Not Assigned Yet
      </div>
    )}

    <div className="space-y-2 mb-4">
      <div className="flex items-center gap-2 text-sm">
        <FolderOpen className="w-4 h-4 text-gray-500" />
        <span className="text-gray-700">
          {request.village?.name || "Village removed"}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <FileText className="w-4 h-4 text-gray-500" />
        <span className="text-gray-700">
          {request.documents?.length || 0} Document
          {request.documents?.length > 1 ? "s" : ""}
        </span>
      </div>
    </div>

    <div className="pt-3 border-t border-gray-200">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">Budget</span>
        <span className="text-sm font-bold text-gray-900">
          {formatBudget(request.budget)}
        </span>
      </div>

      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-gray-500">Submitted</span>
        <span className="text-xs text-gray-600">
          {formatDate(request.createdAt)}
        </span>
      </div>
    </div>

    {request.description && (
      <p className="text-sm text-gray-600 mt-3 line-clamp-2">
        {request.description}
      </p>
    )}
  </div>
);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header with Create Button */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Project Requests
            </h1>
            <p className="text-gray-600">
              Total {requests.length} request{requests.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-semibold"
          >
            <Plus className="w-5 h-5" />
            New Request
          </button>
        </div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-gray-900">Create Project Request</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-5">
                  
                 

                  {/* Project Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.projectName}
                      onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                      placeholder="e.g., Road Construction"
                    />
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Budget (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                      placeholder="9000000"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                      rows="3"
                      placeholder="Describe the project... (e.g., Road from Main street to temple)"
                    />
                  </div>

                  {/* Document Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Document Type
                    </label>
                    <select
                      value={formData.documentType}
                      onChange={(e) => setFormData({...formData, documentType: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                    >
                      <option value="supporting">Supporting Document</option>
                      <option value="DPR">DPR</option>
                      <option value="land_clearance">Land Clearance</option>
                      <option value="govt_order">Government Order</option>
                    </select>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Documents
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Upload className="w-10 h-10 text-gray-400 mb-2" />
                        <span className="text-sm font-semibold text-gray-700">
                          Click to upload documents
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          PDF, DOC, JPG, PNG (Max 10MB each)
                        </span>
                      </label>
                    </div>

                    {/* Selected Files List */}
                    {selectedFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-600" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-500">
                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
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

                {/* Form Actions */}
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formLoading ? "Creating..." : "Create Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading requests...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && requests.length === 0 && !showCreateForm && (
          <div className="text-center py-20">
            <FolderOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-xl font-semibold text-gray-500">No requests found</p>
            <p className="text-gray-400 mt-2">Create your first project request</p>
          </div>
        )}

        {/* Requests List */}
        {!loading && requests.length > 0 && (
          <div className="space-y-10">

            {/* Created Projects Section */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <CheckCircle className="w-6 h-6 text-gray-900" />
                <h2 className="text-2xl font-bold text-gray-900">Created Projects</h2>
                <span className="px-3 py-1 bg-gray-900 text-white text-sm font-semibold rounded-full">
                  {approvedRequests.length}
                </span>
              </div>

              {approvedRequests.length === 0 ? (
                <div className="p-8 bg-white border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <p className="text-gray-500">No approved projects yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {approvedRequests.map(request => (
                    <RequestCard key={request._id} request={request} />
                  ))}
                </div>
              )}
            </section>

            {/* Pending Approval Section */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <Clock className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">Pending Approval</h2>
                <span className="px-3 py-1 bg-gray-200 text-gray-900 text-sm font-semibold rounded-full">
                  {pendingRequests.length}
                </span>
              </div>

              {pendingRequests.length === 0 ? (
                <div className="p-8 bg-white border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <p className="text-gray-500">No pending requests</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
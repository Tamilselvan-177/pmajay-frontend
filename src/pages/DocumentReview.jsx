import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { 
  Plus, Upload, FileText, ArrowLeft, CheckCircle, 
  XCircle, Clock, Eye, Download 
} from "lucide-react";

const QuotationDashboard = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [quotations, setQuotations] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
  });
  const [file, setFile] = useState(null);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // ============================
  // FETCH QUOTATIONS FOR PROJECT
  // ============================
  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/quotations/project/${projectId}`);
      setQuotations(res.data.data || []);
    } catch (err) {
      console.error("Failed fetching quotations:", err);
      alert("Failed to load quotations");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuotations();
  }, [projectId]);

  // ============================
  // CREATE QUOTATION
  // ============================
  const handleCreateQuotation = async (e) => {
    e.preventDefault();
    if (!file) return alert("Upload document required");

    const fd = new FormData();
    fd.append("projectId", projectId);
    fd.append("title", formData.title);
    fd.append("amount", formData.amount);
    fd.append("document", file);

    try {
      await api.post("/api/quotations/request", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Quotation created successfully!");
      setShowCreateForm(false);
      setFormData({ title: "", amount: "" });
      setFile(null);
      fetchQuotations();

    } catch (err) {
      alert(err.response?.data?.message || "Creation failed");
    }
  };

  // ============================
  // STATUS COLORS & LABELS
  // ============================
  const getStatusConfig = (status) => {
    const config = {
      pending: { 
        bg: "bg-yellow-100", 
        text: "text-yellow-800", 
        icon: Clock,
        label: "Pending"
      },
      proof_pending: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        icon: Upload,
        label: "Proof Submitted"
      },
      verified: { 
        bg: "bg-green-100", 
        text: "text-green-800", 
        icon: CheckCircle,
        label: "Verified"
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
          <p className="text-gray-600 text-lg">Loading quotations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate("/officer")}
          className="flex items-center gap-2 text-gray-700 hover:text-black font-semibold mb-6 bg-white px-4 py-2 rounded-lg shadow-sm border"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Quotations</h1>
            <p className="text-gray-600 mt-1">Manage project quotations</p>
          </div>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus className="w-5 h-5" /> New Quotation
          </button>
        </div>

        {/* Stats */}
        {quotations.length > 0 && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {quotations.filter(q => q.status === "pending").length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 mb-1">Proof Pending</p>
              <p className="text-2xl font-bold text-blue-600">
                {quotations.filter(q => q.status === "proof_pending").length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
              <p className="text-sm text-gray-600 mb-1">Verified</p>
              <p className="text-2xl font-bold text-green-600">
                {quotations.filter(q => q.status === "verified").length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
              <p className="text-sm text-gray-600 mb-1">Rejected</p>
              <p className="text-2xl font-bold text-red-600">
                {quotations.filter(q => q.status === "rejected").length}
              </p>
            </div>
          </div>
        )}

        {/* Quotations List */}
        {quotations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FileText className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Quotations Yet</h3>
            <p className="text-gray-500 mb-6">Create your first quotation to get started.</p>
            <button
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              onClick={() => setShowCreateForm(true)}
            >
              Create Quotation
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {quotations.map((q) => {
              const statusConfig = getStatusConfig(q.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div key={q._id} className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="font-bold text-2xl text-gray-800 mb-1">{q.title}</h2>
                      <p className="text-xl font-semibold text-blue-600">
                        ₹{q.amount?.toLocaleString()}
                      </p>
                    </div>

                    <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${statusConfig.bg} ${statusConfig.text}`}>
                      <StatusIcon size={16} /> {statusConfig.label}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    {q.documents && q.documents.length > 0 ? (
                      q.documents.map((doc) => (
                        <div key={doc._id} className="bg-gray-50 p-4 rounded-lg border">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-start gap-3 flex-1">
                              <FileText className="w-5 h-5 text-gray-600 mt-1" />
                              <div>
                                <p className="font-semibold text-gray-800">{doc.fileName}</p>
                                <p className="text-sm text-gray-600 capitalize">
                                  {doc.documentType}
                                </p>
                              </div>
                            </div>

                            <a
                              href={`${BASE_URL}${doc.fileUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold flex items-center gap-1"
                            >
                              <Eye size={12} /> View
                            </a>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No documents uploaded</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create Quotation Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-6 z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
              <h2 className="text-2xl font-bold mb-6">Create New Quotation</h2>

              <form onSubmit={handleCreateQuotation} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    className="border-2 w-full p-3 rounded-lg"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    className="border-2 w-full p-3 rounded-lg"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Document</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="border-2 w-full p-3 rounded-lg"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    className="flex-1 border-2 py-3 rounded-lg font-semibold hover:bg-gray-50"
                    onClick={() => {
                      setShowCreateForm(false);
                      setFormData({ title: "", amount: "" });
                      setFile(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
                  >
                    Create
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

export default QuotationDashboard;

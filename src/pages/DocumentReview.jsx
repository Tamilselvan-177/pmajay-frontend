import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { Plus, Upload, FileText, ArrowLeft } from "lucide-react";

const WorkPackageDashboard = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [packages, setPackages] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [additionalFile, setAdditionalFile] = useState(null);
  const [docType, setDocType] = useState("bill");

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    documentType: "bill",
  });
  const [file, setFile] = useState(null);

  const fetchPackages = async () => {
    try {
      const res = await api.get(`/api/work-packages/project/${projectId}/officer`);
      setPackages(res.data.data);
    } catch (err) {
      console.error("Failed fetching packages:", err);
    }
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
      alert("Work package created");
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

      alert("Document uploaded");
      setShowUploadModal(false);
      setAdditionalFile(null);
      fetchPackages();
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">

      <button
        onClick={() => navigate("/officer")}
        className="flex items-center gap-2 text-gray-700 hover:text-black font-semibold mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Work Packages</h1>
        <button
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus className="w-5 h-5" /> New Work Package
        </button>
      </div>

      <div className="space-y-6">
        {packages.map((pkg) => (
          <div key={pkg._id} className="p-5 border rounded-lg bg-white shadow">
            <div className="flex justify-between">
              <h2 className="font-bold text-xl">{pkg.title}</h2>
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  pkg.status === "approved"
                    ? "bg-green-600"
                    : pkg.status === "rejected"
                    ? "bg-red-600"
                    : "bg-yellow-600"
                } text-white`}
              >
                {pkg.status}
              </span>
            </div>

            <p className="text-gray-700">₹{pkg.amount.toLocaleString()}</p>

            <div className="mt-3 space-y-2">
              {pkg.documents.map((doc) => (
                <div key={doc._id} className="bg-gray-50 p-3 flex justify-between rounded">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <a href={doc.fileUrl} target="_blank" className="text-blue-600 underline">
                      {doc.fileName}
                    </a>
                  </div>
                  <span className="text-sm font-bold">{doc.status}</span>
                </div>
              ))}
            </div>

            <button
              className="mt-4 flex items-center gap-2 text-blue-700 underline"
              onClick={() => {
                setSelectedPackage(pkg._id);
                setShowUploadModal(true);
              }}
            >
              <Upload className="w-5 h-5" />
              Upload Additional Document
            </button>
          </div>
        ))}
      </div>

      {/* Upload Additional Doc Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center p-6 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Upload Additional Document</h2>

            <form onSubmit={handleUploadAdditionalDoc} className="space-y-4">
              <select
                className="border w-full p-2 rounded"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
              >
                <option value="bill">Bill</option>
                <option value="invoice">Invoice</option>
                <option value="material">Material</option>
              </select>

              <input
                type="file"
                accept=".pdf,.jpg,.png"
                className="border w-full p-2 rounded"
                onChange={(e) => setAdditionalFile(e.target.files[0])}
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 border py-2 rounded"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded"
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
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center p-6 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Work Package</h2>

            <form onSubmit={handleCreatePackage} className="space-y-4">
              <input
                type="text"
                placeholder="Package Title"
                className="border w-full p-2 rounded"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <input
                type="number"
                placeholder="Amount (₹)"
                className="border w-full p-2 rounded"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />

              <select
                className="border w-full p-2 rounded"
                value={formData.documentType}
                onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
              >
                <option value="bill">Bill</option>
                <option value="invoice">Invoice</option>
                <option value="material">Material</option>
              </select>

              <input
                type="file"
                accept=".pdf,.jpg,.png"
                className="border w-full p-2 rounded"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 border py-2 rounded"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default WorkPackageDashboard;

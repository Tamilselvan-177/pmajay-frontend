// src/pages/OfficerProjectVerification.jsx (No Map + Black & White Theme)
import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Upload, AlertCircle } from "lucide-react";

const OfficerProjectVerification = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [activeTab, setActiveTab] = useState("timeline");
  const [loading, setLoading] = useState(false);

  // Upload form state
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    photo: null,
    description: "",
    progressPercentage: 0,
    workStatus: "in_progress",
    issues: "",
    latitude: "",
    longitude: "",
    address: ""
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  // Fetch project and verifications
  const fetchData = async () => {
    try {
      const res = await api.get(`/api/verifications/timeline/${projectId}`);
      setProject(res.data.project);
      setVerifications(res.data.verifications || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  // Get current GPS location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          });
          alert("Location captured successfully!");
        },
        (error) => {
          alert("Unable to get location: " + error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.photo) {
      alert("Please select a photo");
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      alert("Please capture GPS location");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("photo", formData.photo);
      data.append("description", formData.description);
      data.append("progressPercentage", formData.progressPercentage);
      data.append("workStatus", formData.workStatus);
      data.append("issues", formData.issues);
      data.append("latitude", formData.latitude);
      data.append("longitude", formData.longitude);
      data.append("address", formData.address);

      await api.post(`/api/verifications/upload/${projectId}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Verification uploaded successfully!");
      setShowUploadForm(false);
      setFormData({
        photo: null,
        description: "",
        progressPercentage: 0,
        workStatus: "in_progress",
        issues: "",
        latitude: "",
        longitude: "",
        address: ""
      });
      setPhotoPreview(null);
      fetchData();
    } catch (err) {
      alert("Error uploading verification: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!project) return <p className="p-8 text-black">Loading...</p>;

  return (
    <div className="min-h-screen bg-white text-black p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-black hover:underline mb-2"
        >
          ← Back to Projects
        </button>
        <h1 className="text-3xl font-bold">{project.projectName}</h1>
        <p className="text-gray-700">{project.village?.name}</p>
        <div className="mt-2 flex gap-4 text-sm text-gray-700">
          <span>Progress: {project.currentProgress}%</span>
          <span>Status: {project.currentStatus}</span>
          <span>Verifications: {project.verificationCount}</span>
        </div>
      </div>

      {/* Upload Button */}
      <button
        onClick={() => setShowUploadForm(!showUploadForm)}
        className={`mb-6 ${showUploadForm ? "bg-red-600 hover:bg-red-700" : "bg-black hover:bg-gray-900"} text-white px-6 py-3 rounded-lg flex items-center gap-2`}
      >
        <Upload size={20} />
        {showUploadForm ? "Cancel Upload" : "Upload New Verification"}
      </button>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="mb-6 bg-white border border-gray-300 p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4 text-black">Upload Verification</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-bold mb-2 text-black">Photo *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="border border-gray-400 p-2 rounded w-full"
                required
              />
              {photoPreview && (
                <img src={photoPreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
              )}
            </div>

            <div>
              <label className="block font-bold mb-2 text-black">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border border-gray-400 p-2 rounded w-full text-black"
                rows="3"
                required
              />
            </div>

            <div>
              <label className="block font-bold mb-2 text-black">Progress Percentage</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progressPercentage}
                onChange={(e) => setFormData({ ...formData, progressPercentage: e.target.value })}
                className="border border-gray-400 p-2 rounded w-full text-black"
              />
            </div>

            <div>
              <label className="block font-bold mb-2 text-black">Work Status</label>
              <select
                value={formData.workStatus}
                onChange={(e) => setFormData({ ...formData, workStatus: e.target.value })}
                className="border border-gray-400 p-2 rounded w-full text-black"
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-2 text-black">Issues (if any)</label>
              <textarea
                value={formData.issues}
                onChange={(e) => setFormData({ ...formData, issues: e.target.value })}
                className="border border-gray-400 p-2 rounded w-full text-black"
                rows="2"
              />
            </div>

            <div>
              <label className="block font-bold mb-2 text-black">GPS Location *</label>
              <button
                type="button"
                onClick={getCurrentLocation}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900 flex items-center gap-2"
              >
                <MapPin size={20} />
                Capture Current Location
              </button>
              {formData.latitude && formData.longitude && (
                <p className="text-sm text-gray-700 mt-2">
                  Location: {formData.latitude}, {formData.longitude}
                </p>
              )}
            </div>

            <div>
              <label className="block font-bold mb-2 text-black">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="border border-gray-400 p-2 rounded w-full text-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 disabled:bg-gray-400"
            >
              {loading ? "Uploading..." : "Submit Verification"}
            </button>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b pb-2 mb-6">
        {["timeline", "overview"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-bold ${
              activeTab === tab
                ? "text-black border-b-2 border-black"
                : "text-gray-500"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Timeline Tab */}
      {activeTab === "timeline" && (
        <div className="space-y-5">
          {verifications.length === 0 && (
            <div className="bg-gray-200 p-4 rounded-lg flex items-center gap-2 text-black">
              <AlertCircle />
              <p>No verifications uploaded yet.</p>
            </div>
          )}
          {verifications.map((v) => (
            <div key={v._id} className="bg-white p-5 rounded-xl shadow border border-gray-300">
              <div className="flex gap-4">
                {v.photo?.fileType?.startsWith("image/") && (
                  <img
                    src={`http://localhost:5000${v.photo.fileUrl}`}
                    alt="verification"
                    className="w-32 h-32 object-cover rounded"
                  />
                )}

                <div className="flex-1 text-black">
                  <p className="font-bold text-lg">{v.description}</p>
                  <p className="text-sm text-gray-700 mt-1">
                    Verified by: {v.verifiedBy?.fullName} ({v.verifiedBy?.role})
                  </p>

                  <div className="mt-3 space-y-1 text-sm text-black">
                    <p className="flex items-center gap-2">
                      <Calendar size={16} />
                      {new Date(v.createdAt).toLocaleString()}
                    </p>
                    <p>
                      Progress: {v.progressPercentage}%
                    </p>
                    <p>Status: {v.workStatus}</p>
                    {v.issues && <p className="text-red-600">Issues: {v.issues}</p>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="bg-white p-6 rounded-xl shadow border border-gray-300">
          <h2 className="text-xl font-bold mb-4 text-black">Project Overview</h2>
          <div className="grid grid-cols-2 gap-4 text-black">
            <div>
              <p className="text-gray-800">Project Name</p>
              <p className="font-bold">{project.projectName}</p>
            </div>
            <div>
              <p className="text-gray-800">Village</p>
              <p className="font-bold">{project.village?.name}</p>
            </div>
            <div>
              <p className="text-gray-800">Budget</p>
              <p className="font-bold">₹{project.budget?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-800">Officer</p>
              <p className="font-bold">{project.officerInCharge?.fullName}</p>
            </div>
            <div>
              <p className="text-gray-800">Current Progress</p>
              <p className="font-bold">{project.currentProgress}%</p>
            </div>
            <div>
              <p className="text-gray-800">Status</p>
              <p className="font-bold">{project.currentStatus}</p>
            </div>
            <div>
              <p className="text-gray-800">Total Verifications</p>
              <p className="font-bold">{project.verificationCount}</p>
            </div>
            <div>
              <p className="text-gray-800">Last Verified</p>
              <p className="font-bold">
                {project.lastVerifiedAt
                  ? new Date(project.lastVerifiedAt).toLocaleDateString()
                  : "Never"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerProjectVerification;

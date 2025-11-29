// src/pages/ProjectVerification.jsx (FULL WIDTH - No margins)
import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import { Calendar, MapPin, AlertCircle } from "lucide-react";

const ProjectVerification = () => {
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [activeTab, setActiveTab] = useState("timeline");

  // Fetch timeline
  const fetchTimeline = async () => {
    try {
      const res = await api.get(`/api/verifications/timeline/${projectId}`);
      setProject(res.data.project);
      setTimeline(res.data.verifications || []);
    } catch (err) {
      console.error("Error fetching timeline:", err);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, [projectId]);

  if (!project) return <p className="p-8 text-black">Loading...</p>;

  return (
    <div className="min-h-screen bg-white text-black p-8"> {/* REMOVED max-w-7xl mx-auto */}
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black">{project.projectName}</h1>
        <p className="text-gray-700 mt-2 text-lg">{project.village?.name}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-300 pb-4 mb-8">
        {["overview", "timeline"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-bold transition-all ${
              activeTab === tab
                ? "text-black border-b-3 border-black shadow-sm bg-gray-50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-t-lg"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="bg-white p-8 rounded-xl shadow border border-gray-300 mx-auto max-w-6xl"> {/* Optional: center content */}
          <h2 className="text-2xl font-bold mb-6 text-black">Project Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-gray-700 font-semibold">Budget</p>
              <p className="text-2xl font-bold text-black">₹{project.budget?.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700 font-semibold">Officer</p>
              <p className="font-bold text-black">{project.officerInCharge?.fullName}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700 font-semibold">Progress</p>
              <p className="text-3xl font-bold text-black">{project.currentProgress}%</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700 font-semibold">Status</p>
              <p className="font-bold text-black">{project.currentStatus}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700 font-semibold">Verifications</p>
              <p className="text-2xl font-bold text-black">{project.verificationCount}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700 font-semibold">Last Verified</p>
              <p className="font-bold text-black">
                {project.lastVerifiedAt 
                  ? new Date(project.lastVerifiedAt).toLocaleDateString()
                  : "Never"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TIMELINE TAB */}
      {activeTab === "timeline" && (
        <div className="space-y-6">
          {timeline.length === 0 ? (
            <div className="bg-gray-200 p-8 rounded-xl border-2 border-gray-300 text-center text-black max-w-4xl mx-auto">
              <AlertCircle className="w-16 h-16 mx-auto text-gray-500 mb-4" />
              <p className="text-xl font-semibold mb-2">No verifications uploaded yet</p>
              <p className="text-gray-700">Verification timeline will appear here</p>
            </div>
          ) : (
            timeline.map((v) => (
              <div key={v._id} className="bg-white p-6 rounded-xl shadow border border-gray-300 hover:shadow-md transition-all max-w-6xl mx-auto">
                <div className="flex gap-6">
                  {/* Show only images */}
                  {v.photo?.fileType?.startsWith("image/") && (
                    <div className="flex-shrink-0">
                      <img
                        src={`http://localhost:5000${v.photo.fileUrl}`}
                        alt="verification"
                        className="w-40 h-40 object-cover rounded-lg shadow-md"
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <p className="text-xl font-bold text-black mb-2">{v.description}</p>

                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-700 bg-gray-100 px-3 py-1 rounded-md">
                        <Calendar size={16} />
                        {new Date(v.createdAt).toLocaleString()}
                      </div>
                      {v.location?.coordinates && (
                        <div className="flex items-center gap-2 text-gray-700 bg-gray-100 px-3 py-1 rounded-md">
                          <MapPin size={16} />
                          {v.location.coordinates[1].toFixed(4)}, {v.location.coordinates[0].toFixed(4)}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="bg-gray-200 p-3 rounded-lg">
                        <p className="text-gray-600 font-semibold">Progress</p>
                        <p className="text-2xl font-bold text-black">{v.progressPercentage}%</p>
                      </div>
                      <div className="bg-gray-200 p-3 rounded-lg">
                        <p className="text-gray-600 font-semibold">Status</p>
                        <p className="font-bold text-black capitalize">{v.workStatus}</p>
                      </div>
                    </div>

                    {v.issues && (
                      <div className="bg-gray-300 p-4 rounded-lg border border-gray-400 text-black">
                        <p className="font-semibold mb-1">Issues:</p>
                        <p className="text-sm">{v.issues}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectVerification;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import WorkPackageDocumentModal from "../pages/WorkPackageDocumentModal";
import { FileCheck, Clock, XCircle, CheckCircle, ArrowLeft, FileText } from "lucide-react";

const CollectorWorkPackages = () => {
  const { projectId } = useParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const fetchPackages = async () => {
    try {
      const res = await api.get(`/api/work-packages/project/${projectId}`);
      setPackages(res.data.data || []);
    } catch (err) {
      console.error("Failed to load work packages", err.response?.data);
    }
    setLoading(false);
  };

  const fetchPackageDetails = async (packageId) => {
    try {
      const res = await api.get(`/api/work-packages/${packageId}`);
      setSelectedPackage(res.data.work);
    } catch (err) {
      console.error("Failed to load package details", err.response?.data);
    }
  };

  // ⭐ Refresh function that updates BOTH the list AND selected package
  const handleRefresh = async () => {
    await fetchPackages(); // Refresh main list
    
    // If modal is open, refresh its data too
    if (selectedPackage) {
      await fetchPackageDetails(selectedPackage._id);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [projectId]);

  const getStatusBadge = (st) => {
    const config = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
      approved: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle },
      rejected: { bg: "bg-red-100", text: "text-red-800", icon: XCircle }
    };
    return config[st] || config.pending;
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading work packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm"
      >
        <ArrowLeft size={20} /> Back
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Work Packages</h1>
        <p className="text-gray-600">Review and approve work package documents</p>
      </div>

      {/* No Packages State */}
      {packages.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FileText className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Work Packages Yet</h3>
          <p className="text-gray-500">No work packages have been submitted for this project.</p>
        </div>
      ) : (
        <>
          {/* Stats Summary */}
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

          {/* Work Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((item) => {
              const badge = getStatusBadge(item.status);
              const Icon = badge.icon;
              const approvedDocs = item.documents?.filter(d => d.status === "approved").length || 0;
              const totalDocs = item.documents?.length || 0;

              return (
                <div 
                  key={item._id} 
                  className="bg-white p-6 border rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  {/* Title & Amount */}
                  <div className="mb-4">
                    <h2 className="font-bold text-xl mb-2 text-gray-800">{item.title}</h2>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{item.amount?.toLocaleString()}
                    </p>
                  </div>

                  {/* Created By */}
                  <div className="mb-3 text-sm text-gray-600">
                    <p>Created by: <span className="font-semibold">{item.createdBy?.fullName}</span></p>
                  </div>

                  {/* Document Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Documents</span>
                      <span>{approvedDocs}/{totalDocs} approved</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: totalDocs > 0 ? `${(approvedDocs / totalDocs) * 100}%` : '0%' }}
                      ></div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 ${badge.bg} ${badge.text}`}>
                    <Icon size={14} /> {item.status.toUpperCase()}
                  </div>

                  {/* View Button */}
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                    onClick={() => fetchPackageDetails(item._id)}
                  >
                    <FileCheck size={18} /> View Documents
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Modal */}
      {selectedPackage && (
        <WorkPackageDocumentModal
          pkg={selectedPackage}
          close={() => setSelectedPackage(null)}
          refresh={handleRefresh}
        />
      )}
    </div>
  );
};

export default CollectorWorkPackages;
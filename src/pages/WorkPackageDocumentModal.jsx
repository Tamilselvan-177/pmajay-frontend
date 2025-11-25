import React, { useState } from "react";
import { CheckCircle, XCircle, Download, FileText, Eye, AlertCircle, Package } from "lucide-react";
import api from "../api";

const WorkPackageDocumentModal = ({ pkg, close, refresh }) => {
  // Separate state for each document's comments
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState({});
  
  // State for work package level review
  const [packageReviewComments, setPackageReviewComments] = useState("");
  const [packageLoading, setPackageLoading] = useState(false);
  
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const handleReview = async (docId, decision) => {
    if (!comments[docId]?.trim()) {
      alert("Please enter review comments before submitting");
      return;
    }

    setLoading(prev => ({ ...prev, [docId]: true }));

    try {
      await api.put(`/api/work-packages/documents/${docId}/review`, {
        decision,
        comments: comments[docId]
      });

      alert(`Document ${decision} successfully!`);
      
      // Refresh both the main list and close modal
      await refresh();
      close();
    } catch (err) {
      console.error("Review error:", err);
      alert(err.response?.data?.message || "Error updating document status");
    } finally {
      setLoading(prev => ({ ...prev, [docId]: false }));
    }
  };

  // NEW: Handle Work Package Approval/Rejection
  const handleWorkPackageReview = async (decision) => {
    // Check if all documents are approved when trying to approve package
    if (decision === "approved") {
      const allApproved = pkg.documents.every(doc => doc.status === "approved");
      if (!allApproved) {
        alert("All documents must be approved before approving the work package");
        return;
      }
    }

    if (!packageReviewComments.trim()) {
      alert("Please enter review comments for the work package");
      return;
    }

    setPackageLoading(true);

    try {
      await api.put(`/api/work-packages/${pkg._id}/review`, {
        decision,
        reason: packageReviewComments
      });

      alert(`Work Package ${decision} successfully!`);
      
      await refresh();
      close();
    } catch (err) {
      console.error("Work Package review error:", err);
      alert(err.response?.data?.message || "Error updating work package status");
    } finally {
      setPackageLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending Review" },
      approved: { bg: "bg-green-100", text: "text-green-800", label: "Approved" },
      rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" }
    };
    return badges[status] || badges.pending;
  };

  const packageBadge = getStatusBadge(pkg.status);
  const allDocumentsReviewed = pkg.documents.every(doc => 
    doc.status === "approved" || doc.status === "rejected"
  );
  const allDocumentsApproved = pkg.documents.every(doc => doc.status === "approved");
  const isPackageReviewed = pkg.status === "approved" || pkg.status === "rejected";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[700px] max-h-[90vh] overflow-auto shadow-xl">
        
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FileText className="text-blue-600" /> Work Package Documents
        </h2>

        {/* Work Package Info */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xl font-bold mb-1">{pkg.title}</p>
              <p className="text-lg text-gray-700">Amount: ₹{pkg.amount?.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">
                Created by: {pkg.createdBy?.fullName || "N/A"}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${packageBadge.bg} ${packageBadge.text}`}>
              {packageBadge.label}
            </span>
          </div>
        </div>

        {/* Documents Section */}
        {pkg.documents.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="mx-auto text-gray-400 mb-2" size={48} />
            <p className="text-gray-500">No documents uploaded</p>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {pkg.documents.map((doc) => {
              const badge = getStatusBadge(doc.status);
              const isReviewed = doc.status === "approved" || doc.status === "rejected";

              return (
                <div 
                  key={doc._id} 
                  className={`border-2 rounded-lg p-5 ${
                    isReviewed ? 'bg-gray-50 border-gray-300' : 'bg-white border-blue-200'
                  }`}
                >
                  {/* Document Info */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-lg">{doc.fileName}</p>
                      <p className="text-sm text-gray-600 capitalize">{doc.documentType}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* View/Download Buttons */}
                  <div className="flex gap-3 mb-4">
                    <a
                      href={`${BASE_URL}${doc.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 font-semibold"
                    >
                      <Eye size={18} /> View
                    </a>

                    <a
                      href={`${BASE_URL}${doc.fileUrl}`}
                      download
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 font-semibold"
                    >
                      <Download size={18} /> Download
                    </a>
                  </div>

                  {/* Show existing review info if already reviewed */}
                  {isReviewed ? (
                    <div className="bg-white p-3 rounded border">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Review Comments:</p>
                      <p className="text-sm text-gray-600">{doc.reviewComments || "No comments"}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Reviewed on {new Date(doc.reviewedAt).toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Review Comments Input */}
                      <textarea
                        placeholder="Enter review comments (required)"
                        value={comments[doc._id] || ""}
                        onChange={(e) => setComments(prev => ({ 
                          ...prev, 
                          [doc._id]: e.target.value 
                        }))}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        rows="3"
                      />

                      {/* Approve/Reject Buttons */}
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => handleReview(doc._id, "approved")}
                          disabled={loading[doc._id]}
                          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold transition"
                        >
                          <CheckCircle size={18} /> 
                          {loading[doc._id] ? "Processing..." : "Approve"}
                        </button>

                        <button
                          onClick={() => handleReview(doc._id, "rejected")}
                          disabled={loading[doc._id]}
                          className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold transition"
                        >
                          <XCircle size={18} /> 
                          {loading[doc._id] ? "Processing..." : "Reject"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Work Package Level Review Section */}
        {!isPackageReviewed && allDocumentsReviewed && (
          <div className="border-t-2 pt-6 mb-6">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <Package className="text-blue-600" size={24} />
                <h3 className="text-xl font-bold text-gray-800">Final Work Package Review</h3>
              </div>

              {allDocumentsApproved ? (
                <div className="bg-green-50 border border-green-300 p-3 rounded-lg mb-4">
                  <p className="text-green-800 text-sm font-semibold">
                    ✓ All documents have been approved. You can now approve the work package.
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-300 p-3 rounded-lg mb-4">
                  <p className="text-yellow-800 text-sm font-semibold">
                    ⚠ Some documents were rejected. You can reject the work package or wait for resubmission.
                  </p>
                </div>
              )}

              <textarea
                placeholder="Enter final review comments for work package (required)"
                value={packageReviewComments}
                onChange={(e) => setPackageReviewComments(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none mb-4"
                rows="4"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => handleWorkPackageReview("approved")}
                  disabled={packageLoading || !allDocumentsApproved}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition text-lg"
                >
                  <CheckCircle size={20} /> 
                  {packageLoading ? "Processing..." : "Approve Work Package"}
                </button>

                <button
                  onClick={() => handleWorkPackageReview("rejected")}
                  disabled={packageLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition text-lg"
                >
                  <XCircle size={20} /> 
                  {packageLoading ? "Processing..." : "Reject Work Package"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Show rejection reason if package is rejected */}
        {isPackageReviewed && (
          <div className={`mb-6 p-4 rounded-lg border-2 ${
            pkg.status === "approved" 
              ? "bg-green-50 border-green-300" 
              : "bg-red-50 border-red-300"
          }`}>
            <p className="font-semibold mb-2">
              Work Package {pkg.status === "approved" ? "Approved" : "Rejected"}
            </p>
            {pkg.rejectionReason && (
              <p className="text-sm text-gray-700">
                <strong>Comments:</strong> {pkg.rejectionReason}
              </p>
            )}
          </div>
        )}

        <button 
          onClick={close} 
          className="w-full mt-6 bg-gray-200 hover:bg-gray-300 py-3 rounded-lg font-semibold transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default WorkPackageDocumentModal;
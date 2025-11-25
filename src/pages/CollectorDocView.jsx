import React, { useState } from "react";
import { CheckCircle, XCircle, Download, FileText, Eye } from "lucide-react";
import api from "../api";

const DocumentReviewModal = ({ doc, close, refresh }) => {
  const [note, setNote] = useState("");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://backendpmajay.onrender.com";

  const handleReview = async (decision) => {
    try {
      await api.put(`/api/projects/document/${doc._id}/review`, {
        decision,
        comments: note
      });

      refresh();
      close();
    } catch (err) {
      console.error("Review error:", err);
      alert("Error updating document status");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-[500px]">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FileText /> Review Document
        </h2>

        <p className="font-semibold text-gray-800">{doc.fileName}</p>

        <div className="flex gap-3 mt-3">
          <a
            href={`${BASE_URL}${doc.fileUrl}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <Eye size={18} /> View
          </a>

          <a
            href={`${BASE_URL}${doc.fileUrl}`}
            download
            className="flex-1 text-center bg-gray-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <Download size={18} /> Download
          </a>
        </div>

        <textarea
          className="w-full border rounded-lg p-3 mt-4"
          placeholder="Enter review comments"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="flex gap-2 mt-5">
          <button
            onClick={() => handleReview("approved")}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <CheckCircle /> Approve
          </button>

          <button
            onClick={() => handleReview("rejected")}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <XCircle /> Reject
          </button>
        </div>

        <button
          onClick={close}
          className="mt-4 w-full border py-2 rounded-lg font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DocumentReviewModal;

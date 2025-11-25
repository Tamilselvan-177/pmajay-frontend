import React, { useEffect, useState } from "react";
import api from "../api";

const ProjectModal = ({ project, close, refresh }) => {
  const [documents, setDocuments] = useState([]);

  const fetchDocuments = async () => {
    const res = await api.get(`/api/documents/project/${project._id}`);
    setDocuments(res.data.documents);
  };

  const reviewDoc = async (docId, decision) => {
    await api.put(`/api/projects/document/${docId}/review`, {
      decision,
      comments: decision === "approved" ? "Verified" : "Rejected due to mismatch",
    });
    fetchDocuments();
  };

  const approveProject = async () => {
    await api.put(`/api/projects/request/${project._id}/review`, {
      decision: "approved",
    });
    refresh();
    close();
  };

  const rejectProject = async () => {
    await api.put(`/api/projects/request/${project._id}/review`, {
      decision: "rejected",
      reason: "Insufficient proof documents",
    });
    refresh();
    close();
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-[800px] p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold mb-4">{project.projectName}</h2>

        <h3 className="text-lg font-bold mt-4 mb-2">Documents</h3>
        {documents.map((doc) => (
          <div key={doc._id} className="p-3 flex justify-between border rounded mb-2">
            <a href={doc.fileUrl} target="_blank" className="text-blue-600 font-bold">
              {doc.fileName}
            </a>
            <div>
              <button onClick={() => reviewDoc(doc._id, "approved")} className="bg-green-600 text-white px-3 py-1 rounded mr-2">
                Approve
              </button>
              <button onClick={() => reviewDoc(doc._id, "rejected")} className="bg-red-600 text-white px-3 py-1 rounded">
                Reject
              </button>
            </div>
          </div>
        ))}

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={close} className="px-4 py-2 bg-gray-400 text-white rounded">Close</button>
          <button onClick={rejectProject} className="px-4 py-2 bg-red-600 text-white rounded">Reject Request</button>
          <button onClick={approveProject} className="px-6 py-2 bg-green-600 text-white rounded font-bold">Approve</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;

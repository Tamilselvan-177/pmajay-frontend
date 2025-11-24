import React, { useEffect, useState } from "react";
import axios from "../api";
import { useParams } from "react-router-dom";
import { FileText, Upload } from "lucide-react";

const ProjectDetails = () => {
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [documents, setDocuments] = useState([]);

  const fetchProject = async () => {
    const res = await axios.get(`/projects/${projectId}`);
    setProject(res.data.project);
  };

  const fetchDocuments = async () => {
    const res = await axios.get(`/documents/project/${projectId}`);
    setDocuments(res.data);
  };

  useEffect(() => {
    fetchProject();
    fetchDocuments();
  }, []);

  return (
    <div className="p-8">
      {project && (
        <>
          <h1 className="text-3xl font-bold">{project.projectName}</h1>
          <p className="text-gray-600">Village: {project.village}</p>

          <h2 className="text-2xl mt-8 font-bold">Documents</h2>

          <div className="grid grid-cols-3 gap-4 mt-4">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="p-4 bg-white rounded-xl shadow border"
              >
                <FileText className="w-10 h-10 text-blue-600" />
                <p className="font-bold mt-2">{doc.documentType}</p>
                <p className="text-sm text-gray-600">{doc.fileName}</p>

                <a
                  href={`http://localhost:5000${doc.fileUrl}`}
                  target="_blank"
                  className="text-blue-600 underline mt-2 block"
                >
                  Download
                </a>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-bold mt-8">Upload New Document</h3>
          <form
            action={`http://localhost:5000/api/documents/upload/${projectId}`}
            method="POST"
            encType="multipart/form-data"
            className="mt-4"
          >
            <input name="file" type="file" className="mb-3" />
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2">
              <Upload /> Upload
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ProjectDetails;

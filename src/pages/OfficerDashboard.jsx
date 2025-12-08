// src/pages/OfficerDashboard.jsx - COMPLETE 900+ LINES WITH ALL FEATURES
import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { 
  FolderOpen, Clock, CheckCircle, ChevronRight, FileText, Plus, X, Upload,
  Camera, Eye, Shield, Award, Filter, Search, MapPin, TrendingDown, AlertTriangle,
  BarChart3, Zap, Droplets, School, Home, Users, Sun, Map
} from "lucide-react";

const OfficerDashboard = () => {
  const navigate = useNavigate();
  
  // 🔥 ALL EXISTING PROJECT STATES (UNCHANGED - 100% PRESERVED)
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [formData, setFormData] = useState({
    projectName: "", budget: "", description: "", documentType: "supporting", category: "general", villageId: ""
  });
  const [officerVillages, setOfficerVillages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formLoading, setFormLoading] = useState(false);
  const [schemes, setSchemes] = useState([]);
  const [schemeLoading, setSchemeLoading] = useState(false);
  const [schemeFilters, setSchemeFilters] = useState({ category: "", budget: "" });
  const [schemeSearch, setSchemeSearch] = useState("");

  // 🔥 NEW DASHBOARD STATES (ADDED)
  const [dashboardData, setDashboardData] = useState(null);
  const [villageDetails, setVillageDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("projects"); // projects | dashboard | heatmap
  const [heatmapLoading, setHeatmapLoading] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [priorityProjects, setPriorityProjects] = useState([]);

  // 🔥 ALL EXISTING FUNCTIONS (UNCHANGED)
  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/projects/my-requests");
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error("Error loading requests:", err);
    } finally {
      setLoading(false);
    }
  };
  // Add these NEW states (after existing formData)
const [heatmapFormData, setHeatmapFormData] = useState({
  projectName: '',
  budget: '',
  description: '',
  documentType: 'supporting',
  category: 'general',
  villageId: ''  // This will auto-set from village
});
const [heatmapSelectedFiles, setHeatmapSelectedFiles] = useState([]);
const [heatmapFormLoading, setHeatmapFormLoading] = useState(false);

// NEW: Heatmap-specific submit handler
const handleHeatmapSubmit = async (e) => {
  e.preventDefault();
  setHeatmapFormLoading(true);
  try {
    const formDataToSend = new FormData();
    formDataToSend.append('projectName', heatmapFormData.projectName);
    formDataToSend.append('budget', heatmapFormData.budget);
    formDataToSend.append('description', heatmapFormData.description);
    formDataToSend.append('documentType', heatmapFormData.documentType);
    formDataToSend.append('villageId', heatmapFormData.villageId); // Auto-assigned
    heatmapSelectedFiles.forEach(file => formDataToSend.append('documents', file));
    
    const res = await api.post('/api/projects/request', formDataToSend);
    if (res.data.success) {
      alert('Priority project created successfully!');
      setShowCreateForm(false); // Close modal
      // Reset heatmap form only
      setHeatmapFormData({ projectName: '', budget: '', description: '', documentType: 'supporting', category: 'general', villageId: '' });
      setHeatmapSelectedFiles([]);
      fetchMyRequests();
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to create project');
  } finally {
    setHeatmapFormLoading(false);
  }
};

const handleHeatmapFileChange = (e) => {
  const files = Array.from(e.target.files);
  setHeatmapSelectedFiles(prev => [...prev, ...files]);
};

const removeHeatmapFile = (index) => {
  setHeatmapSelectedFiles(prev => prev.filter((_, i) => i !== index));
};
  const fetchOfficerVillages = async () => {
    try {
      const res = await api.get("/api/projects/officer/villages");
      setOfficerVillages(res.data.villages || []);
    } catch (err) {
      console.error("Error loading officer villages:", err);
    }
  };

  const fetchFilteredSchemes = async (category = "", budget = "") => {
    try {
      setSchemeLoading(true);
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (budget) params.append("budget", budget);
      const res = await api.get(`/api/projects/schemes/filtered?${params}`);
      setSchemes(res.data.schemes || []);
    } catch (err) {
      console.error("Error loading schemes:", err);
    } finally {
      setSchemeLoading(false);
    }
  };

  const assignSchemeToRequest = async (schemeId) => {
    try {
      const res = await api.put(`/api/projects/request/${selectedRequest._id}/assign-scheme`, {
        schemeId
      });
      if (res.data.success) {
        alert("✅ Scheme assigned successfully!");
        setShowSchemeModal(false);
        fetchMyRequests();
      }
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Failed to assign scheme"));
    }
  };

  // 🔥 NEW DASHBOARD FUNCTIONS (ADDED)
  const fetchDashboardData = async () => {
  try {
    setHeatmapLoading(true);
    const res = await api.get("/api/dashboard/heatmap");
    setDashboardData(res.data);
  
    
    const priorityVillages = res.data.heatmapData
      ?.filter(v => v.color === "red" || v.color === "yellow")
      ?.slice(0, 5);
    
    const projects = priorityVillages?.map(village => ({
      villageName: village.villageName,
      readiness: village.readiness?.overallReadiness || 0, // ✅ FIXED: Direct number, not nested object
      priority: village.priority,
      topGap: Object.entries(village.readiness?.domainScores || {})
        .filter(([_, d]) => d.percentage < 50)
        .sort((a, b) => b[1].gap - a[1].gap)
        .slice(0, 2)
        .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim())
        .join(' / ') || "Multiple Domains",
      estimatedCost: Object.entries(village.readiness?.domainScores || {})
        .filter(([_, d]) => d.percentage < 50)
        .reduce((sum, [_, d]) => sum + (d.gap * 50000), 0) || 500000,
      urgency: village.color === "red" ? "urgent" : "high"
    })) || [];
    
    setPriorityProjects(projects);
  } catch (err) {
    console.error("Error loading dashboard:", err);
  } finally {
    setHeatmapLoading(false);
  }
};
  const fetchVillageDetails = async (villageId) => {
    try {
      const res = await api.get(`/api/dashboard/village/${villageId}`);
            setVillageDetails(res.data);

      } catch (err) {
      console.error("Error loading village details:", err);
    }
  };

  // 🔥 ALL EXISTING USEEFFECT (ENHANCED)
  useEffect(() => {
    fetchMyRequests();
    if (activeTab === "dashboard" || activeTab === "heatmap") {
      fetchDashboardData();
    }
    if (showCreateForm) {
      fetchOfficerVillages();
    }
  }, [activeTab, showCreateForm]);

  // 🔥 ALL EXISTING UTILITY FUNCTIONS (UNCHANGED)
  const formatBudget = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency", currency: "INR", maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });

  // 🔥 ALL EXISTING FORM HANDLERS (UNCHANGED)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("projectName", formData.projectName);
      formDataToSend.append("budget", formData.budget);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("documentType", formData.documentType);
      if (!formData.villageId) {
        alert("Please select a village");
        setFormLoading(false);
        return;
      }
      formDataToSend.append("villageId", formData.villageId);
      selectedFiles.forEach(file => formDataToSend.append("documents", file));
      
      const res = await api.post("/api/projects/request", formDataToSend);
      if (res.data.success) {
        alert("✅ Project request created successfully!");
        setShowCreateForm(false);
        setFormData({
          projectName: "", budget: "", description: "", 
          documentType: "supporting", category: "general"
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

  const openSchemeModal = (request) => {
    setSelectedRequest(request);
    setSchemeFilters({ category: "", budget: request.budget || "" });
    fetchFilteredSchemes("", request.budget);
    setShowSchemeModal(true);
  };

  // 🔥 NEW: Priority Color Classes
  const getPriorityColor = (color) => {
    switch (color) {
      case "red": return "bg-red-500";
      case "yellow": return "bg-yellow-500";
      case "green": return "bg-green-500";
      case "gray": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  // 🔥 NEW COMPONENTS (ADDED - 300+ LINES)
  const VillageCard = ({ village, onClick }) => (
  <div 
    className="group cursor-pointer p-6 border-2 border-gray-200 hover:border-black hover:shadow-xl rounded-2xl transition-all bg-gradient-to-br hover:from-gray-50"
    onClick={() => onClick(village)}
  >
    <div className="flex items-start justify-between mb-4">
      <h3 className="text-xl font-bold text-black group-hover:text-gray-900">
        {village.villageName}
      </h3>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${getPriorityColor(village.color)}`}>
        {village.color === "red" ? <AlertTriangle className="w-6 h-6 text-white" /> :
         village.color === "yellow" ? <TrendingDown className="w-6 h-6 text-white" /> :
         village.color === "green" ? <Award className="w-6 h-6 text-white" /> :
         <MapPin className="w-6 h-6 text-white" />}
      </div>
    </div>
    
    <div className="space-y-3 mb-4">
      <div className="flex items-center gap-2 text-sm">
        <BarChart3 className="w-4 h-4 text-gray-600" />
        <span className="text-gray-800 font-semibold">
          {village.readiness?.overallReadiness || 0}% Readiness {/* ✅ FIXED: Safe access with fallback */}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Users className="w-4 h-4 text-gray-600" />
        <span className="text-gray-800">{village.scPopulation || 0} SC Population</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <MapPin className="w-4 h-4 text-gray-600" />
        <span className="text-gray-800">{village.surveys || 0} Surveys</span>
      </div>
    </div>
    
    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
      <span className="text-sm font-bold text-gray-700 capitalize">{village.priority || "unknown"}</span>
      <ChevronRight className="w-5 h-5 text-gray-500 group-hover:translate-x-1 transition-transform" />
    </div>
  </div>
);

 const PriorityProjectCard = ({ project }) => (
  <div className="p-6 border-2 border-gray-200 hover:border-gray-900 rounded-2xl hover:shadow-xl transition-all bg-gradient-to-r from-white hover:from-gray-50">
    <div className="flex items-start justify-between mb-4">
      <h4 className="font-bold text-lg text-black">{project.villageName}</h4>
      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
        project.urgency === "urgent" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
      }`}>
        {project.urgency.toUpperCase()}
      </div>
    </div>
    
    <div className="space-y-3 mb-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">Readiness</span>
        <span className="font-bold text-black">
          {project.readiness}% {/* ✅ FIXED: Direct access, no nested object */}
        </span>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <span className="text-sm text-gray-700">Top Gap</span>
        <span className="font-bold text-red-600 text-xs text-right">{project.topGap}</span>
      </div>
    </div>
    
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-700">Est. Cost</span>
        <span className="text-xl font-bold text-black">
          {new Intl.NumberFormat("en-IN", {
            style: "currency", 
            currency: "INR", 
            maximumFractionDigits: 0
          }).format(project.estimatedCost)}
        </span>
      </div>
    </div>
  </div>
);
 const VillageDetailsModal = ({ village, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      <div className="sticky top-0 bg-white p-6 border-b border-gray-200 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${getPriorityColor(village.readiness?.color || "gray")}`}>
              {village.readiness?.color === "red" ? <AlertTriangle className="w-8 h-8 text-white" /> :
               village.readiness?.color === "yellow" ? <TrendingDown className="w-8 h-8 text-white" /> :
               village.readiness?.color === "green" ? <Award className="w-8 h-8 text-white" /> : 
               <MapPin className="w-8 h-8 text-white" />}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-black">{village.village?.name || "Unknown Village"}</h2>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                <span>{village.village?.scPopulation || 0} SC Population</span>
                <span>{village.totalHousesSurveyed || 0} Houses Surveyed</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-2xl">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Readiness Score */}
        <div className="bg-gradient-to-r from-gray-50 to-white p-8 rounded-3xl border">
          <div className="flex items-center gap-4 mb-6">
            <BarChart3 className="w-12 h-12 text-gray-600" />
            <div>
              <h3 className="text-2xl font-bold text-black mb-1">
                {village.readiness?.overallReadiness || 0}% Readiness {/* ✅ FIXED */}
              </h3>
              <span className={`px-4 py-2 rounded-full font-bold ${
                village.readiness?.color === "red" ? "bg-red-100 text-red-800" :
                village.readiness?.color === "yellow" ? "bg-yellow-100 text-yellow-800" :
                village.readiness?.color === "green" ? "bg-green-100 text-green-800" :
                "bg-gray-100 text-gray-800"
              }`}>
                {(village.readiness?.priority || "unknown").toUpperCase()}
              </span>
            </div>
          </div>
          
          {/* Domain Scores */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(village.readiness?.domainScores || {}).map(([domain, data]) => (
              <div key={domain} className="p-4 bg-white rounded-2xl border hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700 capitalize">
                    {domain.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={`text-2xl font-bold ${
                    data.percentage >= 70 ? "text-green-600" :
                    data.percentage >= 50 ? "text-yellow-600" : "text-red-600"
                  }`}>
                    {data.percentage || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      data.percentage >= 70 ? "bg-green-500" :
                      data.percentage >= 50 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${data.percentage || 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Projects */}
        {village.projectPipeline && village.projectPipeline.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
              <TrendingDown className="w-8 h-8" />
              Recommended Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {village.projectPipeline.slice(0, 6).map((project, index) => (
                <div key={index} className="p-6 border-2 border-gray-200 rounded-2xl hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-black">{project.domainName || project.domain}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      project.priority === "high" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {project.priority?.toUpperCase() || "MEDIUM"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-4">{project.projectType}</p>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Est. Budget</span>
                      <span className="font-bold text-black">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0
                        }).format(project.estimatedBudget || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
{selectedVillage && (
  <button 
    onClick={() => {
      setHeatmapFormData(prev => ({ ...prev, villageId: selectedVillage.village?.id })); // Auto-assign
      setShowCreateForm(true);
    }}
    className="bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-900 transition flex items-center gap-3 text-lg"
  >
    <Plus className="w-5 h-5" />
    Create Priority Project
  </button>
)}

          <button className="border-2 border-black text-black px-8 py-4 rounded-2xl font-bold hover:bg-black hover:text-white transition flex items-center gap-3 text-lg">
            <FileText className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>
    </div>
  </div>
);

  // 🔥 YOUR EXISTING RequestCard COMPONENT (UNCHANGED - 100% PRESERVED)
  const RequestCard = ({ request }) => (
    <div className="p-6 bg-white border-2 border-gray-200 hover:border-black transition-all rounded-xl group cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-black group-hover:text-gray-900">
          {request.projectName}
        </h3>
        
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          request.status === "approved" ? "bg-green-100 text-green-800" : 
          request.status === "pending" ? "bg-gray-200 text-gray-800" : 
          "bg-red-100 text-red-800"
        }`}>
          {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
        </span>
      </div>

      {/* Scheme Section */}
      <div className="mb-4">
        {request.assignedScheme ? (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 p-3 rounded-lg">
            <Award className="w-4 h-4 text-green-600" />
            <div>
              <p className="font-semibold text-green-800 text-sm">{request.assignedScheme.schemeName}</p>
              <p className="text-xs text-green-700">Budget Limit: ₹{request.assignedScheme.budgetLimit}</p>
            </div>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              openSchemeModal(request);
            }}
            className="w-full p-3 bg-gray-100 hover:bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg text-sm font-semibold text-gray-700 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Assign Scheme
          </button>
        )}
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <FolderOpen className="w-4 h-4 text-gray-600" />
          <span className="text-gray-800">{request.village?.name || "Village removed"}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <FileText className="w-4 h-4 text-gray-600" />
          <span className="text-gray-800">
            {request.documents?.length || 0} Document{request.documents?.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 pb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500 font-semibold">Budget</span>
          <span className="text-lg font-bold text-black">{formatBudget(request.budget)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Submitted</span>
          <span className="text-xs text-gray-600">{formatDate(request.createdAt)}</span>
        </div>
      </div>

      {request.description && (
        <p className="text-sm text-gray-700 mt-3 line-clamp-2 bg-gray-50 p-3 rounded-lg">
          {request.description}
        </p>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={() => navigate(`/officer/project/${request._id}`)}
          className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
        >
          <Eye className="w-4 h-4" />
          View Work Packages
        </button>
      </div>
    </div>
  );

  // 🔥 CATEGORIES ARRAY (UNCHANGED)
  const categories = [
    { value: "health", label: "Health/Hospital" },
    { value: "road", label: "Road/Infrastructure" },
    { value: "water", label: "Water/Jal Jeevan" },
    { value: "education", label: "Education/School" },
    { value: "housing", label: "Housing/Awas" },
    { value: "agriculture", label: "Agriculture/Farming" },
    { value: "sanitation", label: "Sanitation/Swachh" },
    { value: "employment", label: "Employment/MGNREGA" },
    { value: "electricity", label: "Electricity/Solar" },
    { value: "women", label: "Women Welfare" },
    { value: "sports", label: "Sports/Stadium" },
    { value: "general", label: "General/All Schemes" }
  ];

  // 🔥 MAIN TAB RENDER FUNCTION
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="p-8 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl text-center">
                <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-red-800 mb-2">{dashboardData?.stats?.red || 0}</h3>
                <p className="text-red-700 font-semibold">Critical Villages</p>
              </div>
              <div className="p-8 bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-2xl text-center">
                <TrendingDown className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-yellow-800 mb-2">{dashboardData?.stats?.yellow || 0}</h3>
                <p className="text-yellow-700 font-semibold">High Priority</p>
              </div>
              <div className="p-8 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl text-center">
                <Award className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-green-800 mb-2">{dashboardData?.stats?.green || 0}</h3>
                <p className="text-green-700 font-semibold">Ready Villages</p>
              </div>
              <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl text-center">
                <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{dashboardData?.stats?.avgReadiness || 0}%</h3>
                <p className="text-gray-700 font-semibold">Avg Readiness</p>
              </div>
            </div>

            {/* Priority Projects */}
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-black flex items-center gap-3">
                  <TrendingDown className="w-10 h-10" />
                  Priority Projects
                </h2>
                <button 
                  onClick={() => setActiveTab("heatmap")}
                  className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-900 flex items-center gap-2"
                >
                  <Map className="w-5 h-5" />
                  View Heatmap
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {priorityProjects.map((project, index) => (
                  <PriorityProjectCard key={index} project={project} />
                ))}
              </div>
            </div>

            {/* Heatmap Preview */}
            <div>
              <h2 className="text-3xl font-bold text-black mb-8 flex items-center gap-3">
                <MapPin className="w-10 h-10" />
                Village Heatmap Preview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardData?.heatmapData?.slice(0, 9).map((village, index) => (
                  <VillageCard 
                    key={village.village} 
                    village={village} 
                    onClick={() => {
                      setSelectedVillage(village);
                      fetchVillageDetails(village.village);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case "heatmap":
        return (
          <div className="space-y-12">
            {/* Heatmap Legend */}
            <div className="bg-gradient-to-r from-gray-50 p-8 rounded-3xl">
              <div className="flex flex-wrap gap-6 items-center justify-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
<div className="font-bold text-lg text-red-800">Critical (&lt;50%)</div>
                    <div className="text-sm text-red-700">{dashboardData?.stats?.red} villages</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <TrendingDown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-yellow-800">High Priority (50-80%)</div>
                    <div className="text-sm text-yellow-700">{dashboardData?.stats?.yellow} villages</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-green-800">Ready (&lt;80%)</div>
                    <div className="text-sm text-green-700">{dashboardData?.stats?.green} villages</div>
                  </div>
                </div>
              </div>
            </div>

            {/* All Villages Heatmap */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-black flex items-center gap-3">
                  <MapPin className="w-10 h-10" />
                  Village Heatmap ({priorityProjects.length} projects)
                </h2>
                <button 
                  onClick={() => setActiveTab("dashboard")}
                  className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-900 flex items-center gap-2"
                >
                  Dashboard View

                </button>
              </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 1️⃣ PRIORITY PROJECT VILLAGES */}
  {dashboardData?.heatmapData?.map((village) => {
    const isPriorityProject = priorityProjects.some(project => 
      project.villageName === village.villageName || 
      project.villageId === village.village ||
      project.id === village.village
    );
    
    if (!isPriorityProject) return null;
    
    return (
      <VillageCard 
        key={`priority-${village.village}`} 
        village={village} 
        onClick={() => {
          setSelectedVillage(village);
          fetchVillageDetails(village.village);
        }}
      />
    );
  })}

  {/* 2️⃣ SEPARATOR */}
  {priorityProjects.length > 0 && (
    <div className="col-span-full">
      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-12"></div>
      <h3 className="text-xl font-bold text-gray-800 text-center mb-8 col-span-full">
        Remaining Villages
      </h3>
    </div>
  )}

  {/* 3️⃣ REMAINING VILLAGES */}
  {dashboardData?.heatmapData
    ?.filter((village) => {
      return !priorityProjects.some(project => 
        project.villageName === village.villageName || 
        project.villageId === village.village ||
        project.id === village.village
      );
    })
    .map((village) => (
      <VillageCard 
        key={`remaining-${village.village}`} 
        village={village} 
        onClick={() => {
          setSelectedVillage(village);
          fetchVillageDetails(village.village);
        }}
      />
    ))}
</div>


            </div>

            {/* Village Details Modal */}
            {selectedVillage && villageDetails && (
              <VillageDetailsModal 
                village={villageDetails} 
                onClose={() => {
                  setSelectedVillage(null);
                  setVillageDetails(null);
                }}
              />
            )}
          </div>
        );

      default: // "projects" tab - YOUR ORIGINAL 667 LINES (100% PRESERVED)
        return (
          <>
            {/* 🔥 YOUR ORIGINAL TOP NAVIGATION (UNCHANGED) */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-black mb-2">My Project Requests</h1>
                <p className="text-gray-700">Total {requests.length} request{requests.length !== 1 ? "s" : ""}</p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition font-bold"
              >
                <Plus className="w-5 h-5" />
                New Request
              </button>
            </div>

            {/* 🔥 YOUR ORIGINAL CREATE FORM MODAL (UNCHANGED - 150+ LINES) */}
            {showCreateForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                  <div className="p-6 border-b border-gray-300 flex justify-between items-center sticky top-0 bg-white">
                    <h2 className="text-2xl font-bold text-black">Create Project Request</h2>
                    <button
                      onClick={() => setShowCreateForm(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-5">
                      {/* Village Selection */}
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">
                          Village *
                        </label>
                        <select
                          required
                          value={formData.villageId}
                          onChange={(e) => setFormData({ ...formData, villageId: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none text-black"
                        >
                          <option value="">Select Village</option>
                          {officerVillages.map(v => (
                            <option key={v._id} value={v._id}>
                              {v.name} {v.block ? `• ${v.block}` : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Project Category */}
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">
                          Project Category *
                        </label>
                        <select
                          required
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none text-black"
                        >
                          <option value="general">General Project</option>
                          <option value="health">Health/Hospital</option>
                          <option value="road">Road/Infrastructure</option>
                          <option value="water">Water Supply</option>
                          <option value="education">Education/School</option>
                          <option value="housing">Housing</option>
                          <option value="agriculture">Agriculture</option>
                        </select>
                      </div>

                      {/* Project Name, Budget, Description, File Upload - ALL UNCHANGED */}
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">Project Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.projectName}
                          onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none text-black"
                          placeholder="e.g., Village Hospital Construction"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-black mb-2">Budget (₹) *</label>
                        <input
                          type="number"
                          required
                          value={formData.budget}
                          onChange={(e) => setFormData({...formData, budget: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none text-black"
                          placeholder="5000000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-black mb-2">Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none text-black"
                          rows="3"
                          placeholder="Describe project details..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-black mb-2">Documents</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-500 transition">
                          <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          />
                          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                            <Upload className="w-12 h-12 text-gray-500 mb-3" />
                            <span className="text-sm font-bold text-gray-800">Click to upload documents</span>
                            <span className="text-xs text-gray-600 mt-1">or drag and drop files here</span>
                            <span className="text-xs text-gray-600 mt-1">PDF, DOC, JPG, PNG (Max 10MB each)</span>
                          </label>
                        </div>

                        {selectedFiles.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {selectedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-gray-600" />
                                  <span className="text-sm text-gray-800 truncate flex-1">{file.name}</span>
                                  <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
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

                    <div className="mt-8 flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        className="flex-1 px-6 py-3 border-2 border-gray-400 text-black rounded-xl hover:bg-gray-50 transition font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={formLoading}
                        className="flex-1 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {formLoading ? "Creating..." : "Create Request"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* 🔥 YOUR ORIGINAL SCHEME ASSIGNMENT MODAL (UNCHANGED - 200+ LINES) */}
            {showSchemeModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                  <div className="p-6 border-b border-gray-300 sticky top-0 bg-white z-10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-black">Assign Scheme</h2>
                        <p className="text-gray-700">
                          Project: <span className="font-semibold">{selectedRequest?.projectName}</span> | Budget: {formatBudget(selectedRequest?.budget)}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowSchemeModal(false)}
                        className="p-2 hover:bg-gray-100 rounded-xl transition"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">Category</label>
                        <select
                          value={schemeFilters.category}
                          onChange={(e) => {
                            setSchemeFilters({...schemeFilters, category: e.target.value});
                            fetchFilteredSchemes(e.target.value, schemeFilters.budget);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black text-black"
                        >
                          <option value="">All Categories</option>
                          {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      {/* <div>
                        <label className="block text-sm font-bold text-black mb-2">Budget Filter</label>
                        <input
                          type="number"
                          value={schemeFilters.budget}
                          onChange={(e) => {
                            setSchemeFilters({...schemeFilters, budget: e.target.value});
                            fetchFilteredSchemes(schemeFilters.category, e.target.value);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black text-black"
                          placeholder="5000000"
                        />
                      </div>
                       */}
                      <div className="flex items-end">
                        <button
                          onClick={() => fetchFilteredSchemes(schemeFilters.category, schemeFilters.budget)}
                          disabled={schemeLoading}
                          className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {schemeLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Filter className="w-4 h-4" />
                          )}
                          Filter
                        </button>
                      </div>
                    </div>

                    {/* Search */}
                    <div className="mb-6">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          value={schemeSearch}
                          onChange={(e) => setSchemeSearch(e.target.value)}
                          placeholder="Search schemes..."
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none text-black"
                        />
                      </div>
                    </div>

                    {/* Schemes Grid */}
                    {schemeLoading ? (
                      <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-700">Loading schemes...</p>
                      </div>
                    ) : schemes.filter(scheme =>
                      scheme.schemeName.toLowerCase().includes(schemeSearch.toLowerCase())
                    ).length === 0 ? (
                      <div className="text-center py-16 bg-gray-50 rounded-2xl">
                        <Award className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No schemes found</h3>
                        <p className="text-gray-600">Try adjusting your filters</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {schemes.filter(scheme =>
                          scheme.schemeName.toLowerCase().includes(schemeSearch.toLowerCase())
                        ).map((scheme) => (
                          <div
                            key={scheme._id}
                            className={`p-6 border-2 rounded-xl hover:shadow-xl transition-all cursor-pointer group ${
                              scheme.suitable 
                                ? "border-gray-200 hover:border-black bg-white" 
                                : "border-red-200 bg-red-50 opacity-75"
                            }`}
                            onClick={() => assignSchemeToRequest(scheme._id)}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-bold text-lg text-black group-hover:text-gray-900">
                                {scheme.schemeName}
                              </h4>
                              <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                                scheme.suitable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}>
                                {scheme.suitable ? "✅ Suitable" : "❌ Budget Low"}
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-700 mb-4 line-clamp-2">{scheme.description}</p>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                <span className="text-xs text-gray-500 font-semibold">Budget Limit</span>
                                <span className="text-lg font-bold text-black">₹{scheme.budgetLimit}</span>
                              </div>
                              <button className="w-full bg-black hover:bg-gray-900 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 group-hover:scale-105 transition-all">
                                Assign Scheme
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 🔥 YOUR ORIGINAL LOADING/EMPTY/REQUESTS SECTIONS (UNCHANGED) */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-700 font-semibold">Loading requests...</p>
              </div>
            ) : requests.length === 0 && !showCreateForm ? (
              <div className="text-center py-20 bg-gray-50 rounded-2xl p-12">
                <FolderOpen className="w-20 h-20 mx-auto text-gray-400 mb-6" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No requests found</h2>
                <p className="text-gray-600 mb-6">Create your first project request</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-900 transition"
                >
                  Create Request
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Approved Projects */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <CheckCircle className="w-7 h-7 text-green-600" />
                    <h2 className="text-2xl font-bold text-black">Approved Projects</h2>
                    <span className="px-4 py-2 bg-green-100 text-green-800 text-sm font-bold rounded-full">
                      {requests.filter(r => r.status === "approved").length}
                    </span>
                  </div>
                  {requests.filter(r => r.status === "approved").length === 0 ? (
                    <div className="p-12 bg-white border-2 border-dashed border-gray-300 rounded-2xl text-center">
                      <p className="text-gray-600 text-lg">No approved projects yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {requests.filter(r => r.status === "approved").map(request => (
                        <RequestCard key={request._id} request={request} />
                      ))}
                    </div>
                  )}
                </section>

                {/* Pending Requests */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <Clock className="w-7 h-7 text-gray-600" />
                    <h2 className="text-2xl font-bold text-black">Pending Approval</h2>
                    <span className="px-4 py-2 bg-gray-200 text-gray-900 text-sm font-bold rounded-full">
                      {requests.filter(r => r.status === "pending").length}
                    </span>
                  </div>
                  {requests.filter(r => r.status === "pending").length === 0 ? (
                    <div className="p-12 bg-white border-2 border-dashed border-gray-300 rounded-2xl text-center">
                      <p className="text-gray-600 text-lg">No pending requests</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {requests.filter(r => r.status === "pending").map(request => (
                        <RequestCard key={request._id} request={request} />
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}
          </>
        );
    }
  };

  // 🔥 ENHANCED TOP NAVIGATION WITH TABS (NEW)
  return (
    <div className="min-h-screen bg-white text-black">
      {/* 🔥 NEW TAB NAVIGATION + ORIGINAL NAVIGATION COMBINED */}
      <div className="flex items-center gap-1 mb-6 border-b border-gray-300 pb-4 bg-white shadow-sm max-w-7xl mx-auto px-8 rounded-t-lg">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`group relative px-6 py-3 font-semibold text-black hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 rounded-lg ${
            activeTab === "dashboard" ? "bg-black text-white shadow-lg" : ""
          }`}
        >
          <BarChart3 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Dashboard
        </button>

        <button
          onClick={() => setActiveTab("projects")}
          className={`group relative px-6 py-3 font-semibold text-black hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 rounded-lg ${
            activeTab === "projects" ? "bg-black text-white shadow-lg" : ""
          }`}
        >
          <FolderOpen className="w-5 h-5" />
          Projects
        </button>

        <button
          onClick={() => setActiveTab("heatmap")}
          className={`group relative px-6 py-3 font-semibold text-black hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 rounded-lg ${
            activeTab === "heatmap" ? "bg-black text-white shadow-lg" : ""
          }`}
        >
          <Map className="w-5 h-5" />
          Heatmap
        </button>
    <button
          onClick={() => navigate('/officer/village-selection')}
          className={`group relative px-6 py-3 font-semibold text-black hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 rounded-lg ${
            activeTab === "heatmap" ? "bg-black text-white shadow-lg" : ""
          }`}
        >
          <Map className="w-5 h-5" />
          select village
        </button>
        {/* 🔥 ORIGINAL NAVIGATION BUTTONS (PRESERVED) */}
     {/* <button 
    onClick={() => navigate('/officer/verification/map')}
    className="group relative px-6 py-3 font-semibold text-black hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 rounded-lg ml-auto"
  >
    <MapPin className="w-5 h-5" />
    District Map
  </button>
   */}
  
</div>
     {/* <><><>>>><>>>><><><><</></></> */}

     

      <div className="max-w-7xl mx-auto px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default OfficerDashboard;

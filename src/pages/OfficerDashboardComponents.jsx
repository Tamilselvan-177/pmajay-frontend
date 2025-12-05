// src/components/OfficerDashboardComponents.jsx - All Child Components
import React from "react";
import { 
  AlertTriangle, TrendingDown, MapPin, ChevronRight, FileText, 
  X, Upload, Plus, Filter, Search, Award 
} from "lucide-react";

// 🔥 UTILITY FUNCTIONS
export const formatBudget = (amount) => 
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatDate = (dateString) => 
  new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const getPriorityColor = (color) => {
  switch (color) {
    case "red": return "bg-red-500";
    case "yellow": return "bg-yellow-500";
    case "green": return "bg-green-500";
    case "gray": return "bg-gray-400";
    default: return "bg-gray-400";
  }
};

// 🔥 CATEGORIES ARRAY
export const categories = [
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

// 🔥 VILLAGE CARD COMPONENT
export const VillageCard = ({ village, onClick }) => (
  <div
    onClick={() => onClick(village)}
    className={`p-6 rounded-2xl border-2 cursor-pointer hover:shadow-2xl transition-all ${
      village.color === "red"
        ? "bg-red-50 border-red-300 hover:border-red-500"
        : village.color === "yellow"
        ? "bg-yellow-50 border-yellow-300 hover:border-yellow-500"
        : village.color === "green"
        ? "bg-green-50 border-green-300 hover:border-green-500"
        : "bg-gray-50 border-gray-300 hover:border-gray-400"
    }`}
  >
    <div className="flex items-start justify-between mb-3">
      <h3 className="font-bold text-lg text-black">{village.villageName}</h3>
      <div className={`w-4 h-4 rounded-full ${getPriorityColor(village.color)}`}></div>
    </div>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Readiness</span>
        <span className="font-bold text-black">{village.readiness}%</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">SC Population</span>
        <span className="font-bold text-black">{village.scPopulation}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Surveys</span>
        <span className="font-bold text-black">{village.surveys}</span>
      </div>
      <div className="pt-2 border-t border-gray-300">
        <span className={`text-xs font-bold uppercase ${
          village.color === "red" ? "text-red-700" :
          village.color === "yellow" ? "text-yellow-700" :
          village.color === "green" ? "text-green-700" :
          "text-gray-700"
        }`}>
          {village.priority}
        </span>
      </div>
    </div>
  </div>
);

// 🔥 PRIORITY PROJECT CARD
export const PriorityProjectCard = ({ project }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-300 rounded-2xl p-6 hover:shadow-xl transition-all">
    <div className="flex items-start justify-between mb-4">
      <h3 className="font-bold text-xl text-black">{project.villageName}</h3>
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
        project.urgency === "urgent" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
      }`}>
        {project.urgency.toUpperCase()}
      </span>
    </div>
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <TrendingDown className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-700">Readiness <span className="font-bold text-black">{project.readiness}%</span></span>
      </div>
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-700">Top Gap <span className="font-bold text-black">{project.topGap}</span></span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-700">Est. Cost <span className="font-bold text-black">{formatBudget(project.estimatedCost)}</span></span>
      </div>
    </div>
  </div>
);

// 🔥 VILLAGE DETAILS MODAL
export const VillageDetailsModal = ({ village, onClose, navigate }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
    <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
      <div className="sticky top-0 bg-white border-b border-gray-300 p-6 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              village.color === "red" ? "bg-red-100" :
              village.color === "yellow" ? "bg-yellow-100" :
              village.color === "green" ? "bg-green-100" :
              "bg-gray-100"
            }`}>
              {village.color === "red" ? <AlertTriangle className="w-6 h-6 text-red-600" /> :
               village.color === "yellow" ? <TrendingDown className="w-6 h-6 text-yellow-600" /> :
               village.color === "green" ? <MapPin className="w-6 h-6 text-green-600" /> : null}
            </div>
            <div>
              <h2 className="text-2xl font-black text-black">{village.village?.name}</h2>
              <p className="text-gray-600 font-semibold">
                {village.village?.scPopulation} SC Population • {village.totalHousesSurveyed} Houses Surveyed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Readiness Score */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-black">Overall Readiness</h3>
            <span className="text-4xl font-black text-blue-600">{village.readiness?.overallReadiness}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${
              village.readiness?.priority === "critical" ? "bg-red-100 text-red-800" :
              village.readiness?.priority === "high" ? "bg-yellow-100 text-yellow-800" :
              "bg-green-100 text-green-800"
            }`}>
              {village.readiness?.priority?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Domain Scores */}
        <div className="bg-white border-2 border-gray-300 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-black mb-4">Domain Readiness</h3>
          <div className="space-y-4">
            {Object.entries(village.readiness?.domainScores || {}).map(([domain, data]) => (
              <div key={domain}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-black capitalize">
                    {domain.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className={`font-bold ${
                    data.percentage >= 70 ? "text-green-600" :
                    data.percentage >= 50 ? "text-yellow-600" :
                    "text-red-600"
                  }`}>
                    {data.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      data.percentage >= 70 ? "bg-green-500" :
                      data.percentage >= 50 ? "bg-yellow-500" :
                      "bg-red-500"
                    }`}
                    style={{ width: `${data.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Projects */}
        <div className="bg-white border-2 border-gray-300 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-black mb-4">Priority Projects</h3>
          <div className="space-y-3">
            {village.projectPipeline?.map((project, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 border border-gray-300 rounded-xl hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-black">{project.gap}</h4>
                    <p className="text-sm text-gray-600">{project.domain}</p>
                  </div>
                  <span className="text-lg font-bold text-black">{formatBudget(project.estimatedCost)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/officer/project/new?priorityVillage=${village.village?._id}`)}
            className="flex-1 bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-900 transition flex items-center justify-center gap-3 text-lg"
          >
            <Plus className="w-6 h-6" />
            Create Priority Project
          </button>
          <button className="px-8 py-4 border-2 border-gray-300 text-black rounded-2xl font-bold hover:bg-gray-50 transition">
            Export Report
          </button>
        </div>
      </div>
    </div>
  </div>
);

// 🔥 REQUEST CARD COMPONENT
export const RequestCard = ({ request, navigate, openSchemeModal }) => (
  <div className="bg-white border-2 border-gray-300 rounded-2xl p-6 hover:shadow-2xl transition-all">
    <div className="flex items-start justify-between mb-4">
      <h3 className="font-bold text-xl text-black flex-1">{request.projectName}</h3>
      <span className={`px-3 py-1 rounded-full text-xs font-bold ml-2 ${
        request.status === "approved"
          ? "bg-green-100 text-green-800"
          : "bg-gray-200 text-gray-800"
      }`}>
        {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
      </span>
    </div>

    {/* Scheme Section */}
    <div className="mb-4">
      {request.assignedScheme ? (
        <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-blue-900">{request.assignedScheme.schemeName}</span>
          </div>
          <p className="text-sm text-blue-700">Budget Limit: ₹{request.assignedScheme.budgetLimit}</p>
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
      <div className="flex items-center gap-2 text-gray-700">
        <MapPin className="w-4 h-4" />
        <span className="text-sm">{request.village?.name || "Village removed"}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-700">
        <FileText className="w-4 h-4" />
        <span className="text-sm">
          {request.documents?.length || 0} Document{request.documents?.length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>

    <div className="flex items-center justify-between py-3 border-t border-gray-300 mb-4">
      <span className="text-sm text-gray-600">Budget</span>
      <span className="text-lg font-bold text-black">{formatBudget(request.budget)}</span>
    </div>

    <div className="text-xs text-gray-500 mb-4">
      Submitted {formatDate(request.createdAt)}
    </div>

    {request.description && (
      <div className="p-3 bg-gray-50 rounded-lg mb-4">
        <p className="text-sm text-gray-700 line-clamp-2">{request.description}</p>
      </div>
    )}

    <button
      onClick={() => navigate(`/officer/project/${request._id}/work-packages`)}
      className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
    >
      View Work Packages
      <ChevronRight className="w-5 h-5" />
    </button>
  </div>
);

// 🔥 CREATE PROJECT FORM COMPONENT
export const CreateProjectForm = ({
  formData,
  setFormData,
  selectedFiles,
  handleFileChange,
  removeFile,
  handleSubmit,
  formLoading,
  onClose
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
    <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
      <div className="sticky top-0 bg-white border-b border-gray-300 p-6 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-black">Create Project Request</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {/* Project Category */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">Project Category *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none text-black"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Project Name */}
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

          {/* Budget */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">Budget (₹) *</label>
            <input
              type="number"
              required
              min="0"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none text-black"
              placeholder="5000000"
            />
          </div>

          {/* Description */}
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

          {/* File Upload */}
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
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      <span className="text-sm text-gray-800 truncate">{file.name}</span>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-gray-200 rounded flex-shrink-0 ml-2"
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
            onClick={onClose}
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
);

// 🔥 SCHEME ASSIGNMENT MODAL COMPONENT
export const SchemeAssignmentModal = ({
  selectedRequest,
  schemes,
  schemeLoading,
  schemeFilters,
  setSchemeFilters,
  schemeSearch,
  setSchemeSearch,
  fetchFilteredSchemes,
  assignSchemeToRequest,
  onClose
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
      <div className="p-6 border-b border-gray-300 sticky top-0 bg-white z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black">Assign Scheme</h2>
            <p className="text-gray-700">
              Project: <span className="font-semibold">{selectedRequest?.projectName}</span> | 
              Budget: {formatBudget(selectedRequest?.budget)}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition">
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

          <div>
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
            {schemes
              .filter(scheme => scheme.schemeName.toLowerCase().includes(schemeSearch.toLowerCase()))
              .map((scheme) => (
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
);
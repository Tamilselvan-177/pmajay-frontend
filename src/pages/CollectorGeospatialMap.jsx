// FILE: src/pages/CollectorGeospatialMap.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  MapPin, Layers, RefreshCw, Filter, Eye, Camera,
  AlertTriangle, ArrowLeft, Building2, Search, Download
} from 'lucide-react';
import api from '../api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './GeospatialMap.css';
// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon creation function - themed version
const createCustomIcon = (color, icon, size = 36) => {
  return L.divIcon({
    html: `
      <div style="
        background: linear-gradient(135deg, ${color}, ${color}dd);
        width: ${size}px; 
        height: ${size}px; 
        border-radius: 50%; 
        display: flex; 
        align-items: center;
        justify-content: center;
        border: 3px solid white; 
        box-shadow: 0 6px 16px rgba(0,0,0,0.5);
        position: relative;
      ">
        <div style="color: white; font-size: ${size * 0.45}px; filter: brightness(1.3) contrast(1.2);">${icon}</div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -(size * 0.8)],
  });
};

const CollectorGeospatialMap = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mapType, setMapType] = useState('street');

  useEffect(() => {
    fetchMapData();
    fetchSchemes();
  }, []);

  // Debug: Log when projects change
  useEffect(() => {
    console.log(`🗺️ Projects state updated: ${projects.length} projects`);
    const withValidLocations = projects.filter(p => {
      const coords = p.location?.coordinates || [];
      return Array.isArray(coords) && coords.length === 2;
    });
    console.log(`✅ Projects with valid locations: ${withValidLocations.length}`);
  }, [projects]);

  const fetchMapData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/verifications/map');
      if (response.data.success) {
        console.log('📊 Map data received:', response.data.projects.length, 'projects');
        // Debug: log projects with locations
        response.data.projects.forEach(p => {
          if (p.location) {
            console.log(`📍 Project "${p.projectName}":`, {
              location: p.location,
              coordinates: p.location?.coordinates,
              hasValidCoords: p.location?.coordinates && Array.isArray(p.location.coordinates) && p.location.coordinates.length === 2
            });
          } else {
            console.log(`❌ Project "${p.projectName}": NO LOCATION`);
          }
        });
        
        const validProjects = response.data.projects.filter(p => {
          const coords = p.location?.coordinates || [];
          return Array.isArray(coords) && coords.length === 2 && 
                 typeof coords[0] === "number" && typeof coords[1] === "number";
        });
        
        console.log(`✅ Setting ${validProjects.length} projects with valid locations to state`);
        setProjects(validProjects);
        
        // Extract unique villages
        const uniqueVillages = [...new Map(
          response.data.projects.map(p => [p.village._id, p.village])
        ).values()];
        setVillages(uniqueVillages);
      }
    } catch (error) {
      console.error('Error fetching map data:', error);
      alert('Failed to load map data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchemes = async () => {
    try {
      const response = await api.get('/api/verifications/schemes');
      if (response.data.success) {
        setSchemes(response.data.schemes);
      }
    } catch (error) {
      console.error('Error fetching schemes:', error);
    }
  };

  const fetchProjectsByScheme = async (schemeId) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/verifications/scheme/${schemeId}`);
      if (response.data.success) {
        setProjects(response.data.projects);
        setSelectedScheme(schemeId);
        setSelectedVillage(null);
      }
    } catch (error) {
      console.error('Error fetching scheme projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectsByVillage = async (villageId) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/verifications/village/${villageId}`);
      if (response.data.success) {
        // Map the response to match our project structure
        const villageProjects = response.data.projects.map(p => ({
          ...p,
          // Prefer latest verification location, fall back to base project location
          location: p.verifications?.[0]?.location || p.location || null,
          latestVerification: p.verifications?.[0] || null
        })).filter(p => p.location);
        
        setProjects(villageProjects);
        setSelectedVillage(villageId);
        setSelectedScheme(null);
      }
    } catch (error) {
      console.error('Error fetching village projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSchemeColor = (schemeName) => {
    const colors = {
      'Drinking Water': '#3b82f6',
      'Healthcare': '#ef4444',
      'Education': '#10b981',
      'Roads': '#f59e0b',
      'Electricity': '#8b5cf6',
      'Internet': '#06b6d4',
      'Sanitation': '#ec4899'
    };
    return colors[schemeName] || '#6b7280';
  };

  const getSchemeIcon = (schemeName) => {
    const icons = {
      'Drinking Water': '💧',
      'Healthcare': '🏥',
      'Education': '🏫',
      'Roads': '🛣️',
      'Electricity': '⚡',
      'Internet': '📡',
      'Sanitation': '🚿'
    };
    return icons[schemeName] || '📍';
  };

  // Get custom icon based on project name keywords
  const getProjectIcon = (projectName, schemeName) => {
    if (!projectName) return getSchemeIcon(schemeName);
    
    const name = projectName.toLowerCase();
    
    // Education/College/School projects
    if (name.includes('college') || name.includes('university') || name.includes('institute')) {
      return '🏫';
    }
    if (name.includes('school') || name.includes('education')) {
      return '📚';
    }
    
    // Healthcare projects
    if (name.includes('hospital') || name.includes('clinic') || name.includes('health') || name.includes('medical')) {
      return '🏥';
    }
    
    // Water projects
    if (name.includes('water') || name.includes('drinking') || name.includes('well') || name.includes('borewell')) {
      return '💧';
    }
    
    // Road/Infrastructure projects
    if (name.includes('road') || name.includes('highway') || name.includes('bridge') || name.includes('street')) {
      return '🛣️';
    }
    
    // Electricity projects
    if (name.includes('electricity') || name.includes('power') || name.includes('solar') || name.includes('transformer')) {
      return '⚡';
    }
    
    // Internet/Connectivity projects
    if (name.includes('internet') || name.includes('wifi') || name.includes('fiber') || name.includes('connectivity')) {
      return '📡';
    }
    
    // Sanitation projects
    if (name.includes('toilet') || name.includes('sanitation') || name.includes('sewer') || name.includes('drainage')) {
      return '🚿';
    }
    
    // Building/Construction projects
    if (name.includes('building') || name.includes('construction') || name.includes('hall') || name.includes('center')) {
      return '🏗️';
    }
    
    // Default: use scheme icon if available, otherwise generic pin
    return getSchemeIcon(schemeName);
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-500',
      in_progress: 'bg-blue-500',
      delayed: 'bg-orange-500',
      not_started: 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getTileLayerUrl = () => {
    switch (mapType) {
      case 'satellite':
        return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      case 'terrain':
        return "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
      default:
        return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    }
  };

  const getBlockName = (project) => {
    return project.village?.block || 'Unknown Block';
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative bg-gray-50">
      {/* Header - Themed */}
      <div className="absolute top-0 left-0 right-0 bg-white shadow-lg z-[1001] p-4">
        <div className="flex items-center justify-between">
          {/* Title Section */}
          <div className="ml-[10px]">
            <h1 className="text-2xl font-bold text-gray-800">
              District Project Map
            </h1>
            <p className="text-sm text-gray-600 ml-[40px]">
              All District Projects - Geospatial View
            </p>
          </div>
          {/* Right Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/collector/verification')}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
              />
            </div>
            {/* Buttons */}
            <button 
              onClick={fetchMapData}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <select
              value={mapType}
              onChange={(e) => setMapType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
            >
              <option value="street">Street Map</option>
              <option value="satellite">Satellite</option>
              <option value="terrain">Terrain</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="w-full h-full pt-20">
        <MapContainer
          center={[13.0827, 80.2707]} // Chennai center (adjust based on your data)
          zoom={11}
          className="w-full h-full"
        >
          <TileLayer url={getTileLayerUrl()} />

          {/* Project Markers */}
          {projects.map(project => {
            const coords = project.location?.coordinates || [];
            const hasValidCoords =
              Array.isArray(coords) &&
              coords.length === 2 &&
              typeof coords[0] === "number" &&
              typeof coords[1] === "number" &&
              !Number.isNaN(coords[0]) &&
              !Number.isNaN(coords[1]);

            if (!hasValidCoords) {
              console.log(`⏭️ Skipping project "${project.projectName}" - invalid coordinates:`, coords);
              return null;
            }

            // GeoJSON format: [longitude, latitude] -> Leaflet needs [latitude, longitude]
            const [lng, lat] = coords;
            const leafletPosition = [lat, lng];
            
            console.log(`🗺️ Rendering marker for "${project.projectName}" at:`, {
              geoJSON: coords,
              leaflet: leafletPosition,
              projectId: project._id
            });

            return (
              <Marker
                key={project._id}
                position={leafletPosition}
                icon={createCustomIcon(
                  getSchemeColor(project.schemeName),
                  getProjectIcon(project.projectName, project.schemeName),
                  36
                )}
                zIndexOffset={1000}
              >
                <Popup className="custom-popup" maxWidth={400}>
                  <div className="p-4 min-w-[350px] bg-white" style={{ color: '#1f2937' }}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{project.projectName}</h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                        getStatusColor(project.currentStatus)
                      }`}>
                        {project.currentStatus?.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Scheme:</span>
                        <span className="text-sm font-semibold text-gray-800">
                          {project.schemeName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Village:</span>
                        <span className="text-sm font-semibold text-gray-800">
                          {project.village?.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Block:</span>
                        <span className="text-sm font-semibold text-gray-800">
                          {getBlockName(project)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Officer:</span>
                        <span className="text-sm font-semibold text-gray-800">
                          {project.officerInCharge?.fullName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Budget:</span>
                        <span className="text-sm font-semibold text-gray-800">
                          ₹{(project.budget/100000).toFixed(2)}L
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Verifications:</span>
                        <span className="text-sm font-semibold text-gray-800">
                          {project.verificationCount}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-semibold text-gray-800">
                          {project.currentProgress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${project.currentProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Latest Verification */}
                    {project.latestVerification && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs font-semibold text-gray-600 mb-2">
                          Latest Verification
                        </p>
                        <p className="text-sm text-gray-800 mb-2">
                          {project.latestVerification.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(project.lastVerifiedAt).toLocaleDateString()} - 
                          By {project.latestVerification.verifiedBy?.fullName}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {project.latestVerification && (
                      <button
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setSelectedImage(`http://localhost:5000${project.latestVerification.photo.fileUrl}`);
                          setShowImageModal(true);
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(`http://localhost:5000${project.latestVerification.photo.fileUrl}`);
                          setShowImageModal(true);
                        }}
                        className="w-full px-3 py-2 mb-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-sm flex items-center justify-center gap-2"
                      >
                        <Camera size={18} />
                        📷 View Latest Photo
                      </button>
                    )}

                    {project.needsVerification && (
                      <div className="mt-3 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded">
                        <AlertTriangle size={16} />
                        <span className="font-semibold">
                          Verification Overdue ({project.verificationOverdueDays} days)
                        </span>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Filter Panels */}
      <div className="absolute top-24 right-4 space-y-4 z-[1000] max-h-[70vh] overflow-auto">
        {/* Scheme Filter */}
        <div className="bg-white rounded-lg shadow-xl p-4 max-w-xs">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Layers size={20} />
            Filter by Scheme
          </h3>
          
          <button
            onClick={() => {
              setSelectedScheme(null);
              setSelectedVillage(null);
              fetchMapData();
            }}
            className={`w-full px-4 py-2 mb-2 rounded-lg font-semibold transition ${
              !selectedScheme && !selectedVillage
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🗺️ All Projects ({projects.length})
          </button>

          <div className="space-y-2">
            {schemes.map(scheme => (
              <button
                key={scheme._id}
                onClick={() => fetchProjectsByScheme(scheme._id)}
                className={`w-full px-4 py-2 rounded-lg font-semibold text-left transition ${
                  selectedScheme === scheme._id 
                    ? 'text-white shadow-lg' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
                style={{
                  backgroundColor: selectedScheme === scheme._id 
                    ? getSchemeColor(scheme.schemeName) 
                    : undefined
                }}
              >
                <div className="flex items-center justify-between">
                  <span>{scheme.schemeName}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedScheme === scheme._id 
                      ? 'bg-white/20' 
                      : 'bg-gray-200'
                  }`}>
                    {scheme.projectCount}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Village Filter */}
        <div className="bg-white rounded-lg shadow-xl p-4 max-w-xs">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Building2 size={20} />
            Filter by Village
          </h3>
          
          <div className="space-y-2 max-h-64 overflow-auto">
            {villages.map(village => (
              <button
                key={village._id}
                onClick={() => fetchProjectsByVillage(village._id)}
                className={`w-full px-4 py-2 rounded-lg font-semibold text-left transition ${
                  selectedVillage === village._id 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {village.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Panel */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-xl p-4 z-[1000]">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Filter size={18} />
          District Statistics
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{projects.length}</div>
            <div className="text-xs text-gray-600">Total Projects</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {projects.filter(p => p.currentStatus === 'completed').length}
            </div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {projects.filter(p => p.currentStatus === 'in_progress').length}
            </div>
            <div className="text-xs text-gray-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">
              {projects.filter(p => p.needsVerification).length}
            </div>
            <div className="text-xs text-gray-600">Need Verification</div>
          </div>
        </div>
      </div>

      {/* Image Modal - Themed */}
      {showImageModal && selectedImage && (
        <div 
          data-modal="image-modal"
          className="fixed inset-0 bg-black bg-opacity-75 z-[2000] flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Image */}
            <img 
              data-modal-img
              src={selectedImage} 
              alt="Project Verification"
              className="w-full h-auto max-h-[85vh] object-contain"
            />
            
            {/* Image Caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <p className="text-white text-lg font-semibold">
                Project Verification Photo
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectorGeospatialMap;
// OfficerGeospatialMap.jsx - COMPLETE WITH PRIORITY HEATMAP
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { 
  MapPin, Layers, RefreshCw, Filter, Eye, Camera, Download,
  CheckCircle, Clock, AlertTriangle, ArrowLeft, Search, TrendingDown,
  BarChart3, Award, Shield
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../api';
import './GeospatialMap.css';

// YOUR ORIGINAL LEAFLET FIX (UNCHANGED)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// YOUR ORIGINAL ICON FUNCTIONS (UNCHANGED)
const createCustomIcon = (color, icon, size = 36) => {
  return L.divIcon({
    html: `
      <div style="
        background: linear-gradient(135deg, ${color}, ${color}dd);
        width: ${size}px; height: ${size}px; 
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

const OfficerGeospatialMap = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mapType, setMapType] = useState('street');

  // 🔥 HEATMAP STATES (NEW)
  const [heatmapData, setHeatmapData] = useState([]);
  const [stats, setStats] = useState({});
  const [showPriorityLayer, setShowPriorityLayer] = useState(true);

  useEffect(() => {
    fetchMapData();
    fetchSchemes();
    fetchDashboardHeatmap();
  }, []);

  const fetchMapData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/verifications/map');
      if (response.data.success) {
        setProjects(response.data.projects);
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
      }
    } catch (error) {
      console.error('Error fetching scheme projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 HEATMAP DATA FETCH (NEW)
  const fetchDashboardHeatmap = async () => {
    try {
      const response = await api.get('/api/dashboard/heatmap');
      if (response.data.success) {
        setHeatmapData(response.data.heatmapData);
        setStats(response.data.stats);
        console.log('✅ Heatmap loaded:', response.data.heatmapData.length, 'villages');
      }
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
    }
  };

  // 🔥 HEATMAP COLOR HELPER (NEW)
  const getHeatmapColor = (color) => {
    return color === 'red' ? '#ef4444' : 
           color === 'yellow' ? '#f59e0b' : 
           color === 'green' ? '#10b981' : '#6b7280';
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

  const getProjectIcon = (projectName, schemeName) => {
    if (!projectName) return getSchemeIcon(schemeName);

    const name = projectName.toLowerCase();

    if (name.includes('college') || name.includes('university') || name.includes('institute')) {
      return '🏫';
    }
    if (name.includes('school') || name.includes('education')) {
      return '📚';
    }
    if (name.includes('hospital') || name.includes('clinic') || name.includes('health') || name.includes('medical')) {
      return '🏥';
    }
    if (name.includes('water') || name.includes('drinking') || name.includes('well') || name.includes('borewell')) {
      return '💧';
    }
    if (name.includes('road') || name.includes('highway') || name.includes('bridge') || name.includes('street')) {
      return '🛣️';
    }
    if (name.includes('electricity') || name.includes('power') || name.includes('solar') || name.includes('transformer')) {
      return '⚡';
    }
    if (name.includes('internet') || name.includes('wifi') || name.includes('fiber') || name.includes('connectivity')) {
      return '📡';
    }
    if (name.includes('toilet') || name.includes('sanitation') || name.includes('sewer') || name.includes('drainage')) {
      return '🚿';
    }
    if (name.includes('building') || name.includes('construction') || name.includes('hall') || name.includes('center')) {
      return '🏗️';
    }
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

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative bg-gray-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white shadow-lg z-[1001] p-4">
        <div className="flex items-center justify-between">
          {/* Title Section */}
          <div className="ml-[10px]">
            <h1 className="text-2xl font-bold text-gray-800">
              Project Verification Map
            </h1>
            <p className="text-sm text-gray-600 ml-[40px]">
              My Block Projects - Geospatial View
            </p>
          </div>
          {/* Right Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/officer/verification')}
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
                style={{color: '#1f2937', backgroundColor: '#ffffff'}}
              />
            </div>
            <button
              onClick={fetchMapData}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            
            {/* 🔥 PRIORITY LAYER TOGGLE (NEW) */}
            <button
              onClick={() => setShowPriorityLayer(!showPriorityLayer)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                showPriorityLayer 
                  ? 'bg-orange-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Toggle Village Priority Heatmap"
            >
              <BarChart3 size={18} />
              <span>{showPriorityLayer ? 'Hide' : 'Show'} Priority</span>
            </button>

            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <select
              value={mapType}
              onChange={(e) => setMapType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              style={{color: '#1f2937', backgroundColor: '#ffffff'}}
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
          center={[12.97, 79.39]} // Kanchipuram area
          zoom={11}
          className="w-full h-full"
        >
          <TileLayer url={getTileLayerUrl()} />

          {/* 🔥 PRIORITY HEATMAP LAYER (NEW) */}
          {showPriorityLayer && heatmapData.map((village, index) => {
            const { lat = 12.97, lng = 79.39 } = village.geoLocation || {};
            const hasValidCoords = lat && lng && !isNaN(lat) && !isNaN(lng);

            if (!hasValidCoords) return null;

            return (
              <CircleMarker
                key={`heatmap-${village.village || index}`}
                center={[lat, lng]}
                radius={Math.max(8, (village.surveys || 0) / 3)} // Size by survey count
                fillColor={getHeatmapColor(village.color)}
                color="#ffffff"
                weight={4}
                opacity={0.9}
                fillOpacity={0.7}
                zIndexOffset={500}
              >
                <Popup className="custom-popup" maxWidth={450}>
                  <div className="p-6 bg-white min-w-[380px]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-800">
                        🏘️ {village.villageName}
                      </h3>
                      <div className={`px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg ${
                        village.color === 'red' ? 'bg-red-500' :
                        village.color === 'yellow' ? 'bg-yellow-500 text-black' :
                        village.color === 'green' ? 'bg-green-500' : 'bg-gray-500'
                      }`}>
                        {village.color?.toUpperCase() || 'GRAY'}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <div className="text-3xl font-bold text-gray-800">
                          {village.readiness?.overallReadiness || 0}%
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Readiness Score</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-blue-600">
                          {village.surveys || 0}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Households Surveyed</div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-700">Priority Level</span>
                        <span className="text-sm font-bold capitalize text-gray-800">
                          {village.priority || 'unknown'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="h-4 rounded-full shadow-lg"
                          style={{ 
                            width: `${village.readiness?.overallReadiness || 0}%`,
                            backgroundColor: getHeatmapColor(village.color)
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">SC Population</div>
                        <div className="text-lg font-bold text-gray-800">
                          {village.scPopulation?.toLocaleString() || 0}
                        </div>
                      </div>
                      {village.topGaps?.[0] && (
                        <>
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Top Gap</div>
                            <div className="text-lg font-bold text-red-600">
                              {village.topGaps[0].domainName}
                            </div>
                            <div className="text-xs text-red-500">
                              Gap: {village.topGaps[0].gapPercentage?.toFixed(0)}%
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                      <button className="px-4 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md">
                        📋 Village Report
                      </button>
                      <button className="px-4 py-3 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-all shadow-md">
                        📊 Domain Analysis
                      </button>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

          {/* ORIGINAL PROJECT MARKERS (UNCHANGED) */}
          {projects.map(project => {
            const coords = project.location?.coordinates || [];
            const hasValidCoords =
              Array.isArray(coords) &&
              coords.length === 2 &&
              typeof coords[0] === "number" &&
              typeof coords[1] === "number" &&
              !Number.isNaN(coords[0]) &&
              !Number.isNaN(coords[1]);

            if (!hasValidCoords) return null;

            const [lng, lat] = coords;
            return (
              <Marker
                key={project._id}
                position={[lat, lng]}
                icon={createCustomIcon(
                  getSchemeColor(project.schemeName),
                  getProjectIcon(project.projectName, project.schemeName),
                  36
                )}
                zIndexOffset={1000}
              >
                <Popup className="custom-popup" maxWidth={400}>
                  <div className="p-4 min-w-[350px] bg-white" style={{color: '#1f2937'}}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-800">
                        {project.projectName}
                      </h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                        getStatusColor(project.currentStatus)
                      }`}>
                        {project.currentStatus.replace('_', ' ').toUpperCase()}
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
                          {project.village.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Budget:</span>
                        <span className="text-sm font-semibold text-gray-800">
                          ₹{(project.budget / 100000).toFixed(2)}L
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Verifications:</span>
                        <span className="text-sm font-semibold text-gray-800">
                          {project.verificationCount}
                        </span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-semibold text-gray-800">
                          {project.currentProgress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${project.currentProgress}%` }}
                        />
                      </div>
                    </div>
                    {project.latestVerification && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs font-semibold text-gray-600 mb-2">
                          Latest Verification
                        </p>
                        <p className="text-sm text-gray-800 mb-2">
                          {project.latestVerification.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(project.lastVerifiedAt).toLocaleDateString()} - By{' '}
                          {project.latestVerification.verifiedBy.fullName}
                        </p>
                      </div>
                    )}
                    {project.latestVerification && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(`http://localhost:5000${project.latestVerification.photo.fileUrl}`);
                          setShowImageModal(true);
                        }}
                        className="w-full px-3 py-2 mb-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                      >
                        <Camera size={18} />
                        View Latest Photo
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/officer/project/${project._id}/verification`);
                      }}
                      className="w-full px-3 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      <Eye size={18} />
                      View Full Details
                    </button>
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

      {/* Scheme Filter Panel (UNCHANGED) */}
      <div className="absolute top-24 right-4 bg-white rounded-lg shadow-xl p-4 z-[1000] max-w-xs max-h-[70vh] overflow-auto">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Layers size={20} />
          Filter by Scheme
        </h3>
        <button
          onClick={() => {
            setSelectedScheme(null);
            fetchMapData();
          }}
          className={`w-full px-4 py-2 mb-2 rounded-lg font-semibold transition ${
            !selectedScheme ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                backgroundColor:
                  selectedScheme === scheme._id ? getSchemeColor(scheme.schemeName) : undefined,
              }}
            >
              <div className="flex items-center justify-between">
                <span>{scheme.schemeName}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                    selectedScheme === scheme._id ? 'bg-white/20' : 'bg-gray-200'
                  }`}
                >
                  {scheme.projectCount}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 🔥 UPDATED STATISTICS PANEL - HEATMAP STATS */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-xl p-6 z-[1000] min-w-[280px]">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 size={20} />
          Village Readiness
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">{stats.yellow || 0}</div>
            <div className="text-xs text-gray-600 mt-1">🟡 Yellow</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500">{stats.red || 0}</div>
            <div className="text-xs text-gray-600 mt-1">🔴 Critical</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500">{stats.green || 0}</div>
            <div className="text-xs text-gray-600 mt-1">🟢 Ready</div>
          </div>
          <div className="text-center border-t pt-2">
            <div className="text-2xl font-bold text-gray-700">{stats.totalVillages || 0}</div>
            <div className="text-xs text-gray-600">Total Villages</div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t text-center">
          <div className="text-lg font-bold text-gray-800">{stats.avgReadiness || 0}%</div>
          <div className="text-xs text-gray-500">Avg Readiness</div>
        </div>
      </div>

      {/* 🔥 UPDATED LEGEND - HEATMAP + PROJECTS */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-xl p-4 z-[1000] max-w-xs">
        <h3 className="font-bold text-gray-800 mb-3 text-sm">Map Legend</h3>
        <div className="space-y-2 text-sm">
          {/* 🔥 HEATMAP LEGEND */}
          <div className="font-semibold text-xs text-gray-700 mb-2 border-b pb-2">Village Priority</div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>Critical (&lt;40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span>Moderate (40-69%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>Ready (70+%)</span>
          </div>
          <div className="font-semibold text-xs text-gray-700 mt-3 mb-1 border-t pt-2">Project Status</div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span>Delayed</span>
          </div>
        </div>
      </div>

      {/* Image Modal (UNCHANGED) */}
      {showImageModal && selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-[2000] flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img src={selectedImage} alt="Project Verification" className="w-full h-auto max-h-[85vh] object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerGeospatialMap;

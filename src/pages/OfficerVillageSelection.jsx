// src/pages/OfficerVillageSelection.jsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  ChevronLeft, CheckCircle, Download, Filter, Users, 
  TrendingUp, Award, Loader2 
} from 'lucide-react';

const KANCHIPURAM_BLOCK_ID = '6935648a2e92da37949f3fb2';

const OfficerVillageSelection = () => {
  const navigate = useNavigate();
  const [allVillages, setAllVillages] = useState([]);
  const [priorityVillages, setPriorityVillages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('all');
  const [stats, setStats] = useState(null);
  const [blockId] = useState(KANCHIPURAM_BLOCK_ID);

  useEffect(() => {
    loadAllVillages();
  }, []);

  const loadAllVillages = async () => {
    try {
      console.log(`📍 Loading villages for block: ${blockId}`);
      const res = await api.get(`/api/villages/block/${blockId}/all`);
      console.log('✅ API Response:', res.data);
      setAllVillages(res.data.villages || []);
      console.log(`✅ Loaded ${res.data.villages?.length || 0} villages`);
    } catch (err) {
      console.error('Error loading villages:', err);
    }
  };

  const selectPriorityVillages = async () => {
    setLoading(true);
    try {
      console.log(`🎯 Selecting priority villages for block: ${blockId}`);
      const res = await api.post(`/api/villages/block/${blockId}/select-for-survey`, {});
      console.log('✅ Priority API Response:', res.data);
      
      setPriorityVillages(res.data.selectedVillages || []);
      setStats(res.data.statistics);
      setViewMode('priority');
      console.log(`✅ Priority selection complete:`, res.data.statistics);
    } catch (err) {
      console.error('Error selecting priority villages:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const data = viewMode === 'priority' ? priorityVillages : allVillages.slice(0, 10);
    if (!data.length) return;

    const csv = [
      ['Village', 'SC Population', 'SC %', 'Houses'],
      ...(viewMode === 'priority' ? 
        data.map((v, i) => [`#${i+1}`, v.name, v.scPopulation, v.scPercentage, v.priorityScore, v.totalHouses]) :
        data.map(v => [v.name, v.scPopulation, v.scPercentage, v.totalHouses])
      )
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pmajay-villages-${viewMode === 'priority' ? 'priority' : 'all'}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // DEBUG: Log current state
  console.log('🔄 RENDER:', { viewMode, allVillages: allVillages.length, priorityVillages: priorityVillages.length, stats });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-700 hover:text-black font-medium transition-colors p-2 -m-2 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-teal-900 bg-clip-text text-transparent">
                Village Selection
              </h1>
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>

            <div className="flex items-center gap-3">
              {viewMode === 'priority' && priorityVillages.length > 0 && (
                <button
                  onClick={exportCSV}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Toggle Buttons */}
        <div className="flex items-center justify-center mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-1 shadow-xl border border-gray-200 flex">
            <button
              onClick={() => setViewMode('all')}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-md ${
                viewMode === 'all'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/25'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6" />
                All Villages ({allVillages.length})
              </div>
            </button>
            <button
              onClick={() => setViewMode('priority')}
              disabled={!priorityVillages.length || loading}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-md flex items-center gap-3 ${
                viewMode === 'priority' && priorityVillages.length
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/25'
                  : priorityVillages.length
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Award className="w-6 h-6" />
              Priority ({priorityVillages.length})
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {viewMode === 'all' && (
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <Filter className="w-7 h-7 text-gray-700" />
                  <h3 className="text-xl font-bold text-gray-900">Smart Selection</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="text-center">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      SC Population ≥ 40% + 500 members
                    </label>
                    <div className="flex items-center gap-4 justify-center">
                      <div className="flex flex-col items-center p-4 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl">
                        <div className="text-2xl font-bold text-emerald-800">40%</div>
                        <div className="text-xs text-emerald-700">SC Threshold</div>
                      </div>
                      <div className="w-12 h-px bg-gray-300"></div>
                      <div className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl">
                        <div className="text-2xl font-bold text-blue-800">500</div>
                        <div className="text-xs text-blue-700">Min Members</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={selectPriorityVillages}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-5 px-8 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-6 h-6" />
                        Find Priority Villages
                      </>
                    )}
                  </button>
                  
                  <div className="text-xs text-gray-500 text-center">
                    Backend auto-applies: 40% SC + 500 members minimum
                  </div>
                </div>
              </div>
            )}

            {stats && (
              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-3xl p-8 shadow-xl border border-emerald-200">
                <h4 className="text-lg font-bold text-emerald-900 mb-6 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  Selection Results
                </h4>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/50 rounded-2xl backdrop-blur-sm">
                    <span className="text-sm font-semibold text-gray-700">Total Villages</span>
                    <span className="text-2xl font-bold text-gray-900">{stats.totalVillagesInBlock}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/50 rounded-2xl backdrop-blur-sm">
                    <span className="text-sm font-semibold text-gray-700">Passed Filter</span>
                    <span className="text-2xl font-bold text-yellow-600">{stats.afterScFiltering}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/50 rounded-2xl backdrop-blur-sm border-t border-emerald-200 pt-6">
                    <span className="text-sm font-semibold text-gray-700">Priority Selected</span>
                    <span className="text-2xl font-bold text-emerald-600">{stats.finalSelected}</span>
                  </div>
                  
                  <div className="p-4 bg-white rounded-2xl text-center font-bold text-lg text-emerald-800 bg-gradient-to-r from-emerald-100/50">
                    {Math.round((1 - stats.finalSelected / stats.totalVillagesInBlock) * 100)}% 
                    <span className="text-sm block">Workload Reduction</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Table */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
              <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-slate-800 bg-clip-text text-transparent">
                    {viewMode === 'all' ? '📍 All Villages' : '🏆 Priority Villages'}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {viewMode === 'all' ? allVillages.length : priorityVillages.length} villages
                  </div>
                </div>
              </div>

              {loading && (
                <div className="p-20 text-center">
                  <Loader2 className="w-12 h-12 text-emerald-500 mx-auto mb-6 animate-spin" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Villages</h3>
                  <p className="text-gray-600">Applying SC Population filters (40% + 500 members)</p>
                </div>
              )}

              {!loading && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-8 py-5 text-left text-sm font-bold text-gray-800 border-b border-gray-200">
                          Village Name
                        </th>
                        <th className="px-8 py-5 text-right text-sm font-bold text-gray-800 border-b border-gray-200">
                          SC Population
                        </th>
                        <th className="px-8 py-5 text-right text-sm font-bold text-gray-800 border-b border-gray-200">
                          SC %
                        </th>
                        {viewMode === 'priority' && (
                          <th className="px-8 py-5 text-right text-sm font-bold text-gray-800 border-b border-gray-200">
                            Priority Score
                          </th>
                        )}
                        <th className="px-8 py-5 text-right text-sm font-bold text-gray-800 border-b border-gray-200">
                          Total Houses
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(viewMode === 'all' ? allVillages : priorityVillages).map((village, idx) => (
                        <tr 
                          key={village._id} 
                          className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 transition-all duration-200"
                        >
                          <td className="px-8 py-6">
                            {viewMode === 'priority' && (
                              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 px-4 py-2 rounded-full text-sm font-bold shadow-md">
                                #{idx + 1}
                              </span>
                            )}
                            <span className="ml-4 font-bold text-gray-900 text-lg ml-0 md:ml-4">
                              {village.name}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <span className="text-2xl font-mono font-bold text-gray-900">
                              {village.scPopulation?.toLocaleString() || 0}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <span className={`px-6 py-3 rounded-2xl text-lg font-bold shadow-md ${
                              Number(village.scPercentage || 0) >= 40
                                ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800'
                                : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600'
                            }`}>
                              {Number(village.scPercentage || 0).toFixed(1)}%
                            </span>
                          </td>
                          {viewMode === 'priority' && (
                            <td className="px-8 py-6 text-right">
                              <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-6 py-3 rounded-2xl font-bold text-lg shadow-md">
                                {Number(village.priorityScore || 0).toFixed(1)}
                              </span>
                            </td>
                          )}
                          <td className="px-8 py-6 text-right">
                            <span className="text-xl font-mono text-gray-700">
                              {village.totalHouses || 0}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OfficerVillageSelection;

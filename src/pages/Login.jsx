import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [collectors, setCollectors] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [villages, setVillages] = useState([]);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'officer',
    fullName: '',
    email: '',
    phone: '',
    state: '',
    district: '',
    block: '',
    villageId: '',
    assignedCollector: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const API_BASE = 'http://127.0.0.1:5000/api';

  useEffect(() => {
    if (!isLogin) {
      fetchStates();
      if (formData.role === 'officer') {
        fetchCollectors();
      }
    }
  }, [isLogin, formData.role]);

  const fetchStates = async () => {
    try {
      const res = await axios.get(`${API_BASE}/location/states`);
      setStates(res.data.states || []);
    } catch (err) {
      console.error('Error fetching states', err);
    }
  };

  useEffect(() => {
    if (formData.state && !isLogin) {
      fetchDistricts(formData.state);
      setFormData(prev => ({ ...prev, district: '', block: '', villageId: '' }));
      setDistricts([]);
      setBlocks([]);
      setVillages([]);
    }
  }, [formData.state]);

  const fetchDistricts = async (stateId) => {
    try {
      const res = await axios.get(`${API_BASE}/location/districts/${stateId}`);
      setDistricts(res.data.districts || []);
    } catch (err) {
      console.error('Error fetching districts', err);
    }
  };

  useEffect(() => {
    if (formData.district && !isLogin && formData.role === 'officer') {
      fetchBlocks(formData.district);
      setFormData(prev => ({ ...prev, block: '', villageId: '' }));
      setBlocks([]);
      setVillages([]);
    }
  }, [formData.district]);

  const fetchBlocks = async (districtId) => {
    try {
      const res = await axios.get(`${API_BASE}/location/blocks/${districtId}`);
      setBlocks(res.data.blocks || []);
    } catch (err) {
      console.error('Error fetching blocks', err);
    }
  };

  useEffect(() => {
    if (formData.block && !isLogin && formData.role === 'officer') {
      fetchVillages(formData.block);
      setFormData(prev => ({ ...prev, villageId: '' }));
      setVillages([]);
    }
  }, [formData.block]);

  const fetchVillages = async (blockId) => {
    try {
      const res = await axios.get(`${API_BASE}/location/villages/${blockId}`);
      setVillages(res.data.villages || []);
    } catch (err) {
      console.error('Error fetching villages', err);
    }
  };

  const fetchCollectors = async () => {
    try {
      const res = await axios.get(`${API_BASE}/auth/collectors`);
      setCollectors(res.data.collectors || []);
    } catch (err) {
      console.error('Error fetching collectors', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? `${API_BASE}/auth/login` : `${API_BASE}/auth/register`;
      
      const payload = isLogin 
        ? { 
            username: formData.username, 
            password: formData.password 
          }
        : {
            username: formData.username,
            password: formData.password,
            role: formData.role,
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            ...(formData.role !== 'primeminister' && {
              state: formData.state,
              district: formData.district,
            }),
            ...(formData.role === 'officer' && {
              block: formData.block,
              villageId: formData.villageId,
              assignedCollector: formData.assignedCollector,
            }),
          };

      const { data } = await axios.post(endpoint, payload);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);

      if (data.role === 'primeminister') {
        navigate('/primeminister');
      } else if (data.role === 'collector') {
        navigate('/collector');
      } else {
        navigate('/officer');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      username: '', password: '', role: 'officer', fullName: '',
      email: '', phone: '', state: '', district: '', block: '',
      villageId: '', assignedCollector: '',
    });
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)',
        backgroundSize: '100px 100px'
      }}></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl flex items-center justify-between gap-12">
          
          {/* Left Side - Branding */}
          <div className="hidden lg:flex flex-col flex-1 space-y-8">
            <div className="space-y-4">
              <div className="inline-block">
                <h1 className="text-7xl font-black text-white tracking-tight mb-2">
                  PM-AJAY
                </h1>
                <div className="h-2 w-32 bg-gradient-to-r from-white to-gray-400 rounded-full"></div>
              </div>
              <p className="text-2xl text-gray-400 font-light">
                Infrastructure Governance Portal
              </p>
              <p className="text-gray-500 text-lg leading-relaxed max-w-md">
                Empowering governance through digital transformation. 
                Monitor, manage, and optimize infrastructure projects across the nation.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Real-time Monitoring</h3>
                  <p className="text-gray-400 text-sm">Track projects in real-time</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Secure Access</h3>
                  <p className="text-gray-400 text-sm">Enterprise-grade security</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Analytics Dashboard</h3>
                  <p className="text-gray-400 text-sm">Data-driven insights</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full lg:w-[480px]">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 lg:p-10">
              
              {/* Mobile Logo */}
              <div className="lg:hidden mb-6">
                <h1 className="text-4xl font-black text-white">PM-AJAY</h1>
                <p className="text-gray-400 text-sm">Infrastructure Governance Portal</p>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-gray-400">
                  {isLogin ? 'Enter your credentials to continue' : 'Fill in your details to get started'}
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {/* Role Selection - First in signup */}
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="block text-gray-300 text-sm font-medium">
                      Select Role
                    </label>
                    <div className="relative">
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition appearance-none cursor-pointer"
                        required
                      >
                        <option value="officer" className="bg-black">Block/District Officer</option>
                        <option value="collector" className="bg-black">Collector</option>
                        <option value="primeminister" className="bg-black">Prime Minister</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* Username */}
                <div className="space-y-2">
                  <label className="block text-gray-300 text-sm font-medium">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition"
                      placeholder="Enter your username"
                      required
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-gray-300 text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-11 pr-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition"
                      placeholder="Enter your password"
                      required
                      minLength={6}
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Signup Fields */}
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-gray-300 text-sm font-medium">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition"
                        placeholder="Enter full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-300 text-sm font-medium">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition"
                        placeholder="Enter email address"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-300 text-sm font-medium">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition"
                        placeholder="Enter phone number"
                      />
                    </div>

                    {formData.role !== 'primeminister' && (
                      <>
                        <div className="space-y-2">
                          <label className="block text-gray-300 text-sm font-medium">State</label>
                          <select
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition appearance-none cursor-pointer"
                            required
                          >
                            <option value="" className="bg-black">Select State</option>
                            {states.map((state) => (
                              <option key={state._id} value={state._id} className="bg-black">{state.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-gray-300 text-sm font-medium">District</label>
                          <select
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            required
                            disabled={!formData.state}
                          >
                            <option value="" className="bg-black">Select District</option>
                            {districts.map((district) => (
                              <option key={district._id} value={district._id} className="bg-black">{district.name}</option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}

                    {formData.role === 'officer' && (
                      <>
                        <div className="space-y-2">
                          <label className="block text-gray-300 text-sm font-medium">Block</label>
                          <select
                            name="block"
                            value={formData.block}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            required
                            disabled={!formData.district}
                          >
                            <option value="" className="bg-black">Select Block</option>
                            {blocks.map((block) => (
                              <option key={block._id} value={block._id} className="bg-black">{block.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-gray-300 text-sm font-medium">Village</label>
                          <select
                            name="villageId"
                            value={formData.villageId}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            required
                            disabled={!formData.block}
                          >
                            <option value="" className="bg-black">Select Village</option>
                            {villages.map((village) => (
                              <option key={village._id} value={village._id} className="bg-black">{village.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-gray-300 text-sm font-medium">Assigned Collector</label>
                          <select
                            name="assignedCollector"
                            value={formData.assignedCollector}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition appearance-none cursor-pointer"
                            required
                          >
                            <option value="" className="bg-black">Select Collector</option>
                            {collectors.map((collector) => (
                              <option key={collector._id} value={collector._id} className="bg-black">{collector.fullName}</option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-white hover:bg-gray-100 text-black font-semibold py-3.5 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={toggleMode}
                  className="text-gray-400 hover:text-white transition text-sm"
                >
                  {isLogin ? (
                    <>Don't have an account? <span className="font-semibold text-white">Create one</span></>
                  ) : (
                    <>Already have an account? <span className="font-semibold text-white">Sign in</span></>
                  )}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-gray-500 text-sm">
              <p>© 2025 PM-AJAY. All rights reserved.</p>
              <p className="mt-1">Secured by Government of India</p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
<style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Login;
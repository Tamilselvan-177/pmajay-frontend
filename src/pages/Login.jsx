import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, User as UserIcon, Lock, RefreshCw } from 'lucide-react';
import CoatOfArms from '../../assests/pngimg.com - coat_arms_india_PNG11.png';

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
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const navigate = useNavigate();

  // Generate captcha
  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const API_BASE = "https://backendpmajay.onrender.com/api";
  // const API_BASE = "http://localhost:5000/api";

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

  const handleRefreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate captcha for login
    if (isLogin && captchaInput.toLowerCase() !== captcha.toLowerCase()) {
      setError('Invalid captcha. Please try again.');
      handleRefreshCaptcha();
      return;
    }

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
      if (isLogin) {
        handleRefreshCaptcha();
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setCaptchaInput('');
    if (!isLogin) {
      setCaptcha(generateCaptcha());
    }
    setFormData({
      username: '', password: '', role: 'officer', fullName: '',
      email: '', phone: '', state: '', district: '', block: '',
      villageId: '', assignedCollector: '',
    });
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(180deg, #1a3a5f 0%, #2d5a87 50%, #3d6a97 100%)",
      }}
    >
      {/* Login Card */}
      <div className="w-full max-w-md relative bg-white shadow-2xl rounded-lg">
        <div className="p-6">
          <div className="text-center pb-4">
            {/* Emblem */}
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-[#90EE90] flex items-center justify-center shadow-md">
                <img 
                  src={CoatOfArms} 
                  alt="Government of India" 
                  className="h-10 w-10 object-contain"
                />
              </div>
            </div>
            <p className="text-sm text-gray-700 font-medium">
              For Authorized Users Of Village, District,<br />
              State & Ministry only
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection - Only for signup */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Select Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none cursor-pointer"
                  required
                >
                  <option value="officer">Block/District Officer</option>
                  <option value="collector">Collector</option>
                  <option value="primeminister">Prime Minister</option>
                </select>
              </div>
            )}

            {/* Login ID / Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                Login Id
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Login Id"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f2a] focus:border-[#1a5f2a] text-gray-900 bg-white"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                {isLogin && (
                  <a href="#" className="text-xs text-[#1a5f2a] hover:underline font-medium">
                    Forgot password ?
                  </a>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••••"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f2a] focus:border-[#1a5f2a] text-gray-900 bg-white"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 flex items-center justify-center hover:bg-gray-100 rounded"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                </button>
              </div>
            </div>

            {/* Captcha - Only for login */}
            {isLogin && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Captcha
                  </label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="flex-1 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-mono text-lg tracking-widest select-none border border-gray-300"
                      style={{ 
                        background: "linear-gradient(45deg, #f3f4f6, #e5e7eb)",
                        textDecoration: "line-through",
                        fontStyle: "italic",
                        color: "#374151",
                        fontWeight: "bold"
                      }}
                    >
                      {captcha}
                    </div>
                    <button
                      type="button"
                      onClick={handleRefreshCaptcha}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1 text-sm font-medium text-gray-700"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Refresh
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Captcha"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f2a] focus:border-[#1a5f2a] text-gray-900 bg-white"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-600">
                    For captcha error message, please press<br />
                    Ctrl with F5 to clear browser cookies.
                  </p>
                </div>
              </>
            )}

            {/* Signup Fields */}
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Enter phone number"
                  />
                </div>

                {formData.role !== 'primeminister' && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">State</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none cursor-pointer"
                        required
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state._id} value={state._id}>{state.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">District</label>
                      <select
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                        disabled={!formData.state}
                      >
                        <option value="">Select District</option>
                        {districts.map((district) => (
                          <option key={district._id} value={district._id}>{district.name}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {formData.role === 'officer' && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Block</label>
                      <select
                        name="block"
                        value={formData.block}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                        disabled={!formData.district}
                      >
                        <option value="">Select Block</option>
                        {blocks.map((block) => (
                          <option key={block._id} value={block._id}>{block.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Village</label>
                      <select
                        name="villageId"
                        value={formData.villageId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                        disabled={!formData.block}
                      >
                        <option value="">Select Village</option>
                        {villages.map((village) => (
                          <option key={village._id} value={village._id}>{village.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Assigned Collector</label>
                      <select
                        name="assignedCollector"
                        value={formData.assignedCollector}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none cursor-pointer"
                        required
                      >
                        <option value="">Select Collector</option>
                        {collectors.map((collector) => (
                          <option key={collector._id} value={collector._id}>{collector.fullName}</option>
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
              className="w-full mt-6 bg-[#1a5f2a] hover:bg-[#155a25] text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {isLogin && (
            <div className="mt-6 text-center">
              <button
                onClick={toggleMode}
                className="text-gray-600 hover:text-[#1a5f2a] transition text-sm"
              >
                Don't have an account? <span className="font-semibold text-[#1a5f2a]">Create one</span>
              </button>
            </div>
          )}
          {!isLogin && (
            <div className="mt-6 text-center">
              <button
                onClick={toggleMode}
                className="text-gray-600 hover:text-[#1a5f2a] transition text-sm"
              >
                Already have an account? <span className="font-semibold text-[#1a5f2a]">Sign in</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

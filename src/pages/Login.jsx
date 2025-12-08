import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AmritLogo from '../../assests/logo-amrit.jpg';
import PmagyLogo from '../../assests/pmagy_logo.jpg';

const featureHighlights = [
  { title: 'Secure Role-based Access', desc: 'Officers, Collectors & PMO workflows' },
  { title: 'Live Mission Dashboard', desc: 'Development and financial KPIs' },
  { title: 'Geospatial Oversight', desc: 'Village assets & map integrations' },
];

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

  const API_BASE  = "https://backendpmajay.onrender.com/api";

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

  const inputClasses = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gov-green-500 focus:border-transparent transition text-gray-900";
  const labelClasses = "block text-gray-700 text-sm font-semibold mb-2";
  const selectClasses = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gov-green-500 focus:border-transparent transition appearance-none cursor-pointer text-gray-900";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gov-green-900 via-gov-green-800 to-gov-green-700 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <img src={PmagyLogo} alt="PMAGY" className="w-20 h-20 object-contain" />
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gov-green-600">प्रधानमंत्री आदर्श ग्राम योजना</p>
                <p className="text-lg font-semibold text-gov-green-800">Pradhan Mantri Adarsh Gram Yojana</p>
                <p className="text-xs text-gray-500">Ministry of Social Justice & Empowerment, Government of India</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <img src={AmritLogo} alt="Amrit Mahotsav" className="h-14 object-contain" />
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-8 py-10">
          <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-[1.2fr,1fr] min-h-[560px]">
              <section className="bg-gradient-to-br from-gov-green-800 via-gov-green-700 to-gov-green-800 p-8 sm:p-10 text-white">
                <p className="text-sm uppercase tracking-[0.4em] text-gov-saffron">PM-AJAY Mission Suite</p>
                <h2 className="text-4xl sm:text-5xl font-semibold mt-4 leading-tight">Unified Governance & Monitoring Portal</h2>
                <p className="mt-5 text-green-100 leading-relaxed">
                  Centralized orchestration for Village Development Plans, fund releases, and outcome monitoring under the Pradhan Mantri Adarsh Gram Yojana.
                </p>
                <div className="mt-10 grid gap-4">
                  {featureHighlights.map((feature) => (
                    <div key={feature.title} className="bg-white/10 border border-white/10 rounded-2xl p-4 flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gov-green-500 flex items-center justify-center">
                        <span className="text-xl text-white">✓</span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">{feature.title}</p>
                        <p className="text-sm text-green-200">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white text-gray-900 p-6 sm:p-10 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gov-green-600">Secure Gateway</p>
                    <h3 className="text-2xl font-semibold text-gov-green-800 mt-2">{isLogin ? 'Log in to PM-AJAY' : 'Create Mission Account'}</h3>
                    <p className="text-sm text-gray-500">Authorized government personnel only.</p>
                  </div>
                  <Link to="/" className="text-xs font-semibold text-gov-green-600 hover:text-gov-saffron transition">
                    ← Back to portal
                  </Link>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 flex-1 overflow-y-auto pr-2">
                  {!isLogin && (
                    <div>
                      <label className={labelClasses}>Select Role</label>
                      <div className="relative">
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className={selectClasses}
                          required
                        >
                          <option value="officer">Block/District Officer</option>
                          <option value="collector">Collector</option>
                          <option value="primeminister">Prime Minister</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className={labelClasses}>Username</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`${inputClasses} pl-11`}
                        placeholder="Enter your username"
                        required
                      />
                      <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <label className={labelClasses}>Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`${inputClasses} pl-11 pr-11`}
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
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gov-green-600 transition"
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

                  {!isLogin && (
                    <>
                      <div>
                        <label className={labelClasses}>Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className={inputClasses}
                          placeholder="Enter full name"
                          required
                        />
                      </div>

                      <div>
                        <label className={labelClasses}>Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={inputClasses}
                          placeholder="Enter email address"
                          required
                        />
                      </div>

                      <div>
                        <label className={labelClasses}>Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={inputClasses}
                          placeholder="Enter phone number"
                        />
                      </div>

                      {formData.role !== 'primeminister' && (
                        <>
                          <div>
                            <label className={labelClasses}>State</label>
                            <select
                              name="state"
                              value={formData.state}
                              onChange={handleChange}
                              className={selectClasses}
                              required
                            >
                              <option value="">Select State</option>
                              {states.map((state) => (
                                <option key={state._id} value={state._id}>{state.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className={labelClasses}>District</label>
                            <select
                              name="district"
                              value={formData.district}
                              onChange={handleChange}
                              className={`${selectClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
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
                          <div>
                            <label className={labelClasses}>Block</label>
                            <select
                              name="block"
                              value={formData.block}
                              onChange={handleChange}
                              className={`${selectClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
                              required
                              disabled={!formData.district}
                            >
                              <option value="">Select Block</option>
                              {blocks.map((block) => (
                                <option key={block._id} value={block._id}>{block.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className={labelClasses}>Village</label>
                            <select
                              name="villageId"
                              value={formData.villageId}
                              onChange={handleChange}
                              className={`${selectClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
                              required
                              disabled={!formData.block}
                            >
                              <option value="">Select Village</option>
                              {villages.map((village) => (
                                <option key={village._id} value={village._id}>{village.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className={labelClasses}>Assigned Collector</label>
                            <select
                              name="assignedCollector"
                              value={formData.assignedCollector}
                              onChange={handleChange}
                              className={selectClasses}
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
                    className="w-full mt-6 bg-gov-green-700 hover:bg-gov-green-600 text-white font-semibold py-3.5 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </span>
                    ) : isLogin ? 'Log In' : 'Create Account'}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                      onClick={toggleMode}
                      className="ml-2 text-gov-green-600 font-semibold hover:text-gov-saffron transition"
                    >
                      {isLogin ? 'Register here' : 'Log in here'}
                    </button>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </main>

        <footer className="bg-gov-green-900/50 backdrop-blur text-center text-xs text-green-200 py-4">
          © {new Date().getFullYear()} Pradhan Mantri Adarsh Gram Yojana | Ministry of Social Justice & Empowerment
        </footer>
      </div>
    </div>
  );
};

export default Login;

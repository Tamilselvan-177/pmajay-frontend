import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  X,
  ArrowUpRight,
  MapPin,
  ClipboardList,
  CheckCircle2,
  IndianRupee,
  Landmark,
  Volume2,
  Languages,
  Accessibility,
  Facebook,
  Twitter,
  Youtube,
} from 'lucide-react';
import AshokaEmblem from '../../assests/coat_arms_india.png';
import AmritLogo from '../../assests/logo-amrit.jpg';
import PmagyLogo from '../../assests/pmagy_logo.jpg';

const mockData = {
  stats: [
    {
      title: 'Total Villages',
      count: '5,321',
      change: '+120 villages onboarded this quarter',
      icon: MapPin,
      accentClass: 'bg-blue-900',
    },
    {
      title: 'VDP Planned',
      count: '4,876',
      change: '94% of targeted habitations',
      icon: ClipboardList,
      accentClass: 'bg-orange-500',
    },
    {
      title: 'Works Completed',
      count: '27,540',
      change: '71 flagship interventions delivered',
      icon: CheckCircle2,
      accentClass: 'bg-green-600',
    },
    {
      title: 'Funds Released',
      count: '₹ 1,542 Cr',
      change: 'Updated on 27 Nov 2025',
      icon: IndianRupee,
      accentClass: 'bg-blue-700',
    },
    {
      title: 'Mission Assets',
      count: '12,418',
      change: 'Across 36 States & UTs',
      icon: Landmark,
      accentClass: 'bg-indigo-600',
    },
  ],
  heroImages: [
    {
      url: 'https://images.unsplash.com/photo-1516905041604-7935af78f572?auto=format&fit=crop&w=1400&q=80',
      caption: 'Inclusive Development for Model Villages',
    },
    {
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80',
      caption: 'Sustainable Infrastructure for Rural India',
    },
    {
      url: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1400&q=80',
      caption: 'Empowering Communities with Digital Tools',
    },
  ],
  updates: [
    {
      title: 'VDP Planning Cycle 2025-26 launched across 500 aspirational villages.',
      date: '28 Nov 2025',
    },
    {
      title: 'PM-AJAY Monitoring Dashboard 2.0 released for nodal officers.',
      date: '26 Nov 2025',
    },
    {
      title: 'National Conclave on Social Justice & Empowerment hosted in New Delhi.',
      date: '21 Nov 2025',
    },
    {
      title: 'Digital training for block coordinators completed in 14 states.',
      date: '19 Nov 2025',
    },
  ],
  footerLinks: {
    related: ['Ministry of Social Justice & Empowerment', 'Department of Social Welfare', 'NIC Service Portal', 'MyGov', 'Digital India'],
    contact: ['PM-AJAY Programme Division', 'Department of Social Justice & Empowerment', 'Room No. 604, Shastri Bhawan, New Delhi - 110001', 'Email: pmagy-support@gov.in', 'Helpline: 1800-120-3456'],
    officer: ['Nodal Officer: Shri Rajeev Sharma', 'Designation: Joint Secretary (PM-AJAY)', 'Email: rajeev.sharma@gov.in', 'Phone: 011-23012345'],
  },
};

const StatCard = ({ title, count, change, icon: Icon, accentClass }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-3">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${accentClass}`}>
      <Icon className="text-white" size={24} />
    </div>
    <div>
      <p className="text-sm uppercase tracking-wide text-gray-500">{title}</p>
      <p className="text-3xl font-semibold text-gray-900 mt-1">{count}</p>
    </div>
    <p className="text-sm text-gray-500">{change}</p>
  </div>
);

const Home = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const tickerItems = useMemo(() => [...mockData.updates, ...mockData.updates], []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <style>{`
        @keyframes ticker {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes heroSlide {
          0% { transform: translateX(0); }
          33% { transform: translateX(0); }
          40% { transform: translateX(-100%); }
          73% { transform: translateX(-100%); }
          80% { transform: translateX(-200%); }
          100% { transform: translateX(-200%); }
        }
      `}</style>

      {/* Utility Bar */}
      <div className="bg-blue-950 text-white text-xs">
        <div className="w-full px-4 sm:px-8 lg:px-16 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm leading-snug flex items-center gap-3">
            <img src={AshokaEmblem} alt="State Emblem" className="w-10 h-10 object-contain" />
            <div className="space-y-0.5">
              <p className="text-base">भारत सरकार | सामाजिक न्याय और अधिकारिता मंत्रालय</p>
              <p className="text-sm">Ministry of Social Justice and Empowerment, Govt. of India</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1">
              <Accessibility size={14} />
              <span>A+</span>
            </div>
            <div className="flex items-center gap-1">
              <Accessibility size={14} />
              <span>A-</span>
            </div>
            <div className="flex items-center gap-1">
              <Volume2 size={14} />
              <span>Screen Reader</span>
            </div>
            <div className="flex items-center gap-1">
              <Languages size={14} />
              <span>हिंदी / ENG</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Facebook size={14} />
              <Twitter size={14} />
              <Youtube size={14} />
            </div>
            <div className="flex items-center gap-2">
              <Link to="/login" className="border border-white/60 px-3 py-1 rounded-full">Login</Link>
              <button className="border border-white/60 px-3 py-1 rounded-full">Demo Login</button>
            </div>
          </div>
        </div>
      </div>

      {/* Branding Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="w-full px-4 sm:px-8 lg:px-16 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-6">
            <img src={PmagyLogo} alt="PMAGY" className="w-36 h-36 object-contain" />
            <div className="text-left">
              <p className="text-2xl font-semibold text-gray-800 tracking-wide">Adarsh Gram Under PM-AJAY</p>
              <p className="text-2xl text-gray-700">Department of Social Justice &amp; Empowerment</p>
              <p className="text-xl text-gray-600">Government of India</p>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <img src={AmritLogo} alt="Azadi Ka Amrit Mahotsav" className="h-24 object-contain" />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-blue-900 text-white shadow border-b-[6px] border-red-600 sticky top-0 z-40">
        <div className="w-full flex items-center justify-between px-4 sm:px-8 lg:px-16">
          <div className="hidden md:flex items-stretch text-sm font-semibold">
            {[
              { label: 'Home', path: '/' },
              { label: 'About Scheme', path: '/about' },
              { label: 'Reports', path: '/reports' },
              { label: 'Gallery', path: '/gallery' },
              { label: 'Downloads', path: '/downloads' },
              { label: 'Villages on Map', path: '/map', badge: 'NEW' },
              { label: 'Contact Us', path: '/contact' },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="px-5 py-4 border-r border-white/10 hover:bg-blue-800 relative"
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="absolute -top-1 right-3 text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded-sm">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
          <button
            onClick={() => setMobileNavOpen((prev) => !prev)}
            className="md:hidden"
            aria-label="Open navigation menu"
          >
            {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileNavOpen && (
          <div className="md:hidden border-t border-blue-800 bg-blue-950 px-4 py-3 space-y-2 text-sm">
            {[
              { label: 'Home', path: '/' },
              { label: 'About Scheme', path: '/about' },
              { label: 'Reports', path: '/reports' },
              { label: 'Gallery', path: '/gallery' },
              { label: 'Downloads', path: '/downloads' },
              { label: 'Villages on Map', path: '/map' },
              { label: 'Contact Us', path: '/contact' },
            ].map((item) => (
              <Link key={item.label} to={item.path} className="block py-1" onClick={() => setMobileNavOpen(false)}>
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main id="main-content" tabIndex={-1} className="outline-none">
        <section className="w-full px-4 sm:px-8 lg:px-16 mt-8 grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="relative h-[24rem] sm:h-[26rem] lg:h-[28rem] rounded-3xl overflow-hidden shadow-lg border border-gray-100">
          <div className="absolute inset-0 flex animate-[heroSlide_24s_linear_infinite]">
            {mockData.heroImages.concat(mockData.heroImages[0]).map((image, index) => (
              <div
                key={`${image.url}-${index}`}
                className="min-w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `linear-gradient(90deg, rgba(12, 32, 75, 0.75), rgba(12, 32, 75, 0.45)), url(${image.url})` }}
              >
                <div className="h-full w-full flex flex-col justify-end p-8 text-white">
                  <p className="text-sm uppercase tracking-[0.3em] text-orange-200">PM-AJAY Spotlight</p>
                  <h2 className="text-3xl font-semibold max-w-xl">{image.caption}</h2>
                  <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-200">
                    Explore More <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[24rem]">
          <div className="bg-orange-500 text-white px-6 py-4 font-semibold tracking-wide">
            New &amp; Updates
          </div>
          <div className="relative flex-1 overflow-hidden">
            <div className="absolute inset-0 px-6 py-4">
              <div className="flex flex-col gap-4 animate-[ticker_16s_linear_infinite]">
                {tickerItems.map((item, idx) => (
                  <div key={`${item.title}-${idx}`} className="border-b border-gray-100 pb-3">
                    <p className="text-sm font-semibold text-blue-900">{item.title}</p>
                    <p className="text-xs text-gray-500">Updated on {item.date}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="mt-12 bg-gray-50 border-y border-gray-100 py-12">
        <div className="w-full px-4 sm:px-8 lg:px-16">
          <div className="flex flex-col gap-3 text-center mb-10">
            <p className="text-sm uppercase tracking-[0.4em] text-blue-900">Mission Dashboard</p>
            <h3 className="text-3xl font-semibold text-gray-900">Key Indicators for PM-AJAY</h3>
            <p className="text-gray-500 max-w-3xl mx-auto">
              Real-time monitoring of model village development projects under the Pradhan Mantri Adarsh Gram Yojana.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {mockData.stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white mt-12">
        <div className="w-full px-4 sm:px-8 lg:px-16 py-10 grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-lg font-semibold mb-4">Related Links</p>
            <ul className="space-y-2 text-sm text-blue-100">
              {mockData.footerLinks.related.map((link) => (
                <li key={link}>{link}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-lg font-semibold mb-4">Contact Information</p>
            <ul className="space-y-2 text-sm text-blue-100">
              {mockData.footerLinks.contact.map((info) => (
                <li key={info}>{info}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-lg font-semibold mb-4">Nodal Officer</p>
            <ul className="space-y-2 text-sm text-blue-100">
              {mockData.footerLinks.officer.map((info) => (
                <li key={info}>{info}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-blue-950 text-center text-xs text-blue-200 py-3">
          © {new Date().getFullYear()} Pradhan Mantri Adarsh Gram Yojana | Designed & Maintained by NIC
        </div>
      </footer>
    </div>
  );
};

export default Home;

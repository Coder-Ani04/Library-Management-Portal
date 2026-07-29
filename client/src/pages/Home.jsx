import { Link } from 'react-router-dom';
import { FaSearch, FaClock, FaShieldAlt } from 'react-icons/fa';

const Home = () => {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
        <span className="inline-block text-xs font-semibold tracking-wide text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full mb-6">
          Built for Schools & Colleges
        </span>
        <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight mb-6">
          Manage Your Library,<br />
          <span className="text-indigo-400">The Modern Way</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
          A complete library management portal for students and administrators —
          track books, manage issues and returns, and monitor fines, all in one place.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/register"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Get Started
          </Link>
          <Link
            to="/about"
            className="text-slate-300 hover:text-white font-medium px-6 py-3 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: <FaSearch className="text-indigo-400" size={22} />,
              title: 'Smart Search',
              desc: 'Find any book instantly with powerful search and filters.',
            },
            {
              icon: <FaClock className="text-indigo-400" size={22} />,
              title: 'Real-Time Tracking',
              desc: 'Stay updated on due dates, returns, and fine status.',
            },
            {
              icon: <FaShieldAlt className="text-indigo-400" size={22} />,
              title: 'Secure Access',
              desc: 'Role-based authentication for students and admins.',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
            >
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
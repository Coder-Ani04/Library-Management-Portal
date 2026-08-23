import { Outlet, useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaBook, FaMoneyBillWave, FaUser, FaSignOutAlt, FaBookOpen } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const StudentLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { path: '/student/dashboard', label: 'Overview', icon: <FaHome size={16} />, end: true },
    { path: '/student/dashboard/books', label: 'Search Books', icon: <FaSearch size={16} /> },
    { path: '/student/dashboard/borrowed', label: 'Borrowed Books', icon: <FaBook size={16} /> },
    { path: '/student/dashboard/fines', label: 'Fine Status', icon: <FaMoneyBillWave size={16} /> },
    { path: '/student/dashboard/profile', label: 'Profile', icon: <FaUser size={16} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <FaBookOpen className="text-indigo-400" size={22} />
            LibraryPortal
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">
              Hi, <span className="text-white font-medium">{user?.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors"
            >
              <FaSignOutAlt size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <Sidebar links={links} title="Student Menu" />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
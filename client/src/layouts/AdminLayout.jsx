import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome, FaBook, FaTags, FaUsers, FaExchangeAlt,
  FaMoneyBillWave, FaSignOutAlt, FaBookOpen,
  FaClipboardList} from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location=useLocation();

  const links = [
    { path: '/admin/dashboard', label: 'Overview', icon: <FaHome size={16} />, end: true },
    { path: '/admin/dashboard/books', label: 'Manage Books', icon: <FaBook size={16} /> },
    { path: '/admin/dashboard/categories', label: 'Categories', icon: <FaTags size={16} /> },
    { path: '/admin/dashboard/students', label: 'Students', icon: <FaUsers size={16} /> },
    { path: '/admin/dashboard/requests', label: 'Book Requests', icon: <FaClipboardList size={16} /> },
    { path: '/admin/dashboard/issue', label: 'Issue/Return', icon: <FaExchangeAlt size={16} /> },
    { path: '/admin/dashboard/fines', label: 'Fines', icon: <FaMoneyBillWave size={16} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <FaBookOpen className="text-indigo-400" size={22} />
            LibraryPortal <span className="text-indigo-400 text-sm font-normal">Admin</span>
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
        <Sidebar links={links} title="Admin Menu" />
        <main className="flex-1 p-6 page-fade-in" key={location.pathname}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
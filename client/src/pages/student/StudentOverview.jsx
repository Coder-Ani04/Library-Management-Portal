import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaMoneyBillWave, FaSearch } from 'react-icons/fa';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StudentOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ borrowedCount: 0, pendingFines: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [issuesRes, finesRes] = await Promise.all([
          api.get('/issues?status=issued'),
          api.get('/fines?status=pending'),
        ]);

        const totalFineAmount = finesRes.data.fines.reduce((sum, f) => sum + f.amount, 0);

        setStats({
          borrowedCount: issuesRes.data.total,
          pendingFines: totalFineAmount,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">
        Welcome back, {user?.name?.split(' ')[0]}
      </h1>
      <p className="text-slate-400 text-sm mb-8">Here's what's happening with your account</p>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Books Borrowed</span>
            <FaBook className="text-indigo-400" size={18} />
          </div>
          <p className="text-3xl font-bold text-white">
            {loading ? '...' : stats.borrowedCount}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Pending Fines</span>
            <FaMoneyBillWave className="text-indigo-400" size={18} />
          </div>
          <p className="text-3xl font-bold text-white">
            {loading ? '...' : `₹${stats.pendingFines}`}
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/student/dashboard/books"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <FaSearch size={14} />
            Browse Books
          </Link>
          <Link
            to="/student/dashboard/borrowed"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <FaBook size={14} />
            View Borrowed Books
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;
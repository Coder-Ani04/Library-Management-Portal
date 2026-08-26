import { useState, useEffect } from 'react';
import { FaBook, FaUsers, FaExchangeAlt, FaMoneyBillWave } from 'react-icons/fa';
import api from '../../services/api';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalStudents: 0,
    booksIssued: 0,
    pendingFines: 0,
  });
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksRes, studentsRes, issuesRes, finesRes] = await Promise.all([
          api.get('/books?limit=1'),
          api.get('/auth/students?limit=1'),
          api.get('/issues?status=issued&limit=5'),
          api.get('/fines?status=pending&limit=100'),
        ]);

        const totalFineAmount = finesRes.data.fines.reduce((sum, f) => sum + f.amount, 0);

        setStats({
          totalBooks: booksRes.data.total,
          totalStudents: studentsRes.data.total,
          booksIssued: issuesRes.data.total,
          pendingFines: totalFineAmount,
        });
        setRecentIssues(issuesRes.data.issuedBooks);
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const cards = [
    { label: 'Total Books', value: stats.totalBooks, icon: <FaBook size={18} /> },
    { label: 'Total Students', value: stats.totalStudents, icon: <FaUsers size={18} /> },
    { label: 'Books Issued', value: stats.booksIssued, icon: <FaExchangeAlt size={18} /> },
    { label: 'Pending Fines', value: `₹${stats.pendingFines}`, icon: <FaMoneyBillWave size={18} /> },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Dashboard Overview</h1>
      <p className="text-slate-400 text-sm mb-8">A snapshot of your library's activity</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-sm">{card.label}</span>
              <span className="text-indigo-400">{card.icon}</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {loading ? '...' : card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">Recently Issued Books</h2>
        {loading ? (
          <p className="text-slate-400 text-sm">Loading...</p>
        ) : recentIssues.length === 0 ? (
          <p className="text-slate-500 text-sm">No books currently issued.</p>
        ) : (
          <div className="space-y-3">
            {recentIssues.map((issue) => (
              <div
                key={issue._id}
                className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0"
              >
                <div>
                  <p className="text-white text-sm font-medium">{issue.book?.title}</p>
                  <p className="text-slate-500 text-xs">
                    {issue.student?.name} ({issue.student?.studentId})
                  </p>
                </div>
                <span className="text-slate-400 text-xs">Due {formatDate(issue.dueDate)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
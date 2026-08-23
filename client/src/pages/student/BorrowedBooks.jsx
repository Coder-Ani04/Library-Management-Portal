import { useState, useEffect } from 'react';
import { FaBook } from 'react-icons/fa';
import api from '../../services/api';

const BorrowedBooks = () => {
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState('issued'); // 'issued' or 'returned'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/issues?status=${filter}`);
        setIssues(res.data.issuedBooks);
      } catch (error) {
        console.error('Failed to fetch issued books', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [filter]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const isOverdue = (dueDate, status) =>
    status === 'issued' && new Date(dueDate) < new Date();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Borrowed Books</h1>
      <p className="text-slate-400 text-sm mb-6">Your current and past borrowed books</p>

      <div className="flex gap-2 mb-6">
        {['issued', 'returned'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${
              filter === tab
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab === 'issued' ? 'Currently Borrowed' : 'Return History'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : issues.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <FaBook size={32} className="mx-auto mb-3 opacity-50" />
          {filter === 'issued' ? 'No books currently borrowed.' : 'No return history yet.'}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/50 text-slate-400 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Book</th>
                <th className="px-5 py-3 font-medium">Issue Date</th>
                <th className="px-5 py-3 font-medium">Due Date</th>
                {filter === 'returned' && <th className="px-5 py-3 font-medium">Return Date</th>}
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {issues.map((issue) => (
                <tr key={issue._id}>
                  <td className="px-5 py-4 text-white">{issue.book?.title}</td>
                  <td className="px-5 py-4 text-slate-400">{formatDate(issue.issueDate)}</td>
                  <td className="px-5 py-4 text-slate-400">{formatDate(issue.dueDate)}</td>
                  {filter === 'returned' && (
                    <td className="px-5 py-4 text-slate-400">{formatDate(issue.returnDate)}</td>
                  )}
                  <td className="px-5 py-4">
                    {isOverdue(issue.dueDate, issue.status) ? (
                      <span className="text-red-400 text-xs font-medium bg-red-500/10 px-2.5 py-1 rounded-full">
                        Overdue
                      </span>
                    ) : (
                      <span className="text-green-400 text-xs font-medium bg-green-500/10 px-2.5 py-1 rounded-full capitalize">
                        {issue.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BorrowedBooks;
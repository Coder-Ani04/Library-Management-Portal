import { useState, useEffect } from 'react';
import { FaMoneyBillWave } from 'react-icons/fa';
import api from '../../services/api';

const ManageFines = () => {
  const [fines, setFines] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  const fetchFines = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/fines?status=${filter}&limit=100`);
      setFines(res.data.fines);
    } catch (error) {
      console.error('Failed to fetch fines', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFines();
  }, [filter]);

  const handleMarkPaid = async (fineId) => {
    setPayingId(fineId);
    try {
      await api.put(`/fines/${fineId}/pay`);
      fetchFines();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update fine');
    } finally {
      setPayingId(null);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Manage Fines</h1>
      <p className="text-slate-400 text-sm mb-6">Track and settle student fines</p>

      <div className="flex gap-2 mb-6">
        {['pending', 'paid'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${
              filter === tab
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-400">Loading fines...</p>
      ) : fines.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <FaMoneyBillWave size={32} className="mx-auto mb-3 opacity-50" />
          No {filter} fines.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/50 text-slate-400 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Student</th>
                <th className="px-5 py-3 font-medium">Book</th>
                <th className="px-5 py-3 font-medium">Days Late</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Date</th>
                {filter === 'pending' && <th className="px-5 py-3 font-medium text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {fines.map((fine) => (
                <tr key={fine._id}>
                  <td className="px-5 py-4 text-white">
                    {fine.student?.name} <span className="text-slate-500">({fine.student?.studentId})</span>
                  </td>
                  <td className="px-5 py-4 text-slate-400">{fine.issuedBook?.book?.title}</td>
                  <td className="px-5 py-4 text-slate-400">{fine.daysLate} day(s)</td>
                  <td className="px-5 py-4 text-white font-medium">₹{fine.amount}</td>
                  <td className="px-5 py-4 text-slate-400">{formatDate(fine.createdAt)}</td>
                  {filter === 'pending' && (
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleMarkPaid(fine._id)}
                        disabled={payingId === fine._id}
                        className="text-sm text-indigo-400 hover:text-indigo-300 font-medium disabled:opacity-50"
                      >
                        {payingId === fine._id ? 'Processing...' : 'Mark as Paid'}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageFines;
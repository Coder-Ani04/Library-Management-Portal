import { useState, useEffect } from 'react';
import { FaMoneyBillWave } from 'react-icons/fa';
import api from '../../services/api';
import Spinner from '../../components/Spinner';

const FineStatus = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFines = async () => {
      try {
        const res = await api.get('/fines');
        setFines(res.data.fines);
      } catch (error) {
        console.error('Failed to fetch fines', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFines();
  }, []);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const totalPending = fines
    .filter((f) => f.status === 'pending')
    .reduce((sum, f) => sum + f.amount, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Fine Status</h1>
      <p className="text-slate-400 text-sm mb-6">Track your late return fines</p>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
        <p className="text-slate-400 text-sm mb-1">Total Pending Fines</p>
        <p className="text-3xl font-bold text-white">₹{totalPending}</p>
      </div>

      {loading ? (
        <Spinner/>
      ) : fines.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <FaMoneyBillWave size={32} className="mx-auto mb-3 opacity-50" />
          No fines on your account. Great job returning books on time!
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/50 text-slate-400 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Book</th>
                <th className="px-5 py-3 font-medium">Days Late</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {fines.map((fine) => (
                <tr key={fine._id}>
                  <td className="px-5 py-4 text-white">{fine.issuedBook?.book?.title}</td>
                  <td className="px-5 py-4 text-slate-400">{fine.daysLate} day(s)</td>
                  <td className="px-5 py-4 text-white font-medium">₹{fine.amount}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                        fine.status === 'paid'
                          ? 'text-green-400 bg-green-500/10'
                          : 'text-amber-400 bg-amber-500/10'
                      }`}
                    >
                      {fine.status}
                    </span>
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

export default FineStatus;
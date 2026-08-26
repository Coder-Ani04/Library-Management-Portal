import { useState, useEffect } from 'react';
import { FaClipboardList } from 'react-icons/fa';
import api from '../../services/api';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get('/requests');
        setRequests(res.data.requests);
      } catch (error) {
        console.error('Failed to fetch requests', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const statusStyles = {
    pending: 'text-amber-400 bg-amber-500/10',
    approved: 'text-green-400 bg-green-500/10',
    rejected: 'text-red-400 bg-red-500/10',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">My Requests</h1>
      <p className="text-slate-400 text-sm mb-6">Track the status of your book requests</p>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <FaClipboardList size={32} className="mx-auto mb-3 opacity-50" />
          You haven't requested any books yet.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/50 text-slate-400 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Book</th>
                <th className="px-5 py-3 font-medium">Requested On</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {requests.map((req) => (
                <tr key={req._id}>
                  <td className="px-5 py-4 text-white">{req.book?.title}</td>
                  <td className="px-5 py-4 text-slate-400">{formatDate(req.createdAt)}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusStyles[req.status]}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-400 text-xs">
                    {req.status === 'rejected' ? req.rejectionReason : '—'}
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

export default MyRequests;
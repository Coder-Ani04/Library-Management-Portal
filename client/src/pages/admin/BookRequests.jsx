import { useState, useEffect } from 'react';
import { FaClipboardList } from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner';

const BookRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/requests?status=${filter}&limit=100`);
      setRequests(res.data.requests);
    } catch (error) {
      console.error('Failed to fetch requests', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await api.put(`/requests/${id}/approve`);
      toast.success('Request approved and book issued');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Reason for rejection (optional):') || '';
    setProcessingId(id);
    try {
      await api.put(`/requests/${id}/reject`, { reason });
      toast.success('Request rejected');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject request');
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Book Requests</h1>
      <p className="text-slate-400 text-sm mb-6">Review and process student borrow requests</p>

      <div className="flex gap-2 mb-6">
        {['pending', 'approved', 'rejected'].map((tab) => (
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
        <Spinner/>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <FaClipboardList size={32} className="mx-auto mb-3 opacity-50" />
          No {filter} requests.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/50 text-slate-400 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Student</th>
                <th className="px-5 py-3 font-medium">Book</th>
                <th className="px-5 py-3 font-medium">Requested On</th>
                {filter === 'pending' && <th className="px-5 py-3 font-medium text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {requests.map((req) => (
                <tr key={req._id}>
                  <td className="px-5 py-4 text-white">
                    {req.student?.name} <span className="text-slate-500">({req.student?.studentId})</span>
                  </td>
                  <td className="px-5 py-4 text-slate-400">{req.book?.title}</td>
                  <td className="px-5 py-4 text-slate-400">{formatDate(req.createdAt)}</td>
                  {filter === 'pending' && (
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleApprove(req._id)}
                          disabled={processingId === req._id}
                          className="text-sm text-green-400 hover:text-green-300 font-medium disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(req._id)}
                          disabled={processingId === req._id}
                          className="text-sm text-red-400 hover:text-red-300 font-medium disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
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

export default BookRequests;
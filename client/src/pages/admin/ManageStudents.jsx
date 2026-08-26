import { useState, useEffect } from 'react';
import { FaUsers, FaSearch } from 'react-icons/fa';
import api from '../../services/api';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        params.append('limit', 100);

        const res = await api.get(`/auth/students?${params.toString()}`);
        setStudents(res.data.students);
      } catch (error) {
        console.error('Failed to fetch students', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchStudents, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Students</h1>
      <p className="text-slate-400 text-sm mb-6">View all registered students</p>

      <div className="relative mb-6 max-w-sm">
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or student ID..."
          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {loading ? (
        <p className="text-slate-400">Loading students...</p>
      ) : students.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <FaUsers size={32} className="mx-auto mb-3 opacity-50" />
          No students found.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/50 text-slate-400 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Student ID</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {students.map((student) => (
                <tr key={student._id}>
                  <td className="px-5 py-4 text-white">{student.name}</td>
                  <td className="px-5 py-4 text-slate-400">{student.email}</td>
                  <td className="px-5 py-4 text-slate-400">{student.studentId}</td>
                  <td className="px-5 py-4 text-slate-400">{student.phone || '—'}</td>
                  <td className="px-5 py-4 text-slate-400">{formatDate(student.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
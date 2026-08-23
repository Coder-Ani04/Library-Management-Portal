import { useAuth } from '../../context/AuthContext';
import { FaUser, FaEnvelope, FaIdCard, FaPhone } from 'react-icons/fa';

const StudentProfile = () => {
  const { user } = useAuth();

  const fields = [
    { label: 'Full Name', value: user?.name, icon: <FaUser size={16} /> },
    { label: 'Email', value: user?.email, icon: <FaEnvelope size={16} /> },
    { label: 'Student ID', value: user?.studentId, icon: <FaIdCard size={16} /> },
    { label: 'Phone', value: user?.phone || 'Not provided', icon: <FaPhone size={16} /> },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Profile</h1>
      <p className="text-slate-400 text-sm mb-6">Your account information</p>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-xl">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-semibold text-lg">{user?.name}</p>
            <p className="text-slate-400 text-sm capitalize">{user?.role}</p>
          </div>
        </div>

        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.label} className="flex items-center gap-3">
              <div className="text-slate-500">{field.icon}</div>
              <div>
                <p className="text-xs text-slate-500">{field.label}</p>
                <p className="text-white text-sm">{field.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-indigo-400 mb-4">404</h1>
      <p className="text-slate-400 mb-6">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-lg transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
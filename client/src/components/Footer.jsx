import { Link } from 'react-router-dom';
import { FaBookOpen, FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-2">
              <FaBookOpen className="text-indigo-400" size={20} />
              LibraryPortal
            </div>
            <p className="text-sm text-slate-400 max-w-xs">
              A modern library management system built for schools and colleges.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <h4 className="text-white text-sm font-semibold mb-3">Navigation</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold mb-3">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="GitHub">
                  <FaGithub size={20} />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="LinkedIn">
                  <FaLinkedin size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-sm text-slate-500">
          © {year} LibraryPortal. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
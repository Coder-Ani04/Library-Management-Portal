import { NavLink } from 'react-router-dom';

const Sidebar = ({ links, title }) => {
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`;

  return (
    <aside className="w-64 shrink-0 bg-slate-900 border-r border-slate-800 min-h-[calc(100vh-64px)] p-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 mb-3">
        {title}
      </p>
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink key={link.path} to={link.path} end={link.end} className={linkClasses}>
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
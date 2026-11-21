import { NavLink } from 'react-router-dom';
import { Home, Package, LayoutGrid, Users, BarChart3, Settings, X } from 'lucide-react';
import { LogoBadge } from './Shared';

const NAV = [
  { to: '/', label: 'Dashboard', icon: Home, end: true },
  { to: '/products', label: 'Product / items', icon: Package },
  { to: '/categories', label: 'Categories', icon: LayoutGrid },
  { to: '/users', label: 'User', icon: Users },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

/** On tablets and phones the sidebar is a slide-out drawer controlled by `open`. */
export default function Sidebar({ open = false, onClose = () => {} }) {
  return (
    <aside className={`sidebar${open ? ' is-open' : ''}`} aria-label="Sidebar">
      <div className="brand">
        <LogoBadge size={48} className="brand__logo" />
        <div>
          <p className="brand__name">IDSC</p>
          <p className="brand__sub">Inventory Management</p>
        </div>
        <button className="sidebar__close" aria-label="Close menu" onClick={onClose}><X size={18} /></button>
      </div>
      <nav className="nav" aria-label="Main">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onClose} className={({ isActive }) => `nav__link${isActive ? ' is-active' : ''}`}>
            <Icon size={20} strokeWidth={1.6} /> {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
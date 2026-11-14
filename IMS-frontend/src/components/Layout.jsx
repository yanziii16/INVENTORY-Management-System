import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useInventory } from '../context/InventoryContext';

export default function Layout() {
  const { toast } = useInventory();
  const { pathname } = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  // Close the drawer when the page changes or Escape is pressed.
  useEffect(() => setNavOpen(false), [pathname]);
  useEffect(() => {
    if (!navOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setNavOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [navOpen]);

  return (
    <div className="app">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
      {navOpen && <div className="scrim" onClick={() => setNavOpen(false)} aria-hidden="true" />}
      <div className="main">
        <Topbar onMenu={() => setNavOpen(true)} />
        <main className="content"><Outlet /></main>
      </div>
      {toast && <div className="toast" role="status">{toast.message}</div>}
    </div>
  );
}
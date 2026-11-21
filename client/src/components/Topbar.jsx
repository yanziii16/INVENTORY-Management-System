import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, ChevronDown, LogOut, User, Settings, Package, LayoutGrid, Users as UsersIcon } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

function useOutside(ref, onOutside) {
  useEffect(() => {
    const click = (e) => ref.current && !ref.current.contains(e.target) && onOutside();
    const key = (e) => e.key === 'Escape' && onOutside();
    document.addEventListener('mousedown', click);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('mousedown', click); document.removeEventListener('keydown', key); };
  }, [ref, onOutside]);
}

export default function Topbar({ onMenu }) {
  const navigate = useNavigate();
  const { items, categories, users, alerts, unreadCount, readAlerts, markAlertRead, markAllRead } = useInventory();
  const [q, setQ] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const bellRef = useRef(null);
  const menuRef = useRef(null);
  useOutside(searchRef, () => setSearchOpen(false));
  useOutside(bellRef, () => setBellOpen(false));
  useOutside(menuRef, () => setMenuOpen(false));

  const term = q.trim().toLowerCase();
  const results = useMemo(() => {
    if (term.length < 2) return null;
    return {
      items: items.filter((i) => i.name.toLowerCase().includes(term) || i.sku.toLowerCase().includes(term)).slice(0, 5),
      categories: categories.filter((c) => c.name.toLowerCase().includes(term)).slice(0, 4),
      users: users.filter((u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)).slice(0, 4),
    };
  }, [term, items, categories, users]);
  const total = results ? results.items.length + results.categories.length + results.users.length : 0;

  const go = (path, text) => {
    navigate(`${path}?q=${encodeURIComponent(text)}`);
    setQ('');
    setSearchOpen(false);
  };
  const onEnter = (e) => {
    if (e.key !== 'Enter' || !results) return;
    if (results.items[0]) go('/products', results.items[0].name);
    else if (results.categories[0]) go('/categories', results.categories[0].name);
    else if (results.users[0]) go('/users', results.users[0].name);
  };

  const Group = ({ title, icon: Icon, children }) => (
    <div className="search-results__group">
      <p className="search-results__title"><Icon size={12} /> {title}</p>
      {children}
    </div>
  );

  return (
    <header className="topbar">
      <button className="topbar__menu" aria-label="Open menu" onClick={onMenu}><Menu size={22} /></button>
      <div className="search-wrap" ref={searchRef}>
        <label className="searchbox">
          <Search size={15} />
          <input placeholder="Search Something..." aria-label="Search items, categories and users" value={q}
            onChange={(e) => { setQ(e.target.value); setSearchOpen(true); }} onFocus={() => setSearchOpen(true)} onKeyDown={onEnter} />
        </label>
        {searchOpen && results && (
          <div className="search-results" role="listbox">
            {total === 0 && <p className="search-results__empty">No matches for “{q.trim()}”.</p>}
            {results.items.length > 0 && (
              <Group title="Items" icon={Package}>
                {results.items.map((i) => <button key={i.id} className="search-results__item" onClick={() => go('/products', i.name)}><span>{i.name}</span><small>{i.sku}</small></button>)}
              </Group>
            )}
            {results.categories.length > 0 && (
              <Group title="Categories" icon={LayoutGrid}>
                {results.categories.map((c) => <button key={c.id} className="search-results__item" onClick={() => go('/categories', c.name)}><span>{c.name}</span><small>{c.id}</small></button>)}
              </Group>
            )}
            {results.users.length > 0 && (
              <Group title="Users" icon={UsersIcon}>
                {results.users.map((u) => <button key={u.id} className="search-results__item" onClick={() => go('/users', u.name)}><span>{u.name}</span><small>{u.role}</small></button>)}
              </Group>
            )}
          </div>
        )}
      </div>

      <div className="bell-wrap" ref={bellRef}>
        <button className="topbar__bell" aria-label={`Notifications, ${unreadCount} unread`} aria-expanded={bellOpen} onClick={() => setBellOpen(!bellOpen)}>
          <Bell size={21} strokeWidth={1.6} />
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </button>
        {bellOpen && (
          <div className="notif">
            <div className="notif__head">
              <strong>Notifications</strong>
              {unreadCount > 0 && <button className="link" onClick={markAllRead}>Mark all as read</button>}
            </div>
            {alerts.length === 0 && <p className="notif__empty">You're all caught up.</p>}
            {alerts.map((a) => (
              <button key={a.id} className={`notif__item${readAlerts.includes(a.id) ? '' : ' is-unread'}`}
                onClick={() => { markAlertRead(a.id); setBellOpen(false); navigate(`/products?q=${encodeURIComponent(a.query)}`); }}>
                <span className={`notif__dot notif__dot--${a.tone}`} />
                <span><strong>{a.title}</strong><small>{a.text}</small></span>
              </button>
            ))}
          </div>
        )}
      </div>

      <span className="topbar__divider" />
      <div className="profile" ref={menuRef}>
        <button className="profile__btn" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <span className="profile__avatar"><User size={18} /></span>
          <span className="profile__text">
            <span className="profile__name">Admin User</span>
            <span className="profile__role">Administrator</span>
          </span>
          <ChevronDown size={16} />
        </button>
        {menuOpen && (
          <div className="menu">
            <button className="menu__item" onClick={() => { setMenuOpen(false); navigate('/settings'); }}><Settings size={14} /> Account</button>
            <button className="menu__item menu__item--danger" onClick={() => navigate('/login')}><LogOut size={14} /> Log out</button>
          </div>
        )}
      </div>
    </header>
  );
}
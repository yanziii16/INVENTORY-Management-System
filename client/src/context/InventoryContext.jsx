import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'idsc-inventory-v1';

export const UNITS = ['pcs', 'units', 'reams', 'boxes', 'sets', 'liters', 'kg'];
export const CONDITIONS = ['Good', 'For Repair', 'Under Maintenance', 'Damaged'];
export const ROLES = ['Admin', 'Staff', 'Viewer'];
export const STOCK_TONE = { 'In Stock': 'green', 'Low Stock': 'amber', 'Out of Stock': 'red' };

export const stockStatus = (i) => (Number(i.qty) <= 0 ? 'Out of Stock' : Number(i.qty) <= Number(i.reorderLevel) ? 'Low Stock' : 'In Stock');
export const peso = (n) => `₱${Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
export const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(/(\d{4}), /, '$1  ');

const SEED = {
  categories: [
    { id: 'CAT-001', name: 'Cleaning Materials', skuPrefix: 'CLN', description: 'Cleaning supplies such as brooms, mops, disinfectants, and trash bags.', status: 'Active' },
    { id: 'CAT-002', name: 'Networking Tools', skuPrefix: 'NET', description: 'Networking tools and accessories such as LAN cables, routers, switches, and RJ45 connectors.', status: 'Active' },
    { id: 'CAT-003', name: 'HM Laboratory Equipment', skuPrefix: 'HM', description: 'Hospitality Management laboratory supplies such as plates, cutlery, cooking utensils, and kitchen equipment.', status: 'Active' },
    { id: 'CAT-004', name: 'Criminology Supplies', skuPrefix: 'CRIM', description: 'Criminology training and forensic supplies such as fingerprint kits, evidence bags, handcuffs, and crime scene markers.', status: 'Active' },
    { id: 'CAT-005', name: 'Uniforms & Apparel', skuPrefix: 'UNI', description: 'School uniforms, PE uniforms, HM uniforms, criminology uniforms, and laboratory gowns.', status: 'Active' },
    { id: 'CAT-006', name: 'Computer Equipment', skuPrefix: 'COMP', description: 'Computer accessories such as monitors, keyboards, computer mice, printers, HDMI cables, and extension cords.', status: 'Active' },
    { id: 'CAT-007', name: 'Office Supplies', skuPrefix: 'OFF', description: 'Paper, ink, folders, pens, and other everyday office consumables.', status: 'Active' },
  ],
  items: [
    { id: 'ITM-001', name: 'Mop and Bucket Set', categoryId: 'CAT-001', sku: 'CLN-001', qty: 12, unit: 'pcs', reorderLevel: 5, unitPrice: 450, condition: 'Good', location: 'Storage Room A', description: '', createdAt: '2026-09-20T09:00:00' },
    { id: 'ITM-002', name: 'PE Uniform', categoryId: 'CAT-005', sku: 'UNI-001', qty: 350, unit: 'pcs', reorderLevel: 400, unitPrice: 350, condition: 'Good', location: 'Storage Room B', description: '', createdAt: '2026-09-20T09:10:00' },
    { id: 'ITM-003', name: 'LAN Cable (Cat6)', categoryId: 'CAT-002', sku: 'NET-001', qty: 25, unit: 'pcs', reorderLevel: 10, unitPrice: 120, condition: 'Good', location: 'IT Office', description: '', createdAt: '2026-09-21T10:00:00' },
    { id: 'ITM-004', name: 'Computer Mouse', categoryId: 'CAT-006', sku: 'COMP-001', qty: 25, unit: 'pcs', reorderLevel: 10, unitPrice: 450, condition: 'Good', location: 'IT Office', description: '', createdAt: '2026-09-21T10:30:00' },
    { id: 'ITM-005', name: 'Printer Paper (A4)', categoryId: 'CAT-007', sku: 'OFF-001', qty: 100, unit: 'reams', reorderLevel: 20, unitPrice: 260, condition: 'Good', location: 'Storage Room A', description: '', createdAt: '2026-09-22T08:30:00' },
    { id: 'ITM-006', name: 'Serving Tray', categoryId: 'CAT-003', sku: 'HM-001', qty: 2, unit: 'units', reorderLevel: 5, unitPrice: 800, condition: 'Good', location: 'HM Laboratory', description: '', createdAt: '2026-09-22T09:00:00' },
  ],
  users: [
    { id: 'USR-001', name: 'Marie Ann Santos', email: 'marie.santos@idsc.edu.ph', role: 'Admin', status: 'Active' },
    { id: 'USR-002', name: 'Paul Reyes', email: 'paul.reyes@idsc.edu.ph', role: 'Staff', status: 'Active' },
    { id: 'USR-003', name: 'Luis Cruz', email: 'luis.cruz@idsc.edu.ph', role: 'Viewer', status: 'Active' },
    { id: 'USR-004', name: 'Jhon Put', email: 'jhon.put@idsc.edu.ph', role: 'Staff', status: 'Inactive' },
  ],
  activity: [
    { id: 'a8', at: '2026-10-02T14:37:00', itemName: 'Printer Ink', qty: -4, status: 'Issued' },
    { id: 'a7', at: '2026-10-02T14:37:00', itemName: 'Blender', qty: -1, status: 'For Repair' },
    { id: 'a6', at: '2026-10-02T17:37:00', itemName: 'Broom', qty: 3, status: 'Returned' },
    { id: 'a5', at: '2026-10-02T15:05:00', itemName: 'Computer Monitor', qty: -1, status: 'Under Maintenance' },
    { id: 'a4', at: '2026-10-01T13:47:00', itemName: 'Keyboard', qty: -2, status: 'Damaged' },
    { id: 'a3', at: '2026-10-01T10:21:00', itemName: 'Disinfectant Spray (1L)', qty: -3, status: 'Issued' },
    { id: 'a2', at: '2026-09-29T14:13:00', itemName: 'LAN Cable (Cat 6)', qty: 5, status: 'Restocked' },
    { id: 'a1', at: '2026-09-28T09:35:00', itemName: 'Aircon', qty: -1, status: 'For Repair' },
  ],
  settings: {
    systemName: 'IDSC Inventory System', email: 'inventory@idsc.edu', contact: '+63 912 345 6789', address: 'Dunao Ligao City',
    threshold: 10, currency: 'PHP (₱)', archive: 30, approval: 'Always Required',
    alerts: { low: true, out: true, audit: true },
  },
  readAlerts: [],
};

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved) {
      return { ...SEED, ...saved, settings: { ...SEED.settings, ...saved.settings, alerts: { ...SEED.settings.alerts, ...saved.settings?.alerts } } };
    }
  } catch { /* ignore corrupt storage */ }
  return SEED;
}

const nextId = (prefix, list) => {
  const max = list.reduce((m, x) => Math.max(m, parseInt(String(x.id).split('-')[1], 10) || 0), 0);
  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
};

const InventoryContext = createContext(null);
export const useInventory = () => useContext(InventoryContext);

export function InventoryProvider({ children }) {
  const [initial] = useState(load);
  const [items, setItems] = useState(initial.items);
  const [categories, setCategories] = useState(initial.categories);
  const [users, setUsers] = useState(initial.users);
  const [activity, setActivity] = useState(initial.activity);
  const [settings, setSettings] = useState(initial.settings);
  const [readAlerts, setReadAlerts] = useState(initial.readAlerts);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, categories, users, activity, settings, readAlerts }));
    } catch { /* storage full or unavailable */ }
  }, [items, categories, users, activity, settings, readAlerts]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = useCallback((message) => setToast({ id: Date.now(), message }), []);
  const log = (entry) => setActivity((a) => [{ id: `a${Date.now()}${Math.random()}`, at: new Date().toISOString(), ...entry }, ...a].slice(0, 100));

  const itemsWithStatus = useMemo(() => items.map((i) => ({ ...i, status: stockStatus(i) })), [items]);
  const categoryName = (id) => categories.find((c) => c.id === id)?.name ?? 'Uncategorized';

  /* ---- Items ---- */
  const addItem = (data) => {
    const item = { ...data, id: nextId('ITM', items), createdAt: new Date().toISOString() };
    setItems((l) => [...l, item]);
    if (item.qty > 0) log({ itemName: item.name, qty: item.qty, status: 'Restocked' });
  };
  const updateItem = (id, data) => {
    const prev = items.find((i) => i.id === id);
    setItems((l) => l.map((i) => (i.id === id ? { ...i, ...data } : i)));
    const diff = data.qty - prev.qty;
    if (diff !== 0) log({ itemName: data.name, qty: diff, status: diff > 0 ? 'Restocked' : 'Issued' });
    if (data.condition !== prev.condition) log({ itemName: data.name, qty: 0, status: data.condition === 'Good' ? 'Returned' : data.condition });
  };
  const deleteItem = (id) => setItems((l) => l.filter((i) => i.id !== id));

  /* ---- Categories ---- */
  const addCategory = (data) => setCategories((l) => [...l, { ...data, id: nextId('CAT', l) }]);
  const updateCategory = (id, data) => setCategories((l) => l.map((c) => (c.id === id ? { ...c, ...data } : c)));
  const itemCount = (categoryId) => items.filter((i) => i.categoryId === categoryId).length;
  const deleteCategory = (id) => {
    if (itemCount(id) > 0) return false;
    setCategories((l) => l.filter((c) => c.id !== id));
    return true;
  };

  /* ---- Users ---- */
  const activeAdmins = users.filter((u) => u.role === 'Admin' && u.status === 'Active');
  const isLastAdmin = (u) => u.role === 'Admin' && u.status === 'Active' && activeAdmins.length <= 1;
  const addUser = (data) => setUsers((l) => [...l, { ...data, id: nextId('USR', l) }]);
  const updateUser = (id, data) => setUsers((l) => l.map((u) => (u.id === id ? { ...u, ...data } : u)));
  const deleteUser = (id) => {
    const u = users.find((x) => x.id === id);
    if (!u || isLastAdmin(u)) return false;
    setUsers((l) => l.filter((x) => x.id !== id));
    return true;
  };

  /* ---- Settings ---- */
  const updateSettings = (patch) => setSettings((s) => ({ ...s, ...patch }));

  /* ---- Notifications (derived from stock levels) ---- */
  const alerts = useMemo(() => {
    const list = [];
    itemsWithStatus.forEach((i) => {
      if (i.status === 'Out of Stock' && settings.alerts.out) list.push({ id: `out-${i.id}-${i.qty}`, tone: 'red', title: 'Out of stock', text: `${i.name} has run out.`, query: i.name });
      if (i.status === 'Low Stock' && settings.alerts.low) list.push({ id: `low-${i.id}-${i.qty}`, tone: 'amber', title: 'Low stock', text: `${i.name}: ${i.qty} ${i.unit} left (reorder at ${i.reorderLevel}).`, query: i.name });
      if (i.condition !== 'Good') list.push({ id: `cond-${i.id}-${i.condition}`, tone: 'blue', title: i.condition, text: `${i.name} is marked "${i.condition}".`, query: i.name });
    });
    return list;
  }, [itemsWithStatus, settings.alerts]);
  const unreadCount = alerts.filter((a) => !readAlerts.includes(a.id)).length;
  const markAlertRead = (id) => setReadAlerts((r) => (r.includes(id) ? r : [...r, id]));
  const markAllRead = () => setReadAlerts((r) => [...new Set([...r, ...alerts.map((a) => a.id)])]);

  const value = {
    items, itemsWithStatus, categories, users, activity, settings, toast, alerts, unreadCount, readAlerts,
    categoryName, itemCount, isLastAdmin, showToast,
    addItem, updateItem, deleteItem, addCategory, updateCategory, deleteCategory,
    addUser, updateUser, deleteUser, updateSettings, markAlertRead, markAllRead,
  };
  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}
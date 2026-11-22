import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'idsc-inventory-v1';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const UNITS = ['pcs', 'units', 'reams', 'boxes', 'sets', 'liters', 'kg'];
export const CONDITIONS = ['Good', 'For Repair', 'Under Maintenance', 'Damaged'];
export const ROLES = ['Admin', 'Staff', 'Viewer'];
export const STOCK_TONE = { 'In Stock': 'green', 'Low Stock': 'amber', 'Out of Stock': 'red' };

export const stockStatus = (i) =>
  Number(i.qty) <= 0
    ? 'Out of Stock'
    : Number(i.qty) <= Number(i.reorderLevel)
      ? 'Low Stock'
      : 'In Stock';

export const peso = (n) =>
  `₱${Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

export const formatDateTime = (iso) =>
  new Date(iso)
    .toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(/(\d{4}), /, '$1  ');

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
  items: [],
  users: [
    { id: 'USR-001', name: 'Marie Ann Santos', email: 'marie.santos@idsc.edu.ph', role: 'Admin', status: 'Active' },
    { id: 'USR-002', name: 'Paul Reyes', email: 'paul.reyes@idsc.edu.ph', role: 'Staff', status: 'Active' },
    { id: 'USR-003', name: 'Luis Cruz', email: 'luis.cruz@idsc.edu.ph', role: 'Viewer', status: 'Active' },
    { id: 'USR-004', name: 'Jhon Put', email: 'jhon.put@idsc.edu.ph', role: 'Staff', status: 'Inactive' },
  ],
  activity: [],
  settings: {
    systemName: 'IDSC Inventory System',
    email: 'inventory@idsc.edu',
    contact: '+63 912 345 6789',
    address: 'Dunao Ligao City',
    threshold: 10,
    currency: 'PHP (₱)',
    archive: 30,
    approval: 'Always Required',
    alerts: { low: true, out: true, audit: true },
  },
  readAlerts: [],
};

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved) {
      return {
        ...SEED,
        ...saved,
        settings: {
          ...SEED.settings,
          ...saved.settings,
          alerts: { ...SEED.settings.alerts, ...saved.settings?.alerts },
        },
      };
    }
  } catch {
    /* ignore corrupt storage */
  }
  return SEED;
}

const nextId = (prefix, list) => {
  const max = list.reduce(
    (m, x) => Math.max(m, parseInt(String(x.id).split('-')[1], 10) || 0),
    0
  );
  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
};

const getAuthHeaders = () => {
  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
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
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items, categories, users, activity, settings, readAlerts })
      );
    } catch {
      /* storage full or unavailable */
    }
  }, [items, categories, users, activity, settings, readAlerts]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = useCallback((message) => setToast({ id: Date.now(), message }), []);
  const log = (entry) =>
    setActivity((a) =>
      [{ id: `a${Date.now()}${Math.random()}`, at: new Date().toISOString(), ...entry }, ...a].slice(0, 100)
    );

  const itemsWithStatus = useMemo(
    () => items.map((i) => ({ ...i, status: stockStatus(i) })),
    [items]
  );

  const categoryName = (idOrName) => {
    if (!idOrName) return 'Uncategorized';
    const byId = categories.find((c) => c.id === idOrName);
    if (byId) return byId.name;
    const byName = categories.find(
      (c) => c.name.toLowerCase() === String(idOrName).toLowerCase()
    );
    return byName ? byName.name : String(idOrName);
  };

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/items`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((json) => {
        if (!active) return;
        const list = Array.isArray(json) ? json : json.data || json.items || [];
        setItems(
          list.map((row) => {
            const matchedCat = categories.find(
              (c) =>
                c.id === (row.category_id ?? row.categoryId) ||
                c.name.toLowerCase() === String(row.category ?? '').toLowerCase()
            );
            return {
              id: row.id,
              name: row.name,
              categoryId: matchedCat
                ? matchedCat.id
                : row.category_id ?? row.categoryId ?? row.category ?? '',
              sku: row.sku ?? '',
              qty: Number(row.quantity ?? row.qty ?? 0),
              unit: row.unit ?? 'pcs',
              reorderLevel: Number(row.min_stock_alert ?? row.reorderLevel ?? 5),
              unitPrice: Number(row.price ?? row.unitPrice ?? 0),
              condition: row.condition ?? 'Good',
              location: row.storage_location ?? row.location ?? '',
              description: row.description ?? '',
              createdAt: row.last_updated ?? row.createdAt ?? new Date().toISOString(),
            };
          })
        );
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [categories]);

  const addItem = async (data) => {
    const payload = {
      name: data.name,
      category: categoryName(data.categoryId),
      quantity: Number(data.qty),
      price: Number(data.unitPrice),
      min_stock_alert: Number(data.reorderLevel ?? 5),
    };

    const res = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to add item');

    const row = result.data || result.item || result;
    const created = {
      ...data,
      id: row.id ?? nextId('ITM', items),
      createdAt: row.last_updated ?? row.createdAt ?? new Date().toISOString(),
    };
    setItems((l) => [...l, created]);
    if (created.qty > 0) log({ itemName: created.name, qty: created.qty, status: 'Restocked' });
  };

  const updateItem = (id, data) => {
    const prev = items.find((i) => i.id === id);
    setItems((l) => l.map((i) => (i.id === id ? { ...i, ...data } : i)));
    if (prev) {
      const diff = Number(data.qty) - Number(prev.qty);
      if (diff !== 0) log({ itemName: data.name, qty: diff, status: diff > 0 ? 'Restocked' : 'Issued' });
      if (data.condition !== prev.condition) {
        log({ itemName: data.name, qty: 0, status: data.condition === 'Good' ? 'Returned' : data.condition });
      }
    }
  };

  const deleteItem = (id) => setItems((l) => l.filter((i) => i.id !== id));

  const addCategory = (data) => setCategories((l) => [...l, { ...data, id: nextId('CAT', l) }]);
  const updateCategory = (id, data) =>
    setCategories((l) => l.map((c) => (c.id === id ? { ...c, ...data } : c)));
  const itemCount = (categoryId) => items.filter((i) => i.categoryId === categoryId).length;
  const deleteCategory = (id) => {
    if (itemCount(id) > 0) return false;
    setCategories((l) => l.filter((c) => c.id !== id));
    return true;
  };

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

  const updateSettings = (patch) => setSettings((s) => ({ ...s, ...patch }));

  const alerts = useMemo(() => {
    const list = [];
    itemsWithStatus.forEach((i) => {
      if (i.status === 'Out of Stock' && settings.alerts.out) {
        list.push({ id: `out-${i.id}-${i.qty}`, tone: 'red', title: 'Out of stock', text: `${i.name} has run out.`, query: i.name });
      }
      if (i.status === 'Low Stock' && settings.alerts.low) {
        list.push({
          id: `low-${i.id}-${i.qty}`,
          tone: 'amber',
          title: 'Low stock',
          text: `${i.name}: ${i.qty} ${i.unit} left (reorder at ${i.reorderLevel}).`,
          query: i.name,
        });
      }
      if (i.condition !== 'Good') {
        list.push({ id: `cond-${i.id}-${i.condition}`, tone: 'blue', title: i.condition, text: `${i.name} is marked "${i.condition}".`, query: i.name });
      }
    });
    return list;
  }, [itemsWithStatus, settings.alerts]);

  const unreadCount = alerts.filter((a) => !readAlerts.includes(a.id)).length;
  const markAlertRead = (id) => setReadAlerts((r) => (r.includes(id) ? r : [...r, id]));
  const markAllRead = () => setReadAlerts((r) => [...new Set([...r, ...alerts.map((a) => a.id)])]);

  const value = {
    items,
    itemsWithStatus,
    categories,
    users,
    activity,
    settings,
    toast,
    alerts,
    unreadCount,
    readAlerts,
    categoryName,
    itemCount,
    isLastAdmin,
    showToast,
    addItem,
    updateItem,
    deleteItem,
    addCategory,
    updateCategory,
    deleteCategory,
    addUser,
    updateUser,
    deleteUser,
    updateSettings,
    markAlertRead,
    markAllRead,
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
} 
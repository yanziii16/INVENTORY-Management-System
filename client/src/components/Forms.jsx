import { useState } from 'react';
import { Modal, TextInput, SelectInput, TextArea, DetailList, Pill } from './Shared';
import { useInventory, UNITS, CONDITIONS, ROLES, STOCK_TONE, stockStatus, peso, formatDateTime } from '../context/InventoryContext';

const isInt = (v) => /^\d+$/.test(String(v).trim());
const same = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

const FormActions = ({ onClose, label }) => (
  <div className="modal__actions">
    <button type="button" className="btn btn--outline btn--lg" onClick={onClose}>Cancel</button>
    <button type="submit" className="btn btn--primary btn--lg">{label}</button>
  </div>
);

const suggestSku = (prefix, items) => {
  const nums = items.filter((i) => i.sku.startsWith(`${prefix}-`)).map((i) => parseInt(i.sku.slice(prefix.length + 1), 10) || 0);
  return `${prefix}-${String(Math.max(0, ...nums) + 1).padStart(3, '0')}`;
};

/* ======================= ITEMS ======================= */
export function ItemFormModal({ item, onClose }) {
  const { items, categories, settings, addItem, updateItem, showToast } = useInventory();
  const editing = Boolean(item);
  const [form, setForm] = useState(() =>
    item
      ? { ...item, qty: String(item.qty), reorderLevel: String(item.reorderLevel), unitPrice: String(item.unitPrice) }
      : { name: '', categoryId: '', sku: '', qty: '', unit: 'pcs', reorderLevel: String(settings.threshold), unitPrice: '', condition: 'Good', location: '', description: '' }
  );
  const [errors, setErrors] = useState({});
  const [skuTouched, setSkuTouched] = useState(editing);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const pickCategory = (e) => {
    const categoryId = e.target.value;
    const cat = categories.find((c) => c.id === categoryId);
    setForm((f) => ({ ...f, categoryId, sku: !skuTouched && cat ? suggestSku(cat.skuPrefix, items) : f.sku }));
  };

  const validate = () => {
    const e = {};
    const others = items.filter((i) => i.id !== item?.id);
    const name = form.name.trim();
    if (!name) e.name = 'Item name is required.';
    else if (name.length < 2 || name.length > 60) e.name = 'Use 2 to 60 characters.';
    else if (others.some((i) => same(i.name, name))) e.name = 'An item with this name already exists.';
    if (!form.categoryId) e.categoryId = 'Select a category.';
    const sku = form.sku.trim().toUpperCase();
    if (!sku) e.sku = 'SKU is required.';
    else if (!/^[A-Z0-9]+(?:-[A-Z0-9]+)+$/.test(sku)) e.sku = 'Use letters, numbers and dashes, e.g. CLN-004.';
    else if (others.some((i) => i.sku === sku)) e.sku = 'This SKU is already used.';
    if (!isInt(form.qty)) e.qty = 'Enter a whole number (0 or more).';
    else if (Number(form.qty) > 100000) e.qty = 'Maximum is 100,000.';
    if (!isInt(form.reorderLevel)) e.reorderLevel = 'Enter a whole number (0 or more).';
    const price = Number(form.unitPrice);
    if (form.unitPrice.trim() === '' || !Number.isFinite(price) || price < 0) e.unitPrice = 'Enter a price of 0 or more.';
    else if (price > 10000000) e.unitPrice = 'Price is too high.';
    if (form.description.length > 200) e.description = 'Maximum 200 characters.';
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;
    const data = {
      name: form.name.trim(), categoryId: form.categoryId, sku: form.sku.trim().toUpperCase(),
      qty: Number(form.qty), unit: form.unit, reorderLevel: Number(form.reorderLevel), unitPrice: Number(form.unitPrice),
      condition: form.condition, location: form.location.trim(), description: form.description.trim(),
    };
    if (editing) updateItem(item.id, data); else addItem(data);
    showToast(editing ? `${data.name} updated.` : `${data.name} added to inventory.`);
    onClose();
  };

  const categoryOptions = [{ value: '', label: 'Select a category' }, ...categories.filter((c) => c.status === 'Active' || c.id === item?.categoryId).map((c) => ({ value: c.id, label: c.name }))];

  return (
    <Modal title={editing ? 'Edit Item' : 'Add New Item'} size="lg" onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <div className="form-grid">
          <TextInput className="field--full" label="Item name *" placeholder="e.g. Mop and Bucket Set" maxLength={60} value={form.name} onChange={set('name')} error={errors.name} autoFocus />
          <SelectInput label="Category *" options={categoryOptions} value={form.categoryId} onChange={pickCategory} error={errors.categoryId} />
          <TextInput label="SKU *" placeholder="CLN-004" hint="Auto-filled from the category. You can edit it." value={form.sku} onChange={(e) => { setSkuTouched(true); setForm({ ...form, sku: e.target.value.toUpperCase() }); }} error={errors.sku} />
          <TextInput label="Quantity *" type="number" min="0" inputMode="numeric" value={form.qty} onChange={set('qty')} error={errors.qty} />
          <SelectInput label="Unit" options={UNITS} value={form.unit} onChange={set('unit')} />
          <TextInput label="Reorder level *" type="number" min="0" inputMode="numeric" hint="Marked Low Stock at or below this." value={form.reorderLevel} onChange={set('reorderLevel')} error={errors.reorderLevel} />
          <TextInput label="Unit price (₱) *" type="number" min="0" step="0.01" inputMode="decimal" value={form.unitPrice} onChange={set('unitPrice')} error={errors.unitPrice} />
          <SelectInput label="Condition" options={CONDITIONS} value={form.condition} onChange={set('condition')} />
          <TextInput label="Storage location" placeholder="e.g. Storage Room A" maxLength={40} value={form.location} onChange={set('location')} />
          <TextArea className="field--full" label="Description" maxLength={200} value={form.description} onChange={set('description')} error={errors.description} />
        </div>
        <FormActions onClose={onClose} label={editing ? 'Save changes' : 'Add item'} />
      </form>
    </Modal>
  );
}

export function ItemDetailModal({ item, onEdit, onClose }) {
  const { categoryName } = useInventory();
  const status = stockStatus(item);
  return (
    <Modal title="Item Details" onClose={onClose}>
      <DetailList rows={[
        ['Item name', item.name], ['Category', categoryName(item.categoryId)], ['SKU', item.sku],
        ['Quantity', `${item.qty} ${item.unit}`], ['Stock status', <Pill tone={STOCK_TONE[status]}>{status}</Pill>],
        ['Reorder level', `${item.reorderLevel} ${item.unit}`], ['Unit price', peso(item.unitPrice)],
        ['Stock value', peso(item.qty * item.unitPrice)], ['Condition', item.condition],
        ['Location', item.location], ['Description', item.description], ['Added', formatDateTime(item.createdAt)],
      ]} />
      <div className="modal__actions">
        <button className="btn btn--outline btn--lg" onClick={onClose}>Close</button>
        <button className="btn btn--primary btn--lg" onClick={onEdit}>Edit</button>
      </div>
    </Modal>
  );
}

/* ======================= CATEGORIES ======================= */
export function CategoryFormModal({ category, onClose }) {
  const { categories, addCategory, updateCategory, showToast } = useInventory();
  const editing = Boolean(category);
  const [form, setForm] = useState(category ?? { name: '', skuPrefix: '', description: '', status: 'Active' });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (ev) => {
    ev.preventDefault();
    const e = {};
    const others = categories.filter((c) => c.id !== category?.id);
    const name = form.name.trim();
    const prefix = form.skuPrefix.trim().toUpperCase();
    if (!name) e.name = 'Category name is required.';
    else if (name.length < 2 || name.length > 40) e.name = 'Use 2 to 40 characters.';
    else if (others.some((c) => same(c.name, name))) e.name = 'This category already exists.';
    if (!/^[A-Z0-9]{2,5}$/.test(prefix)) e.skuPrefix = 'Use 2 to 5 letters or numbers.';
    else if (others.some((c) => c.skuPrefix === prefix)) e.skuPrefix = 'This prefix is already used.';
    if (form.description.length > 160) e.description = 'Maximum 160 characters.';
    setErrors(e);
    if (Object.keys(e).length) return;
    const data = { name, skuPrefix: prefix, description: form.description.trim(), status: form.status };
    if (editing) updateCategory(category.id, data); else addCategory(data);
    showToast(editing ? `${name} updated.` : `${name} category added.`);
    onClose();
  };

  return (
    <Modal title={editing ? 'Edit Category' : 'Add New Category'} onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <TextInput label="Category name *" placeholder="e.g. Science Laboratory" maxLength={40} value={form.name} onChange={set('name')} error={errors.name} autoFocus />
        <TextInput label="SKU prefix *" placeholder="e.g. SCI" maxLength={5} hint="Used to auto-generate SKUs, like SCI-001." value={form.skuPrefix} onChange={(e) => setForm({ ...form, skuPrefix: e.target.value.toUpperCase() })} error={errors.skuPrefix} />
        <TextArea label="Description" maxLength={160} value={form.description} onChange={set('description')} error={errors.description} />
        <SelectInput label="Status" options={['Active', 'Inactive']} value={form.status} onChange={set('status')} />
        <FormActions onClose={onClose} label={editing ? 'Save changes' : 'Add category'} />
      </form>
    </Modal>
  );
}

export function CategoryDetailModal({ category, onEdit, onClose }) {
  const { items } = useInventory();
  const tagged = items.filter((i) => i.categoryId === category.id);
  return (
    <Modal title="Category Details" onClose={onClose}>
      <DetailList rows={[
        ['Category ID', category.id], ['Name', category.name], ['SKU prefix', category.skuPrefix], ['Description', category.description],
        ['Status', <Pill dot tone={category.status === 'Active' ? 'green' : 'red'}>{category.status}</Pill>],
        ['Items tagged', tagged.length ? tagged.map((i) => i.name).join(', ') : 'None yet'],
      ]} />
      <div className="modal__actions">
        <button className="btn btn--outline btn--lg" onClick={onClose}>Close</button>
        <button className="btn btn--primary btn--lg" onClick={onEdit}>Edit</button>
      </div>
    </Modal>
  );
}

/* ======================= USERS ======================= */
export function UserFormModal({ user, onClose }) {
  const { users, addUser, updateUser, isLastAdmin, showToast } = useInventory();
  const editing = Boolean(user);
  const [form, setForm] = useState(user ?? { name: '', email: '', role: 'Staff', status: 'Active' });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (ev) => {
    ev.preventDefault();
    const e = {};
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    if (!name) e.name = 'Name is required.';
    else if (name.length < 2 || name.length > 50) e.name = 'Use 2 to 50 characters.';
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email address.';
    else if (users.some((u) => u.id !== user?.id && u.email.toLowerCase() === email)) e.email = 'This email is already registered.';
    if (editing && isLastAdmin(user) && (form.role !== 'Admin' || form.status !== 'Active')) e.role = 'At least one active Admin is required.';
    setErrors(e);
    if (Object.keys(e).length) return;
    const data = { name, email, role: form.role, status: form.status };
    // Credentials/invitations are handled by your backend, not stored here.
    if (editing) updateUser(user.id, data); else addUser(data);
    showToast(editing ? `${name} updated.` : `${name} added.`);
    onClose();
  };

  return (
    <Modal title={editing ? 'Edit User' : 'Add New User'} onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <TextInput label="Full name *" placeholder="e.g. Maria Clara" maxLength={50} value={form.name} onChange={set('name')} error={errors.name} autoFocus />
        <TextInput label="Email address *" type="email" placeholder="name@idsc.edu.ph" value={form.email} onChange={set('email')} error={errors.email} />
        <div className="form-grid">
          <SelectInput label="Role" options={ROLES} value={form.role} onChange={set('role')} error={errors.role} />
          <SelectInput label="Status" options={['Active', 'Inactive']} value={form.status} onChange={set('status')} />
        </div>
        <FormActions onClose={onClose} label={editing ? 'Save changes' : 'Add user'} />
      </form>
    </Modal>
  );
}

export function UserDetailModal({ user, onEdit, onClose }) {
  return (
    <Modal title="User Details" onClose={onClose}>
      <DetailList rows={[
        ['User ID', user.id], ['Name', user.name], ['Email', user.email], ['Role', <Pill>{user.role}</Pill>],
        ['Status', <Pill dot tone={user.status === 'Active' ? 'green' : 'red'}>{user.status}</Pill>],
      ]} />
      <div className="modal__actions">
        <button className="btn btn--outline btn--lg" onClick={onClose}>Close</button>
        <button className="btn btn--primary btn--lg" onClick={onEdit}>Edit</button>
      </div>
    </Modal>
  );
}

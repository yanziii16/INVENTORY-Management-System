import { useMemo, useState } from 'react';
import { LayoutGrid, CheckCircle2, ArrowUpDown } from 'lucide-react';
import { PageHeader, Pill, RowActions, DataTable, SearchField, SelectField, ConfirmDialog, useUrlSearch } from '../components/Shared';
import { ItemFormModal, ItemDetailModal } from '../components/Forms';
import { useInventory, STOCK_TONE } from '../context/InventoryContext';

export default function Products() {
  const { itemsWithStatus: items, categories, categoryName, deleteItem, showToast } = useInventory();
  const [q, setQ] = useUrlSearch();
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('');
  const [modal, setModal] = useState(null); // { type: 'add' | 'edit' | 'view' | 'delete', item }
  const close = () => setModal(null);

  const categoryOptions = [{ value: 'all', label: 'All Categories' }, ...categories.map((c) => ({ value: c.id, label: c.name }))];

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = items
      .filter((i) => [i.name, i.sku, categoryName(i.categoryId)].some((v) => v.toLowerCase().includes(term)))
      .filter((i) => category === 'all' || i.categoryId === category)
      .filter((i) => status === 'all' || i.status === status);
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'qty') list.sort((a, b) => b.qty - a.qty);
    if (sort === 'recent') list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, categories, q, category, status, sort]);

  const startAdd = () => {
    if (!categories.some((c) => c.status === 'Active')) return showToast('Add an active category first.');
    setModal({ type: 'add' });
  };

  return (
    <div>
      <PageHeader title="Products/ Items" subtitle="Management and track all inventory items" actionLabel="Add New Item" onAction={startAdd} />
      <div className="filters">
        <SearchField placeholder="Search items name category, or SKU..." value={q} onChange={setQ} />
        <SelectField icon={LayoutGrid} label="Category" value={category} onChange={setCategory} options={categoryOptions} />
        <SelectField icon={CheckCircle2} label="Status" value={status} onChange={setStatus} options={[{ value: 'all', label: 'All Status' }, ...Object.keys(STOCK_TONE).map((s) => ({ value: s, label: s }))]} />
        <SelectField icon={ArrowUpDown} label="Sort" value={sort} onChange={setSort} options={[{ value: '', label: 'Sort by' }, { value: 'name', label: 'Name (A–Z)' }, { value: 'qty', label: 'Quantity (high to low)' }, { value: 'recent', label: 'Recently added' }]} />
      </div>
      <DataTable
        columns={['Item Name', 'Categories', 'SKU', 'Quantity', { label: 'Status', align: 'center' }, { label: 'Actions', align: 'center' }]}
        empty="No items match your filters."
        rows={rows.map((i) => [
          <span className="cell-strong">{i.name}</span>,
          <span className="cell-strong">{categoryName(i.categoryId)}</span>,
          <span className="cell-strong">{i.sku}</span>,
          <span className="cell-strong">{i.qty} {i.unit}</span>,
          <Pill tone={STOCK_TONE[i.status]}>{i.status}</Pill>,
          <RowActions onView={() => setModal({ type: 'view', item: i })} onEdit={() => setModal({ type: 'edit', item: i })} onDelete={() => setModal({ type: 'delete', item: i })} />,
        ])}
      />

      {modal?.type === 'add' && <ItemFormModal onClose={close} />}
      {modal?.type === 'edit' && <ItemFormModal item={modal.item} onClose={close} />}
      {modal?.type === 'view' && <ItemDetailModal item={modal.item} onClose={close} onEdit={() => setModal({ type: 'edit', item: modal.item })} />}
      {modal?.type === 'delete' && (
        <ConfirmDialog title="Delete item?" message={`"${modal.item.name}" will be removed from your inventory. This cannot be undone.`}
          onCancel={close} onConfirm={() => { deleteItem(modal.item.id); showToast(`${modal.item.name} deleted.`); close(); }} />
      )}
    </div>
  );
}

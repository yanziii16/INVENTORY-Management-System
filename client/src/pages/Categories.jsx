import { useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PageHeader, Pill, RowActions, DataTable, SearchField, SelectField, ConfirmDialog, useUrlSearch } from '../components/Shared';
import { CategoryFormModal, CategoryDetailModal } from '../components/Forms';
import { useInventory } from '../context/InventoryContext';

export default function Categories() {
  const { categories, itemCount, deleteCategory, showToast } = useInventory();
  const [q, setQ] = useUrlSearch();
  const [status, setStatus] = useState('all');
  const [modal, setModal] = useState(null);
  const close = () => setModal(null);

  const rows = useMemo(
    () => categories
      .filter((c) => `${c.name} ${c.id}`.toLowerCase().includes(q.trim().toLowerCase()))
      .filter((c) => status === 'all' || c.status === status),
    [categories, q, status]
  );

  return (
    <div>
      <PageHeader title="Category Management" subtitle="Track all stock-in, stock-out, and inventory adjustments" actionLabel="Add New Category" onAction={() => setModal({ type: 'add' })} />
      <div className="filters">
        <SearchField placeholder="Search category name..." value={q} onChange={setQ} />
        <SelectField icon={CheckCircle2} label="Status" value={status} onChange={setStatus} options={[{ value: 'all', label: 'All Status' }, { value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]} />
        <span style={{ flex: 1.2 }} />
      </div>
      <DataTable
        columns={['Category ID', 'Category Name', 'Description', { label: 'Total Item Tagged', align: 'center' }, { label: 'Status', align: 'center' }, { label: 'Actions', align: 'center' }]}
        empty="No categories match your filters."
        rows={rows.map((c) => {
          const n = itemCount(c.id);
          return [
            c.id,
            <span className="cell-strong">{c.name}</span>,
            <span className="cell-small">{c.description}</span>,
            <Pill large>{n} {n === 1 ? 'Item' : 'Items'}</Pill>,
            <Pill dot tone={c.status === 'Active' ? 'green' : 'red'}>{c.status}</Pill>,
            <RowActions onView={() => setModal({ type: 'view', category: c })} onEdit={() => setModal({ type: 'edit', category: c })} onDelete={() => setModal({ type: 'delete', category: c })} />,
          ];
        })}
      />

      {modal?.type === 'add' && <CategoryFormModal onClose={close} />}
      {modal?.type === 'edit' && <CategoryFormModal category={modal.category} onClose={close} />}
      {modal?.type === 'view' && <CategoryDetailModal category={modal.category} onClose={close} onEdit={() => setModal({ type: 'edit', category: modal.category })} />}
      {modal?.type === 'delete' && (itemCount(modal.category.id) > 0 ? (
        <ConfirmDialog blocked title="Can't delete category" onCancel={close}
          message={`"${modal.category.name}" still has ${itemCount(modal.category.id)} item(s) tagged to it. Move or delete those items first.`} />
      ) : (
        <ConfirmDialog title="Delete category?" message={`"${modal.category.name}" will be removed. This cannot be undone.`} onCancel={close}
          onConfirm={() => { deleteCategory(modal.category.id); showToast(`${modal.category.name} deleted.`); close(); }} />
      ))}
    </div>
  );
}

import { useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PageHeader, Pill, RowActions, DataTable, SearchField, SelectField, ConfirmDialog, useUrlSearch } from '../components/Shared';
import { UserFormModal, UserDetailModal } from '../components/Forms';
import { useInventory } from '../context/InventoryContext';

export default function Users() {
  const { users, deleteUser, isLastAdmin, showToast } = useInventory();
  const [q, setQ] = useUrlSearch();
  const [status, setStatus] = useState('all');
  const [modal, setModal] = useState(null);
  const close = () => setModal(null);

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return users
      .filter((u) => [u.id, u.name, u.email, u.role].some((v) => v.toLowerCase().includes(t)))
      .filter((u) => status === 'all' || u.status === status);
  }, [users, q, status]);

  return (
    <div>
      <PageHeader title="User Management" subtitle="Manage system users, roles, and account access" actionLabel="Add New User" onAction={() => setModal({ type: 'add' })} />
      <div className="filters">
        <SearchField placeholder="Search user ID, name, or role..." value={q} onChange={setQ} />
        <SelectField icon={CheckCircle2} label="Status" value={status} onChange={setStatus} options={[{ value: 'all', label: 'All Status' }, { value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]} />
        <span style={{ flex: 1.2 }} />
      </div>
      <DataTable
        columns={['User ID', 'Name', 'Email Address', { label: 'Role', align: 'center' }, { label: 'Status', align: 'center' }, { label: 'Actions', align: 'center' }]}
        empty="No users match your filters."
        rows={rows.map((u) => [
          u.id,
          <span className="cell-strong">{u.name}</span>,
          u.email,
          <Pill large>{u.role}</Pill>,
          <Pill dot tone={u.status === 'Active' ? 'green' : 'red'}>{u.status}</Pill>,
          <RowActions onView={() => setModal({ type: 'view', user: u })} onEdit={() => setModal({ type: 'edit', user: u })} onDelete={() => setModal({ type: 'delete', user: u })} />,
        ])}
      />

      {modal?.type === 'add' && <UserFormModal onClose={close} />}
      {modal?.type === 'edit' && <UserFormModal user={modal.user} onClose={close} />}
      {modal?.type === 'view' && <UserDetailModal user={modal.user} onClose={close} onEdit={() => setModal({ type: 'edit', user: modal.user })} />}
      {modal?.type === 'delete' && (isLastAdmin(modal.user) ? (
        <ConfirmDialog blocked title="Can't delete user" onCancel={close} message={`${modal.user.name} is the only active Admin. Promote another user to Admin first.`} />
      ) : (
        <ConfirmDialog title="Delete user?" message={`${modal.user.name} will lose access to the system. This cannot be undone.`} onCancel={close}
          onConfirm={() => { deleteUser(modal.user.id); showToast(`${modal.user.name} deleted.`); close(); }} />
      ))}
    </div>
  );
}

import { Package, BarChart3, AlertTriangle, LayoutGrid, Users, FileText } from 'lucide-react';
import { Pill, DataTable, StatCard } from '../components/Shared';
import { useInventory, formatDateTime } from '../context/InventoryContext';

const TONE = { 'For Repair': 'amber', Restocked: 'green', Issued: 'blue', Damaged: 'red', 'Under Maintenance': 'amber', Returned: 'green' };

export default function Dashboard() {
  const { itemsWithStatus, categories, users, activity } = useInventory();
  const METRICS = [
    { label: 'Total Items', value: itemsWithStatus.length, icon: Package },
    { label: 'Total Stock', value: itemsWithStatus.reduce((n, i) => n + i.qty, 0).toLocaleString(), icon: BarChart3 },
    { label: 'Low Stock Items', value: itemsWithStatus.filter((i) => i.status !== 'In Stock').length, icon: AlertTriangle, warn: true },
    { label: 'Total Categories', value: categories.length, icon: LayoutGrid },
    { label: 'Total User', value: users.length, icon: Users },
    { label: 'Total Reports', value: 0, icon: FileText },
  ];
  return (
    <div className="stack">
      {/* Set a campus photo: .banner { --banner-image: url('/campus.jpg'); } */}
      <section className="banner">
        <p className="banner__hello">Welcome,</p>
        <p className="banner__name">Admin!</p>
        <p className="banner__sub">Here's some update to your Inventory.</p>
      </section>

      <div>
        <div className="page-head" style={{ marginBottom: 12 }}>
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-sub">Overview of activities and records</p>
          </div>
        </div>
        <div className="stat-grid">
          {METRICS.map((m) => <StatCard key={m.label} {...m} />)}
        </div>
      </div>

      <section className="card" style={{ padding: '18px 18px 16px' }}>
        <div className="section-head">
          <span className="section-head__icon"><BarChart3 size={18} /></span>
          <div>
            <h2 className="section-head__title">Recent Stock Activity</h2>
            <p className="section-head__sub">Latest updates on your inventory items</p>
          </div>
        </div>
        <div style={{ margin: '0 -2px' }}>
          <DataTable
            columns={['Date & Time', 'Item Name', { label: 'Quantity', align: 'center' }, { label: 'Status', align: 'center' }]}
            empty="No stock activity yet."
            rows={[...activity].sort((x, y) => y.at.localeCompare(x.at)).slice(0, 8).map((a) => [
              formatDateTime(a.at), a.itemName, a.qty > 0 ? `+${a.qty}` : a.qty < 0 ? a.qty : '—', <Pill tone={TONE[a.status]}>{a.status}</Pill>,
            ])}
          />
        </div>
      </section>
    </div>
  );
}

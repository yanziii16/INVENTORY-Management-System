import { useState } from 'react';
import { Package, AlertTriangle, Wrench, Banknote } from 'lucide-react';
import { StatCard, DataTable, Dropdown } from '../components/Shared';
import { useInventory, peso } from '../context/InventoryContext';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const RECEIVED = [34, 46, 40, 58, 48, 62, 54, 70, 59, 64, 56, 74];
const ISSUED = [22, 28, 21, 36, 28, 39, 33, 44, 35, 42, 38, 49];
const SHADES = ['#1f6f4a', '#5fa07f', '#7db396', '#9cc7b0', '#b9dac8', '#cfe6d8'];
const STATUS_COLOR = { 'In Stock': ['#1b7a47', 'green'], 'Low Stock': ['#c17a0a', 'amber'], 'Out of Stock': ['#8a948e', 'gray'] };

function MovementChart() {
  const W = 600, H = 210, L = 30, R = 10, T = 10, B = 28, MAX = 80;
  const x = (i) => L + (i * (W - L - R)) / (MONTHS.length - 1);
  const y = (v) => T + (1 - v / MAX) * (H - T - B);
  const line = (a) => a.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ');
  const area = (a) => `${line(a)} L${x(a.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Monthly stock received and issued, 2026">
      {[0, 20, 40, 60, 80].map((t) => (
        <g key={t}>
          <line className="chart__grid" x1={L} x2={W - R} y1={y(t)} y2={y(t)} />
          <text className="chart__axis" x={L - 8} y={y(t) + 3} textAnchor="end">{t}</text>
        </g>
      ))}
      {MONTHS.map((m, i) => <text key={m} className="chart__axis" x={x(i)} y={H - 8} textAnchor="middle">{m}</text>)}
      <path className="chart__area--out" d={area(ISSUED)} />
      <path className="chart__area--in" d={area(RECEIVED)} />
      <path className="chart__line chart__line--out" d={line(ISSUED)} />
      <path className="chart__line chart__line--in" d={line(RECEIVED)} />
      {RECEIVED.map((v, i) => <circle key={i} className="chart__dot" cx={x(i)} cy={y(v)} r="2.5" />)}
    </svg>
  );
}

export default function Reports() {
  const { itemsWithStatus: items, categories } = useInventory();
  const [year, setYear] = useState('2026');
  const METRICS = [
    { label: 'Total Items', value: items.length, icon: Package },
    { label: 'Low Stock Items', value: items.filter((i) => i.status !== 'In Stock').length, icon: AlertTriangle, warn: true },
    { label: 'Items for Repair', value: items.filter((i) => i.condition === 'For Repair').length, icon: Wrench },
    { label: 'Total Stock Value', value: peso(items.reduce((n, i) => n + i.qty * i.unitPrice, 0)), icon: Banknote },
  ];
  const CATEGORIES = categories
    .map((c) => [c.name, items.filter((i) => i.categoryId === c.id).reduce((n, i) => n + i.qty, 0)])
    .sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([name, n], i) => [name, n, SHADES[i]]);
  const maxCat = Math.max(1, ...CATEGORIES.map((c) => c[1]));
  const STATUS = Object.entries(STATUS_COLOR).map(([label, [color, tone]]) => [label, items.filter((i) => i.status === label).length, color, tone]);
  const totalUnits = items.reduce((n, i) => n + i.qty, 0);
  const total = items.length;
  return (
    <div className="stack" style={{ gap: 14 }}>
      <h1 className="page-title">Reports &amp; Analytics</h1>

      <div className="stat-grid stat-grid--4">
        {METRICS.map((m) => <StatCard key={m.label} row {...m} />)}
      </div>

      <div className="report-grid">
        <section className="panel">
          <div className="panel__head">
            <div><h2 className="panel__title">Monthly Stock Movement</h2><p className="panel__sub">Stock received and issued throughout {year}</p></div>
            <Dropdown variant="mini" ariaLabel="Year" value={year} onChange={setYear} options={['2026', '2025']} />
          </div>
          <MovementChart />
          <div className="legend">
            <span className="legend__item" style={{ '--c': '#1f6f4a' }}>Stock received</span>
            <span className="legend__item" style={{ '--c': '#8fc3a6' }}>Stock issued</span>
          </div>
        </section>

        <section className="panel">
          <div className="panel__head">
            <div><h2 className="panel__title">Items by Category</h2><p className="panel__sub">Units in stock per category</p></div>
            <span className="pill pill--green">{totalUnits.toLocaleString()} units</span>
          </div>
          <div className="bars">
            {CATEGORIES.map(([name, n, color]) => (
              <div key={name}>
                <div className="bar__top"><span>{name}</span><span>{n}</span></div>
                <div className="bar__track"><div className="bar__fill" style={{ '--c': color, width: `${(n / maxCat) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="status-row">
          <div className="status-row__label">
            <h2 className="panel__title">Stock Status Overview</h2>
            <p className="panel__sub">Availability at a glance across {total} items.</p>
          </div>
          <div className="status-row__main">
            <div className="status-pills">
              {STATUS.map(([label, n, , tone]) => <span key={label} className={`pill pill--dot pill--${tone}`}>{label} ({n})</span>)}
            </div>
            <div className="status-bar">
              {STATUS.map(([label, n, color]) => <span key={label} className="status-bar__seg" style={{ '--c': color, flex: n || 0.0001 }} title={`${label}: ${n}`} />)}
            </div>
          </div>
        </div>
      </section>

      <DataTable columns={['Report Name', 'Generated Date', 'Status']} rows={[]} empty="No reports generated yet." />
    </div>
  );
}
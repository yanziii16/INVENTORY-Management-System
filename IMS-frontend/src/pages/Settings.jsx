import { useState } from 'react';
import { Info, Lock } from 'lucide-react';
import { TextInput, SelectInput, Toggle, Pill } from '../components/Shared';
import { useInventory } from '../context/InventoryContext';

export default function Settings() {
  const { settings, updateSettings, showToast } = useInventory();
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwError, setPwError] = useState('');

  const field = (key) => ({ value: settings[key], onChange: (e) => updateSettings({ [key]: e.target.value }) });
  const flip = (k) => () => updateSettings({ alerts: { ...settings.alerts, [k]: !settings.alerts[k] } });

  const updatePassword = (e) => {
    e.preventDefault();
    if (!pw.current) return setPwError('Enter your current password.');
    if (pw.next.length < 8 || !/\d/.test(pw.next) || !/[^A-Za-z0-9]/.test(pw.next)) return setPwError('Use at least 8 characters, including a number and a symbol.');
    if (pw.next !== pw.confirm) return setPwError('Passwords do not match.');
    setPwError('');
    setPw({ current: '', next: '', confirm: '' });
    showToast('Password updated.'); // TODO: call your change-password API
  };

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: 4 }}>Settings</h1>
      <p className="page-sub" style={{ marginBottom: 14 }}>Changes are saved automatically.</p>
      <div className="settings-grid">
        <div className="settings-col">
          <section className="panel">
            <h2 className="panel__title">System Information</h2>
            <p className="panel__sub" style={{ marginBottom: 12 }}>Your inventory system's official contact and warehouse details.</p>
            <TextInput label="System Name" {...field('systemName')} />
            <TextInput label="Admin Email" type="email" {...field('email')} />
            <TextInput label="Contact Number" {...field('contact')} />
            <TextInput label="Warehouse Address" {...field('address')} />
          </section>

          <section className="panel">
            <h2 className="panel__title">Inventory Policy</h2>
            <p className="panel__sub" style={{ marginBottom: 12 }}>Set stock thresholds and inventory handling rules.</p>
            <div className="form-grid">
              <TextInput label="Default Reorder Level (units)" type="number" min="0" {...field('threshold')} />
              <SelectInput label="Default Currency" options={['PHP (₱)', 'USD ($)']} {...field('currency')} />
              <TextInput label="Auto-Archive Inactive Items (days)" type="number" min="1" {...field('archive')} />
              <SelectInput label="Stock Adjustment Approval" options={['Always Required', 'Admin Only', 'Not Required']} {...field('approval')} />
            </div>
            <p className="note"><Info size={14} style={{ flexShrink: 0 }} /> The reorder level pre-fills when adding new items. Existing items keep their own level.</p>
          </section>
        </div>

        <div className="settings-col">
          <section className="panel">
            <h2 className="panel__title">Stock Notifications</h2>
            <p className="panel__sub" style={{ marginBottom: 6 }}>Choose which alerts appear under the bell icon.</p>
            <Toggle label="Low Stock Alerts" desc="Send alerts when stock reaches the reorder level." checked={settings.alerts.low} onChange={flip('low')} />
            <Toggle label="Out of Stock Alerts" desc="Send alerts when stock reaches zero." checked={settings.alerts.out} onChange={flip('out')} />
            <Toggle label="Monthly Audit Reminders" desc="Send reminders to review stock counts and reconcile inventory." checked={settings.alerts.audit} onChange={flip('audit')} />
          </section>

          <section className="panel">
            <h2 className="panel__title">Account &amp; Security</h2>
            <p className="panel__sub" style={{ marginBottom: 12 }}>Manage your administrator profile and password.</p>
            <div className="account">
              <span className="account__avatar">AU</span>
              <div><p className="account__name">Admin User</p><p className="account__email">{settings.email}</p></div>
              <Pill>Administrator</Pill>
            </div>
            <form onSubmit={updatePassword}>
              <p className="field__label" style={{ marginBottom: 8, fontSize: 12 }}>Change Password</p>
              <TextInput label="Current Password" type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
              <div className="form-grid">
                <TextInput label="New Password" type="password" placeholder="Enter new password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
                <TextInput label="Confirm New Password" type="password" placeholder="Re-enter password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
              </div>
              <p className={pwError ? 'field__error' : 'field__hint'}>{pwError || 'Use at least 8 characters, including a number and a symbol.'}</p>
              <div className="security-foot">
                <span><Lock size={11} /> Keep your account secure</span>
                <button type="submit" className="btn btn--outline">Update password</button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

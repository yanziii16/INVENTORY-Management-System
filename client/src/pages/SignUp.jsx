import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { AuthShell, TextInput } from '../components/Shared';
import { useInventory } from '../context/InventoryContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const validate = (f) => {
  const e = {};
  if (!f.username.trim()) e.username = 'Enter a username.';
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email address.';
  if (f.password.length < 8) e.password = 'Use at least 8 characters.';
  if (f.confirm !== f.password) e.confirm = 'Passwords do not match.';
  if (!f.agree) e.agree = 'Accept the Terms & Privacy Policy to continue.';
  return e;
};

export default function SignUp() {
  const navigate = useNavigate();
  const { refreshUsers, showToast } = useInventory();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '', agree: false });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username.trim(),
          name: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ email: data.message || 'Could not register account.' });
        return;
      }
      await refreshUsers();
      showToast('Account created! Please log in.');
      navigate('/login');
    } catch {
      setErrors({ email: 'Unable to reach backend server.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell title="Create an Account" footerText="Already have an account?" footerLink="/login" footerLabel="Log in">
      <form onSubmit={submit} noValidate>
        <TextInput label="Username" icon={User} placeholder="Enter your username" value={form.username} onChange={set('username')} error={errors.username} />
        <TextInput label="Email Address" icon={Mail} type="email" placeholder="Enter your email address" value={form.email} onChange={set('email')} error={errors.email} />
        <TextInput label="Password" icon={Lock} type="password" placeholder="Enter your password" hint="8+ Characters" value={form.password} onChange={set('password')} error={errors.password} />
        <TextInput label="Confirm Password" icon={Lock} type="password" placeholder="Confirm your password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} />
        <label className="check" style={{ marginBottom: errors.agree ? 4 : 18 }}>
          <input type="checkbox" checked={form.agree} onChange={set('agree')} /> I agree to the <a href="#terms" className="link link--underline">Terms &amp; Privacy Policy</a>
        </label>
        {errors.agree && <p className="field__error" style={{ marginBottom: 14 }}>{errors.agree}</p>}
        <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
          {submitting ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
    </AuthShell>
  );
}
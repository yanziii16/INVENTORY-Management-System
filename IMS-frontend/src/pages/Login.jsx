import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { AuthShell, TextInput } from '../components/Shared';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', remember: true });

  const submit = (e) => {
    e.preventDefault();
    navigate('/'); // TODO: replace with real authentication
  };

  return (
    <AuthShell title="Login to your Account" footerText="Don't have an account?" footerLink="/signup" footerLabel="Sign Up">
      <form onSubmit={submit}>
        <TextInput label="Email Address" icon={Mail} placeholder="Enter email or username" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <TextInput label="Password" icon={Lock} type="password" placeholder="Enter your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <div className="auth-row">
          <label className="check">
            <input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} /> Remember me
          </label>
          <Link to="/login" className="link">Forgot Password?</Link>
        </div>
        <button type="submit" className="btn btn--primary btn--block">Login</button>
      </form>
    </AuthShell>
  );
}

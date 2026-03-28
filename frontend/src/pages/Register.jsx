import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth';
import Spinner from '../components/Spinner';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '', display_name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.register(form.username, form.password, form.display_name);
      login(data);
      navigate(`/user/${data.user.username}`);
    } catch (err) {
      setError(err.message.includes('taken') ? 'Username already taken' : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8">
        <div className="kicker">Get started</div>
        <h1 className="h2 mt-1">Create your account</h1>
      </div>

      <div className="card p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">Display name</label>
            <input
              type="text"
              required
              placeholder="John Doe"
              value={form.display_name}
              onChange={(e) => setForm({ ...form, display_name: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">Username</label>
            <input
              type="text"
              required
              placeholder="john-doe"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="input"
            />
            <p className="mt-1 text-xs text-ink-500">Used in your timeline URL. Lowercase letters, numbers, hyphens.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">Password</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full py-4 disabled:opacity-60">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner /> Creating account…
              </span>
            ) : (
              'Create account'
            )}
          </button>
        </form>
      </div>

      <p className="mt-4 text-center text-sm text-ink-600">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary-800 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

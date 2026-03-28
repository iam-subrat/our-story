import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth';
import Spinner from '../components/Spinner';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login(form.username, form.password);
      login(data);
      navigate(`/user/${data.user.username}`);
    } catch (err) {
      if (err.message === 'account_unclaimed') {
        navigate(`/claim?username=${encodeURIComponent(form.username)}`);
      } else {
        setError('Invalid username or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8">
        <div className="kicker">Welcome back</div>
        <h1 className="h2 mt-1">Log in to your account</h1>
      </div>

      <div className="card p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">Username</label>
            <input
              type="text"
              required
              autoComplete="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full py-4 disabled:opacity-60">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner /> Logging in…
              </span>
            ) : (
              'Log in'
            )}
          </button>
        </form>
      </div>

      <div className="mt-4 flex flex-col gap-2 text-center text-sm text-ink-600">
        <span>
          No account?{' '}
          <Link to="/register" className="font-semibold text-primary-800 hover:underline">
            Register
          </Link>
        </span>
        <span>
          Have old stories?{' '}
          <Link to="/claim" className="font-semibold text-primary-800 hover:underline">
            Claim your account
          </Link>
        </span>
      </div>
    </div>
  );
}

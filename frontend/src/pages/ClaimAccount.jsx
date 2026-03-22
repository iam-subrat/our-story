import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth';

export default function ClaimAccount() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ username: searchParams.get('username') || '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.claim(form.username, form.password);
      login(data);
      navigate(`/user/${data.user.username}`);
    } catch (err) {
      if (err.message.includes('already claimed')) {
        setError('This account is already claimed. Try logging in instead.');
      } else if (err.message.includes('not found')) {
        setError('Username not found.');
      } else {
        setError('Failed to claim account.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8">
        <div className="kicker">Existing user</div>
        <h1 className="h2 mt-1">Claim your account</h1>
        <p className="mt-2 text-ink-700">
          If you created stories before accounts were introduced, enter your username and set a password to access them.
        </p>
      </div>

      <div className="card p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">Username</label>
            <input
              type="text"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="input"
            />
            <p className="mt-1 text-xs text-ink-500">
              This is the slugified version of the name you used when creating stories (e.g. "John Doe" → "john-doe").
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">Set a password</label>
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
          <button type="submit" disabled={loading} className="btn-primary w-full py-4">
            {loading ? 'Claiming…' : 'Claim account'}
          </button>
        </form>
      </div>

      <p className="mt-4 text-center text-sm text-ink-600">
        Already claimed?{' '}
        <Link to="/login" className="font-semibold text-primary-800 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

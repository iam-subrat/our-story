import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'

function NavLink({ to, children }) {
  const location = useLocation()
  const active = location.pathname === to
  return (
    <Link
      to={to}
      className={['btn-soft px-6 py-2.5', active ? 'bg-primary-50 ring-primary-200 text-primary-900' : ''].join(' ')}
    >
      {children}
    </Link>
  )
}

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="app-shell">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-paper-50/60 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-primary-700 to-accent-500 text-white shadow-soft">
              <span className="font-display text-lg leading-none">O</span>
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg font-semibold tracking-tight text-ink-950">OurStory</div>
              <div className="text-xs font-medium text-ink-600">Collect memories, beautifully</div>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <NavLink to="/">Home</NavLink>
            {user ? (
              <>
                <Link to={`/user/${user.username}`} className="btn-soft px-6 py-2.5">
                  My Timeline
                </Link>
                <Link to="/create" className="btn-primary px-6 py-2.5">Create</Link>
                <button onClick={handleLogout} className="btn-soft px-6 py-2.5">Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-soft px-6 py-2.5">Log in</Link>
                <Link to="/create" className="btn-primary px-6 py-2.5">Create</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="container-page py-8 sm:py-12">
        <Outlet />
      </main>

      <footer className="border-t border-black/5 py-10">
        <div className="container-page flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="text-sm text-ink-600">
            Built for shared moments — weddings, trips, reunions, and everything in-between.
          </div>
          <div className="pill">
            <span className="text-accent-600">●</span> Your memories stay yours
          </div>
        </div>
      </footer>
    </div>
  )
}

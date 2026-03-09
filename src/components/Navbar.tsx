import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, LogOut, User as UserIcon } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="relative z-50 navbar sticky top-0" style={{ background: 'var(--navbar-bg)', borderBottom: '1px solid var(--border-card)' }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform">
            <Wallet className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
          </div>
          <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>VittVantage</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <ThemeToggle />
          {user ? (
            <>
              <div className="flex items-center gap-3 px-4 py-2 rounded-full" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
                <UserIcon className="w-4 h-4 text-violet-400" />
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-bold transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-bold transition-colors" style={{ color: 'var(--text-secondary)' }}>Login</Link>
              <Link to="/register" className="px-5 py-2.5 bg-violet-600 text-sm font-bold rounded-full hover:bg-violet-500 transition-all shadow-lg shadow-violet-500/20" style={{ color: '#fff' }}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="relative z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform">
            <Wallet className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">VittVantage</span>
        </Link>
        
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                <UserIcon className="w-4 h-4 text-violet-400" />
                <span className="text-sm font-medium text-slate-300">{user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-rose-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="px-5 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-full hover:bg-violet-500 transition-all shadow-lg shadow-violet-500/20">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

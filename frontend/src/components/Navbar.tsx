import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useExpense } from '../context/ExpenseContext';
import { useGoal } from '../context/GoalContext';
import { LogOut, Menu, X, Moon, Sun, Wallet } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

const ThemeToggleButton = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      whileTap={{ scale: 0.80 }}
      whileHover={{ scale: 1.1 }}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative flex items-center justify-center flex-shrink-0"
      style={{
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.12)',
        cursor: 'pointer',
        outline: 'none',
        overflow: 'hidden',
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ y: 20, opacity: 0, rotate: -30, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
            exit={{ y: -20, opacity: 0, rotate: 30, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Moon className="w-5 h-5" style={{ color: '#c4b5fd' }} />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: 20, opacity: 0, rotate: 30, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
            exit={{ y: -20, opacity: 0, rotate: -30, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Sun className="w-5 h-5" style={{ color: '#fbbf24' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const NAV_LINKS = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/add-transaction', label: 'Add' },
  { path: '/transactions', label: 'Transactions' },
  { path: '/analytics', label: 'Analytics' },
  { path: '/goals', label: 'Goals' },
  { path: '/investments', label: 'Investments' },
  { path: '/budget', label: 'Budget' },
  { path: '/profile', label: 'Profile' },
];

export default function Navbar() {
  const { user, logout, isDemo, activateDemo } = useAuth();
  const { loadDemoData } = useExpense();
  const { loadDemoGoals } = useGoal();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEnterDemo = () => {
    activateDemo();
    loadDemoData();
    loadDemoGoals();
    setMenuOpen(false);
    navigate('/dashboard');
  };

  return (
    <>
      <nav
        className="relative z-50 sticky top-0"
        style={{
          background: 'var(--navbar-bg)',
          borderBottom: '1px solid var(--border-card)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Trackify
            </span>
          </Link>

          {/* Desktop Nav Links */}
          {(user || isDemo) && (
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(({ path, label }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className="px-3 py-2 rounded-xl text-sm font-medium transition-all"
                    style={{
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      background: isActive ? 'rgba(139,92,246,0.12)' : 'transparent',
                      borderBottom: isActive ? '2px solid #7c3aed' : '2px solid transparent',
                    }}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <ThemeToggleButton />

            {user || isDemo ? (
              <div className="flex items-center gap-3">
                {/* Single button — Exit Demo or Logout */}
                {isDemo ? (
                  <button
                    onClick={handleLogout}
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-400 text-sm font-bold rounded-xl hover:bg-rose-500/20 transition-all border border-rose-500/20"
                  >
                    Exit Demo
                  </button>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="hidden md:flex items-center gap-2 text-sm font-bold transition-colors px-3 py-2 rounded-xl hover:bg-white/5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-bold transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-violet-600 text-sm font-bold rounded-full hover:bg-violet-500 transition-all shadow-lg shadow-violet-500/20 text-white"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-white/5 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-[61px] left-0 right-0 z-40 md:hidden px-4 py-3 overflow-hidden"
            style={{
              background: 'var(--navbar-bg)',
              borderBottom: '1px solid var(--border-card)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex flex-col gap-2 py-2">
              {user || isDemo ? (
                <>
                  {NAV_LINKS.map(({ path, label }) => {
                    const isActive = location.pathname === path;
                    return (
                      <Link
                        key={path}
                        to={path}
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-3 rounded-xl text-sm font-medium transition-all"
                        style={{
                          color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                          background: isActive ? 'rgba(139,92,246,0.12)' : 'transparent',
                        }}
                      >
                        {label}
                      </Link>
                    );
                  })}
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-left transition-all text-rose-400 hover:bg-rose-500/10"
                  >
                    {isDemo ? 'Exit Demo' : 'Logout'}
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-4 p-2">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-lg font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Login
                  </Link>
                  <button
                    onClick={handleEnterDemo}
                    className="text-left text-lg font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    View Demo
                  </button>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="w-full py-4 bg-violet-600 text-white font-bold rounded-2xl text-center shadow-lg shadow-violet-500/20"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-rose-500/20">
          <AlertCircle className="text-rose-500 w-10 h-10" />
        </div>
        <h1 className="text-6xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>404</h1>
        <p className="text-xl mb-10" style={{ color: 'var(--text-secondary)' }}>Oops! The page you're looking for has drifted into deep space.</p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-8 py-4 bg-violet-600 font-bold rounded-2xl hover:bg-violet-500 transition-all shadow-xl shadow-violet-500/20"
          style={{ color: '#fff' }}
        >
          <Home className="w-5 h-5" />
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}

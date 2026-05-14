import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, ArrowLeft } from 'lucide-react';

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <Lock className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-white">403 Access Denied</h1>
        <p className="text-slate-400 mb-8">You do not have permission to access this page</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 px-8 py-3 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-500 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Return to Dashboard
        </button>
      </motion.div>
    </div>
  );
}
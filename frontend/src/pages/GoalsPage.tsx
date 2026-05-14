import Navbar from '../components/Navbar';
import GoalTracker from '../components/GoalTracker';
import { motion } from 'motion/react';

export default function GoalsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>Savings Goals</h1>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Set targets and track your progress</p>
          <GoalTracker />
        </motion.div>
      </main>
    </div>
  );
}
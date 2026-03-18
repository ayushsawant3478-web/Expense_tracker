import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, ArrowRight, Zap, PieChart, ShieldCheck, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useExpense } from '../context/ExpenseContext';
import { useGoal } from '../context/GoalContext';
import StarfieldBackground from '../components/StarfieldBackground';

function useTypewriter(phrases: string[], typingSpeed = 100, erasingSpeed = 60, pauseTime = 2500) {
  const [displayText, setDisplayText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isTyping && !isDeleting) {
      if (displayText.length < phrases[phraseIndex].length) {
        timeout = setTimeout(() => {
          setDisplayText(phrases[phraseIndex].substring(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        setIsTyping(false);
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      }
    } else if (isDeleting) {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.substring(0, displayText.length - 1));
        }, erasingSpeed);
      } else {
        setIsDeleting(false);
        setIsTyping(true);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, isDeleting, phraseIndex, phrases, typingSpeed, erasingSpeed, pauseTime]);

  return { displayText, phraseIndex, isTyping: !isDeleting, showCursor };
}

export default function LandingPage() {
  const { activateDemo } = useAuth();
  const { loadDemoData } = useExpense();
  const { loadDemoGoals } = useGoal();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // 3D card tilt
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const springCfg = { stiffness: 200, damping: 28 };
  const rotateX = useSpring(useTransform(cardY, [-200, 200], [14, -14]), springCfg);
  const rotateY = useSpring(useTransform(cardX, [-200, 200], [-14, 14]), springCfg);

  const onCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    cardX.set(e.clientX - rect.left - rect.width / 2);
    cardY.set(e.clientY - rect.top - rect.height / 2);
  };

  const onCardMouseLeave = () => {
    cardX.set(0);
    cardY.set(0);
  };

  const phrases = [
    'Master your wealth with precision.',
    'Track every rupee effortlessly.',
    'Invest smarter every month.',
    'Achieve your financial goals.',
  ];

  const highlights = ['wealth', 'every rupee', 'smarter', 'financial goals'];
  const { displayText, phraseIndex, isTyping, showCursor } = useTypewriter(phrases);

  const renderTypedText = () => {
    const highlight = highlights[phraseIndex];
    if (!displayText.toLowerCase().includes(highlight.toLowerCase())) {
      return <span>{displayText}</span>;
    }

    const startIndex = phrases[phraseIndex].toLowerCase().indexOf(highlight.toLowerCase());
    const highlightEndIndex = startIndex + highlight.length;

    // Only highlight if the full highlight word is already typed or being typed
    if (displayText.length <= startIndex) {
      return <span>{displayText}</span>;
    }

    const beforeHighlight = displayText.substring(0, startIndex);
    const highlightedPart = displayText.substring(startIndex, Math.min(displayText.length, highlightEndIndex));
    const afterHighlight = displayText.substring(highlightEndIndex);

    return (
      <>
        <span>{beforeHighlight}</span>
        <span className="text-violet-500">{highlightedPart}</span>
        <span>{afterHighlight}</span>
      </>
    );
  };

  const handleViewDemo = () => {
    activateDemo();
    loadDemoData();
    loadDemoGoals();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950">
      <StarfieldBackground />
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <nav className="relative z-50 flex items-center justify-between px-4 sm:px-8 py-5 sm:py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">VittVantage</span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/login" className="text-sm font-medium transition-colors text-slate-400 hover:text-white">Login</Link>
          <button 
            onClick={handleViewDemo}
            className="text-sm font-medium transition-colors text-slate-400 hover:text-white"
          >
            View Demo
          </button>
          <Link to="/register" className="px-5 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-full hover:bg-violet-500 transition-all shadow-lg shadow-violet-500/25">
            Get Started
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden p-2 text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden relative z-40 px-8 py-6 border-b border-white/10 overflow-hidden"
            style={{ background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(20px)' }}
          >
            <div className="flex flex-col gap-4">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-lg font-medium text-slate-300">Login</Link>
              <button 
                onClick={() => { handleViewDemo(); setMenuOpen(false); }}
                className="text-left text-lg font-medium text-slate-300"
              >
                View Demo
              </button>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="w-full py-4 bg-violet-600 text-white font-bold rounded-2xl text-center shadow-lg shadow-violet-500/20">
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-16 lg:pt-20 pb-16 sm:pb-24 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6 sm:mb-8 text-white min-h-[72px] sm:min-h-[110px] lg:min-h-[160px]">
              <span style={{ color: 'var(--text-primary)' }}>
                {renderTypedText()}
              </span>
              {showCursor && isTyping && (
                <span className="text-violet-500 animate-pulse ml-1">|</span>
              )}
            </h1>
            <p className="text-base sm:text-xl mb-8 sm:mb-10 max-w-lg leading-relaxed text-slate-400">
              Track every rupee, set smart budgets, and visualize your financial journey with our premium space-themed manager.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <Link to="/register" className="group px-8 py-4 bg-violet-600 font-bold rounded-2xl hover:bg-violet-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-violet-500/20 text-white w-full sm:w-auto">
                Start Tracking Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button 
                onClick={handleViewDemo}
                className="px-8 py-4 font-bold rounded-2xl transition-all bg-white/5 border border-white/10 text-white hover:bg-white/10 w-full sm:w-auto"
              >
                View Demo
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mt-6 lg:mt-0 mx-2 sm:mx-0"
          >
            {/* Perspective wrapper — enables 3D tilt on mouse move */}
            <div
              style={{ perspective: '1200px' }}
              onMouseMove={onCardMouseMove}
              onMouseLeave={onCardMouseLeave}
              className="relative"
            >
              <motion.div
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                className="relative"
              >
                <div className="relative z-10 glass-card rounded-[32px] p-8 shadow-2xl overflow-hidden bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-sm uppercase tracking-widest font-bold mb-1 text-slate-400">Total Balance</p>
                      <p className="text-4xl font-mono font-bold text-white">₹45,250.00</p>
                    </div>
                    <div className="w-12 h-12 bg-violet-600/20 rounded-full flex items-center justify-center">
                      <Zap className="text-violet-500 w-6 h-6" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: 'Rent & Utilities', amount: '₹12,000', color: 'bg-violet-600' },
                      { label: 'Groceries', amount: '₹4,500', color: 'bg-blue-500' },
                      { label: 'Entertainment', amount: '₹2,200', color: 'bg-blue-400' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl flex items-center justify-between bg-white/[0.03] border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-8 ${item.color} rounded-full`} />
                          <span className="font-medium text-white">{item.label}</span>
                        </div>
                        <span className="font-mono font-bold text-white">{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating badges — translateZ makes them pop above the card face in 3D */}
                <motion.div
                  style={{ translateZ: 50 }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 z-20 glass-card p-4 rounded-2xl shadow-xl bg-white/[0.05] border border-white/10 backdrop-blur-xl"
                >
                  <PieChart className="text-violet-500 w-8 h-8" />
                </motion.div>
                <motion.div
                  style={{ translateZ: 50 }}
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-6 -left-6 z-20 glass-card p-4 rounded-2xl shadow-xl bg-white/[0.05] border border-white/10 backdrop-blur-xl"
                >
                  <ShieldCheck className="text-blue-400 w-8 h-8" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 md:py-32 border-t border-white/10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-12 sm:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Why Choose VittVantage?</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to manage your money like a pro, all in one beautiful place.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {[
            {
              icon: Zap,
              color: "text-violet-500",
              bgColor: "bg-violet-600/10",
              title: "Real-time Tracking",
              desc: "Log your expenses instantly as they happen. Stay on top of your spending without the lag."
            },
            {
              icon: PieChart,
              color: "text-blue-400",
              bgColor: "bg-blue-500/10",
              title: "Visual Insights",
              desc: "Beautiful charts and reports that help you understand where your money goes each month."
            },
            {
              icon: ShieldCheck,
              color: "text-emerald-400",
              bgColor: "bg-emerald-500/10",
              title: "Secure & Private",
              desc: "Your financial data is yours alone. We prioritize your privacy and security above all else."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
              className="space-y-4"
            >
              <div className={`w-12 h-12 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6`}>
                <feature.icon className={`${feature.color} w-6 h-6`} />
              </div>
              <h3 className="text-xl font-bold text-white">{feature.title}</h3>
              <p className="leading-relaxed text-slate-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 md:py-32 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-12 sm:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">How It Works</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Three simple steps to financial freedom.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {[
            { step: "01", title: "Sign Up", desc: "Create your account in seconds and start your journey." },
            { step: "02", title: "Log Expenses", desc: "Quickly enter your daily transactions and income." },
            { step: "03", title: "See Progress", desc: "Watch your savings grow with interactive charts." }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
              className="relative p-8 rounded-[32px] bg-white/[0.02] border border-white/5"
            >
              <span className="text-6xl font-black text-white/5 absolute top-4 right-8">{item.step}</span>
              <h3 className="text-xl font-bold mb-4 text-white">{item.title}</h3>
              <p className="text-slate-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 md:py-32 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-12 sm:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Loved by Users</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Join thousands who have transformed their relationship with money.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Sarah J.", role: "Freelancer", quote: "VittVantage completely changed how I track my business expenses. So intuitive!" },
            { name: "Rahul M.", role: "Software Engineer", quote: "The best finance app I've ever used. The UI is stunning and it's so fast." },
            { name: "Elena K.", role: "Designer", quote: "Finally a finance app that looks as good as it works. The dark mode is perfect." }
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
              className="p-8 rounded-[32px] bg-white/[0.03] border border-white/10"
            >
              <p className="text-slate-300 italic mb-6">"{testimonial.quote}"</p>
              <div>
                <p className="font-bold text-white">{testimonial.name}</p>
                <p className="text-sm text-violet-500">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="relative z-10 py-16 md:py-32 border-t border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(37,99,235,0.05))' }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white leading-tight">Ready to take control of your finances?</h2>
            <p className="text-base sm:text-xl text-slate-400 mb-8 sm:mb-12">Join thousands of users managing their wealth smarter with VittVantage. Free forever.</p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6">
              <Link to="/register" className="px-10 py-4 sm:py-5 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-500 transition-all shadow-xl shadow-violet-500/25 w-full sm:w-auto text-center">
                Get Started Free
              </Link>
              <button 
                onClick={handleViewDemo}
                className="px-10 py-4 sm:py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all w-full sm:w-auto"
              >
                View Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} VittVantage. All rights reserved.</p>
      </footer>
    </div>
  );
}

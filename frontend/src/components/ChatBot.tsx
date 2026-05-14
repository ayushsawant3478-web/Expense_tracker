import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useExpense } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

interface Message {
  role: 'user' | 'bot';
  text: string;
}

export default function ChatBot() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 640);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hi! I am your Trackify financial assistant. Ask me anything about your finances, budgeting, or investments!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { transactions, getMonthlySummary } = useExpense();
  const { user } = useAuth();

  const currentMonth = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`;
  const { income, expenses, netBalance } = getMonthlySummary(currentMonth);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSmallMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getFinancialContext = () => {
    const topExpenses = transactions
      .filter(t => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
      .map(t => `${t.description}: ₹${t.amount}`)
      .join(', ');

    return `
      User: ${user?.username}
      Current Month: ${currentMonth}
      Total Income: ₹${income}
      Total Expenses: ₹${expenses}
      Net Savings: ₹${netBalance}
      Top Expenses: ${topExpenses}
      You are a helpful Indian personal finance assistant for the app Trackify.
      Always respond in a friendly, concise way. Use ₹ for currency.
      Give practical advice based on the user's actual financial data above.
    `;
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt = `${getFinancialContext()}\n\nUser question: ${userMessage}`;
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    } catch (err: any) {
      console.error('Gemini error:', err);
      if (err?.status === 429) {
        setMessages(prev => [...prev, { role: 'bot', text: 'I am receiving too many requests right now. Please wait a few seconds and try again!' }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I could not process your request. Please try again!' }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return createPortal(
    <>
      {/* Backdrop for Mobile */}
      <AnimatePresence>
        {open && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[9997]"
            style={{ background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)' }}
          />
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ 
          scale: 1.05, 
          boxShadow: isDark ? '0 0 20px rgba(139,92,246,0.3)' : '0 8px 30px rgba(139,92,246,0.2)' 
        }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
        style={{
          background: isDark ? '#1e1e2e' : '#ffffff',
          border: isDark ? '1px solid rgba(139,92,246,0.4)' : '1px solid #e2e8f0',
        }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" style={{ color: isDark ? '#a78bfa' : '#7c3aed' }} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="w-6 h-6" style={{ color: isDark ? '#a78bfa' : '#7c3aed' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed z-[9998] overflow-hidden flex flex-col"
            style={{
              background: isDark ? '#0d0d14' : '#ffffff',
              border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0',
              boxShadow: isDark ? '0 24px 48px rgba(0,0,0,0.6)' : '0 24px 48px rgba(0,0,0,0.1)',
              borderRadius: '20px',
              height: '520px',
              maxHeight: 'calc(100vh - 120px)',
              bottom: isSmallMobile ? '80px' : '96px',
              right: isSmallMobile ? '16px' : '24px',
              left: isSmallMobile ? '16px' : 'auto',
              width: isSmallMobile ? 'auto' : (isMobile ? 'calc(100vw - 48px)' : '360px'),
            }}
          >
            {/* Header */}
            <div
              className="p-4 flex items-center gap-3 border-b flex-shrink-0"
              style={{
                borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
                background: isDark ? '#0d0d14' : '#ffffff'
              }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: isDark ? '#1a1a2e' : '#f8fafc', border: isDark ? '1px solid rgba(139,92,246,0.3)' : '1px solid #e2e8f0' }}>
                <Bot className="w-5 h-5" style={{ color: isDark ? '#a78bfa' : '#7c3aed' }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>Trackify AI</p>
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  Online
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ background: isDark ? '#0d0d14' : '#f8fafc' }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className="w-7 h-7 flex items-center justify-center flex-shrink-0"
                    style={{
                      background: isDark ? '#1a1a2e' : '#ffffff',
                      border: msg.role === 'bot' 
                        ? (isDark ? '1px solid rgba(139,92,246,0.3)' : '1px solid #e2e8f0') 
                        : (isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0'),
                      borderRadius: '8px'
                    }}
                  >
                    {msg.role === 'bot' 
                      ? <Bot className="w-4 h-4" style={{ color: isDark ? '#a78bfa' : '#7c3aed' }} /> 
                      : <User className="w-4 h-4" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : '#64748b' }} />
                    }
                  </div>
                  <div
                    className="max-w-[75%] px-4 py-2.5 text-[13px] leading-[1.6]"
                    style={{
                      background: msg.role === 'user' ? (isDark ? '#2d1b69' : '#7c3aed') : (isDark ? '#161622' : '#ffffff'),
                      border: msg.role === 'user' 
                        ? (isDark ? '1px solid rgba(139,92,246,0.3)' : '1px solid #6d28d9') 
                        : (isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0'),
                      color: msg.role === 'user' ? 'white' : (isDark ? 'rgba(255,255,255,0.85)' : '#1e293b'),
                      borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                      fontFamily: '-apple-system, BlinkMacSystemFont, system-ui'
                    }}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-7 h-7 flex items-center justify-center" style={{ background: isDark ? '#1a1a2e' : '#ffffff', border: isDark ? '1px solid rgba(139,92,246,0.3)' : '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <Bot className="w-4 h-4" style={{ color: isDark ? '#a78bfa' : '#7c3aed' }} />
                  </div>
                  <div className="px-4 py-3 rounded-[16px]" style={{ background: isDark ? '#161622' : '#ffffff', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0' }}>
                    <Loader2 className="w-4 h-4 animate-spin" style={{ color: isDark ? '#a78bfa' : '#7c3aed' }} />
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t flex-shrink-0" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0', background: isDark ? '#0d0d14' : '#ffffff' }}>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your finances..."
                  className={`flex-grow px-4 py-2.5 text-sm focus:outline-none transition-all ${isDark ? 'placeholder-white/20' : 'placeholder-slate-400'}`}
                  style={{
                    background: isDark ? '#161622' : '#f1f5f9',
                    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    color: isDark ? 'white' : '#0f172a'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = isDark ? 'rgba(139,92,246,0.5)' : '#7c3aed';
                    e.target.style.boxShadow = isDark ? '0 0 0 3px rgba(139,92,246,0.1)' : '0 0 0 3px rgba(124,58,237,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 flex items-center justify-center disabled:opacity-40 transition-all"
                  style={{
                    background: isDark ? '#1a1a2e' : '#7c3aed',
                    border: isDark ? '1px solid rgba(139,92,246,0.3)' : 'none',
                    borderRadius: '12px'
                  }}
                >
                  <Send className="w-4 h-4" style={{ color: isDark ? '#a78bfa' : 'white' }} />
                </motion.button>
              </div>
              <p className="text-center mt-2" style={{ color: isDark ? 'rgba(255,255,255,0.2)' : '#94a3b8', fontSize: '10px' }}>
                Powered by Gemini AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}
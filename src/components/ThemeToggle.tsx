import { useTheme } from '../context/ThemeContext';
import { motion } from 'motion/react';
import { Moon, Sun, Sparkles } from 'lucide-react';

const options: Array<{ key: 'dark' | 'light' | 'glass'; label: string; Icon: any }> = [
  { key: 'dark', label: 'Dark', Icon: Moon },
  { key: 'light', label: 'Light', Icon: Sun },
  { key: 'glass', label: 'Glass', Icon: Sparkles },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="relative flex items-center rounded-full p-1 apple-navbar-seg">
      <div className="relative flex gap-1">
        {options.map(({ key, label, Icon }) => {
          const active = theme === key;
          return (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={`relative px-4 py-2 text-sm font-bold rounded-full flex items-center gap-2 ${active ? 'seg-active' : 'seg-inactive'}`}
              style={{
                color: active ? (theme === 'glass' ? '#fff' : '#0f172a') : 'var(--text-secondary)'
              }}
            >
              {active && (
                <motion.div
                  layoutId="themeActive"
                  className="absolute inset-0 rounded-full shadow"
                  style={{ background: theme === 'glass' ? 'rgba(255,255,255,0.15)' : '#fff' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <motion.span className="relative z-10 flex items-center gap-2" whileTap={{ scale: 0.97 }}>
                <Icon className="w-4 h-4" />
                {label}
              </motion.span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

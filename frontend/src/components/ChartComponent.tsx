import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Transaction } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ChartComponentProps {
  transactions: Transaction[];
}

const COLORS = [
  '#8b5cf6',
  '#3b82f6',
  '#f59e0b',
  '#10b981',
  '#ec4899',
  '#f43f5e',
  '#06b6d4',
  '#f97316',
];

export default function ChartComponent({ transactions }: ChartComponentProps) {
  const { theme } = useTheme();
  const chartTheme = {
    dark: { grid: '#1e293b', text: '#94a3b8', tooltip: { bg: '#1e293b', text: '#fff' } },
    light: { grid: '#e2e8f0', text: '#64748b', tooltip: { bg: '#ffffff', text: '#0f172a' } }
  } as const;
  const t = chartTheme[theme];

  const dataForPieChart = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'expense') {
      const existing = acc.find(item => item.name === transaction.category);
      if (existing) {
        existing.value += transaction.amount;
      } else {
        acc.push({ name: transaction.category, value: transaction.amount });
      }
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const monthlyData = transactions.reduce((acc, transaction) => {
    const month = transaction.date.substring(0, 7);
    if (!acc[month]) {
      acc[month] = { month, income: 0, expenses: 0 };
    }
    if (transaction.type === 'income') {
      acc[month].income += transaction.amount;
    } else {
      acc[month].expenses += transaction.amount;
    }
    return acc;
  }, {} as { [key: string]: { month: string; income: number; expenses: number } });

  const dataForBarChart = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 rounded-2xl" style={{ background: t.tooltip.bg, color: t.tooltip.text, boxShadow: 'var(--shadow-card)', border: '1px solid var(--border-card)' }}>
          <p className="text-sm font-bold mb-2">{label || payload[0].name}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} className="text-xs font-mono" style={{ color: p.color || p.fill }}>
              {p.name}: ₹{p.value.toLocaleString('en-IN')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Show empty state if no data
  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]" style={{ color: 'var(--text-secondary)' }}>
        <p className="text-sm">No transactions to display</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Pie Chart */}
      <div className="flex flex-col" style={{ minHeight: '400px' }}>
        <h3 className="text-sm font-bold uppercase tracking-widest mb-6" style={{ color: 'var(--text-secondary)' }}>
          Expense Distribution
        </h3>
        <div style={{ flex: 1, minHeight: '320px' }}>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <defs>
                <linearGradient id="incGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <Pie
                data={dataForPieChart}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={8}
                stroke="none"
              >
                {dataForPieChart.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#0e0f12"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="flex flex-col" style={{ minHeight: '400px' }}>
        <h3 className="text-sm font-bold uppercase tracking-widest mb-6" style={{ color: 'var(--text-secondary)' }}>
          Cash Flow History
        </h3>
        <div style={{ flex: 1, minHeight: '320px' }}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={dataForBarChart} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="incGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="expGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={t.grid} vertical={false} />
              <XAxis
                dataKey="month"
                stroke={t.text}
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke={t.text}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: theme === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)' }}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
              />
              <Bar dataKey="income" fill="url(#incGrad2)" radius={[6, 6, 0, 0]} barSize={24} />
              <Bar dataKey="expenses" fill="url(#expGrad2)" radius={[6, 6, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
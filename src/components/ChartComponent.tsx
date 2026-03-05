import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Transaction } from '../types';

interface ChartComponentProps {
  transactions: Transaction[];
}

const COLORS = ['#8b5cf6', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981'];

export default function ChartComponent({ transactions }: ChartComponentProps) {
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
    const month = transaction.date.substring(0, 7); // YYYY-MM
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
        <div className="glass p-4 rounded-2xl border-white/10 shadow-2xl bg-[#0f172a]/90">
          <p className="text-sm font-bold mb-2 text-white">{label || payload[0].name}</p>
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="h-[450px] flex flex-col">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Expense Distribution</h3>
        <div className="flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                align="center"
                iconType="circle" 
                wrapperStyle={{ paddingTop: '30px', fontSize: '12px' }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="h-[450px] flex flex-col">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Cash Flow History</h3>
        <div className="flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataForBarChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="month" 
                stroke="#94a3b8" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Legend 
                verticalAlign="bottom" 
                align="center"
                iconType="circle" 
                wrapperStyle={{ paddingTop: '30px', fontSize: '12px' }} 
              />
              <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} barSize={24} />
              <Bar dataKey="expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

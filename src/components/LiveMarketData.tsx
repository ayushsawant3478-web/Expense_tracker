import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { MARKET_API_URL } from '../constants';
import { TrendingUp, TrendingDown, RefreshCw, Activity } from 'lucide-react';

type Tier = 'none' | 'starter' | 'growing' | 'moderate' | 'good' | 'excellent';

type Item = {
  name: string;
  price: number | null;
  change: number | null;
  change_pct: number | null;
  updated_at: string | null;
};

type MarketPayload = {
  indices: Item[];
  stocks: Item[];
  sips: Item[];
  gold: Item[];
  elss: Item[];
  reits: Item[];
  updated_at: string;
};

interface Props {
  savingsTier: Tier;
}

export default function LiveMarketData({ savingsTier }: Props) {
  const [data, setData] = useState<MarketPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch(`${MARKET_API_URL}/market/all`);
      if (!res.ok) throw new Error('Failed to fetch live market data');
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 60_000);
    return () => clearInterval(id);
  }, []);

  const itemsToShow: Item[] = useMemo(() => {
    if (!data) return [];
    if (savingsTier === 'none') return [];
    if (savingsTier === 'starter') return data.gold;
    if (savingsTier === 'growing') {
      const mirae = data.sips.find(s => s.name.includes('Mirae Asset Large Cap'));
      const axis = data.sips.find(s => s.name.includes('Axis Bluechip'));
      const result = [mirae, axis].filter(Boolean) as Item[];
      const ppf: Item = {
        name: 'PPF Rate',
        price: 7.1,
        change: null,
        change_pct: null,
        updated_at: new Date().toISOString()
      };
      return [...result, ppf];
    }
    if (savingsTier === 'moderate') {
      const nasdaq = data.sips.find(s => s.name.includes('Nasdaq 100'));
      const fd: Item = {
        name: 'FD Avg Rate',
        price: 7.0,
        change: null,
        change_pct: null,
        updated_at: new Date().toISOString()
      };
      return [...data.indices, fd, ...(nasdaq ? [nasdaq] : [])];
    }
    if (savingsTier === 'good') {
      const reli = data.stocks.find(s => s.name.includes('Reliance'));
      const tcs = data.stocks.find(s => s.name.includes('TCS'));
      const hdfc = data.stocks.find(s => s.name.includes('HDFC Bank'));
      const ppf = data.sips.find(s => s.name.includes('Parag Parikh'));
      return [reli, tcs, hdfc, ppf].filter(Boolean) as Item[];
    }
    return [...data.reits, ...data.elss, ...data.indices];
  }, [data, savingsTier]);

  const statusColor = (change: number | null) =>
    change === null ? 'text-slate-400' : change >= 0 ? 'text-emerald-400' : 'text-rose-400';

  const StatusIcon = ({ change }: { change: number | null }) => {
    if (change === null) return <Activity className="w-4 h-4 text-slate-400" />;
    return change >= 0 ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-rose-400" />;
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Activity className="w-5 h-5 text-violet-400" />
          Live Market Data
        </h2>
        <button
          onClick={fetchData}
          className="px-3 py-2 glass rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-slate-300" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="glass p-4 rounded-[24px] border border-rose-500/20 bg-rose-500/10 mb-6 text-rose-400 flex items-center justify-between">
          <span className="text-sm font-medium">Failed to load live data: {error}</span>
          <button onClick={fetchData} className="px-3 py-2 bg-rose-500/20 rounded-xl text-rose-300 hover:bg-rose-500/30 transition-colors text-sm font-bold">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass p-6 rounded-[24px] border-white/5"
            >
              <div className="w-full h-4 bg-white/5 rounded mb-3 animate-pulse" />
              <div className="w-1/2 h-8 bg-white/5 rounded mb-2 animate-pulse" />
              <div className="w-1/3 h-4 bg-white/5 rounded animate-pulse" />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {itemsToShow.map((item, i) => (
            <motion.div
              key={`${item.name}-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass p-6 rounded-[24px] border-white/5 relative overflow-hidden"
            >
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
                  LIVE
                </span>
              </div>
              <h4 className="font-bold text-sm mb-3">{item.name}</h4>
              <p className="text-2xl font-mono font-bold mb-2">₹{item.price !== null ? item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—'}</p>
              <div className="flex items-center gap-2">
                <StatusIcon change={item.change} />
                <span className={`text-sm font-mono ${statusColor(item.change)}`}>
                  {item.change === null ? 'No change' : `${item.change >= 0 ? '+' : ''}${item.change.toFixed(2)}`}
                </span>
                <span className={`text-xs ${statusColor(item.change)}`}>
                  {item.change_pct === null ? '' : `(${item.change_pct >= 0 ? '+' : ''}${item.change_pct.toFixed(2)}%)`}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-3">Updated: {item.updated_at ? new Date(item.updated_at).toLocaleString() : '—'}</p>
            </motion.div>
          ))}
          {itemsToShow.length === 0 && (
            <div className="glass p-6 rounded-[24px] border-white/5">
              <p className="text-sm text-slate-400">No live data for this savings tier.</p>
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
}

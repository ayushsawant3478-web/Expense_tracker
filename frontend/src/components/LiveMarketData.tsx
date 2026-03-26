import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { MARKET_API_URL } from '../constants';
import { TrendingUp, TrendingDown, RefreshCw, Activity, PieChart } from 'lucide-react';

type Tier = 'none' | 'starter' | 'growing' | 'moderate' | 'good' | 'excellent';

type Item = {
  name: string;
  price: number | null;
  change: number | null;
  change_pct: number | null;
  updated_at: string | null;
  typeLabel?: string;
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

const statusColor = (change: number | null) =>
  change === null ? 'text-slate-400' : change >= 0 ? 'text-emerald-400' : 'text-rose-400';

const StatusIcon = ({ change }: { change: number | null }) => {
  if (change === null) return <Activity className="w-4 h-4 text-slate-400" />;
  return change >= 0 ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-rose-400" />;
};

const MarketCard = ({ item, isMF, index }: { item: Item; isMF: boolean; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="glass-card p-6 rounded-[24px] relative overflow-hidden min-w-[250px]"
    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
  >
    <div className="absolute top-3 right-3">
      <span className="px-2 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
        LIVE
      </span>
    </div>
    <div className="flex items-start justify-between mb-3 pr-16">
      <h4 className="font-bold text-sm leading-tight">{item.name}</h4>
      {item.typeLabel && (
        <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-white/5 text-slate-400 border border-white/5 ml-2 shrink-0">
          {item.typeLabel}
        </span>
      )}
    </div>
    <p className="text-2xl font-mono font-bold mb-2">
      <span className="text-xs font-sans text-slate-500 mr-1 uppercase tracking-wider">
        {isMF ? 'NAV: ' : ''}
      </span>
      ₹{item.price !== null ? item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—'}
    </p>
    <div className="flex items-center gap-2">
      <StatusIcon change={item.change} />
      <span className={`text-sm font-mono ${statusColor(item.change)}`}>
        {item.change === null ? 'No change' : `${item.change >= 0 ? '+' : ''}${item.change.toFixed(2)}`}
      </span>
      <span className={`text-xs ${statusColor(item.change)}`}>
        {item.change_pct === null ? '' : `(${item.change_pct >= 0 ? '+' : ''}${item.change_pct.toFixed(2)}%)`}
      </span>
    </div>
    <p className="text-[10px] mt-3" style={{ color: 'var(--text-secondary)' }}>
      Updated: {item.updated_at ? new Date(item.updated_at).toLocaleString('en-IN') : new Date().toLocaleString('en-IN')}
    </p>
  </motion.div>
);

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

  const { stocksAndIndices, mutualFunds } = useMemo(() => {
    if (!data || savingsTier === 'none') return { stocksAndIndices: [], mutualFunds: [] };
    
    let sAndI: Item[] = [];
    let mfs: Item[] = [];

    if (savingsTier === 'starter') {
      sAndI = data.gold.map(i => ({ ...i, typeLabel: 'Commodity' }));
    } else if (savingsTier === 'growing') {
      const mirae = data.sips.find(s => s.name.includes('Mirae Asset Large Cap'));
      const axis = data.sips.find(s => s.name.includes('Axis Bluechip'));
      mfs = ([mirae, axis].filter(Boolean) as Item[]).map(i => ({ ...i, typeLabel: 'SIP' }));
      mfs.push({
        name: 'PPF Rate',
        price: 7.1,
        change: null,
        change_pct: null,
        updated_at: new Date().toISOString(),
        typeLabel: 'SIP'
      });
    } else if (savingsTier === 'moderate') {
      sAndI = data.indices.map(i => ({ ...i, typeLabel: 'Index' }));
      mfs.push({
        name: 'FD Avg Rate',
        price: 7.0,
        change: null,
        change_pct: null,
        updated_at: new Date().toISOString(),
        typeLabel: 'SIP'
      });
      const nasdaq = data.sips.find(s => s.name.includes('Nasdaq 100'));
      if (nasdaq) mfs.push({ ...nasdaq, typeLabel: 'SIP' });
    } else if (savingsTier === 'good') {
      const reli = data.stocks.find(s => s.name.includes('Reliance'));
      const tcs = data.stocks.find(s => s.name.includes('TCS'));
      const hdfc = data.stocks.find(s => s.name.includes('HDFC Bank'));
      sAndI = ([reli, tcs, hdfc].filter(Boolean) as Item[]).map(i => ({ ...i, typeLabel: 'Stock' }));
      
      const ppf = data.sips.find(s => s.name.includes('Parag Parikh'));
      if (ppf) mfs.push({ ...ppf, typeLabel: 'SIP' });
    } else {
      sAndI = [
        ...data.indices.map(i => ({ ...i, typeLabel: 'Index' })),
        ...data.reits.map(i => ({ ...i, typeLabel: 'REIT' }))
      ];
      mfs = data.elss.map(i => ({ ...i, typeLabel: 'ELSS' }));
    }

    return { stocksAndIndices: sAndI, mutualFunds: mfs };
  }, [data, savingsTier]);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
            <Activity className="w-6 h-6 text-violet-400" />
          </div>
          Market Insights
        </h2>
        <button
          onClick={fetchData}
          className="px-4 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
        >
          <RefreshCw className={`w-4 h-4 text-slate-300 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="glass-card p-4 rounded-[24px] mb-6 text-rose-400 flex items-center justify-between" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid var(--border-card)' }}>
          <span className="text-sm font-medium">Failed to load live data: {error}</span>
          <button onClick={fetchData} className="px-3 py-2 bg-rose-500/20 rounded-xl text-rose-300 hover:bg-rose-500/30 transition-colors text-sm font-bold">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card p-6 rounded-[24px] animate-pulse" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
              <div className="w-full h-4 rounded mb-3 bg-white/5" />
              <div className="w-1/2 h-8 rounded mb-2 bg-white/5" />
              <div className="w-1/3 h-4 rounded bg-white/5" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {stocksAndIndices.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-400">
                <TrendingUp className="w-5 h-5" />
                Live Stocks & Indices
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stocksAndIndices.map((item, i) => (
                  <MarketCard key={item.name} item={item} isMF={false} index={i} />
                ))}
              </div>
            </div>
          )}

          {stocksAndIndices.length > 0 && mutualFunds.length > 0 && (
            <div className="w-full h-px my-10" style={{ background: 'var(--border-card)' }} />
          )}

          {mutualFunds.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-violet-400">
                <PieChart className="w-5 h-5" />
                Live Mutual Funds & SIPs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mutualFunds.map((item, i) => (
                  <MarketCard key={item.name} item={item} isMF={true} index={i} />
                ))}
              </div>
            </div>
          )}

          {stocksAndIndices.length === 0 && mutualFunds.length === 0 && (
            <div className="glass-card p-12 rounded-[32px] text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
              <Activity className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-20" />
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                No live market data recommendations for your current savings tier.
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}

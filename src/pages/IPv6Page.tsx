import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateIPv6Subnet, isValidIPv6, IPv6Results } from '../lib/subnet-logic';
import { Globe2, Trash2, Calculator, Info, CheckCircle2, AlertCircle } from 'lucide-react';

export default function IPv6Page() {
  const [ip, setIp] = useState('2001:db8::1');
  const [prefix, setPrefix] = useState(64);
  const [results, setResults] = useState<IPv6Results | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    if (!isValidIPv6(ip)) {
      setError('Invalid IPv6 address detected in terminal.');
      setResults(null);
      return;
    }
    setError(null);
    const res = calculateIPv6Subnet(ip, prefix);
    setResults(res);
  };

  const handleClear = () => {
    setIp('');
    setPrefix(64);
    setResults(null);
    setError(null);
  };

  const ResultItem = ({ label, value, icon: Icon }: { label: string, value: string | number, icon: any }) => (
    <div className="flex items-center justify-between p-4 bg-dark-bg/40 rounded-2xl border border-white/5 group hover:border-neon-purple/20 transition-all">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-neon-purple/10 rounded-lg group-hover:bg-neon-purple/20 transition-colors">
          <Icon className="w-4 h-4 text-neon-purple" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-secondary">{label}</span>
      </div>
      <span className="font-mono text-sm font-bold text-white bg-white/5 px-3 py-1 rounded-lg border border-white/5">{value}</span>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-[calc(100vh-64px)] flex flex-col items-center py-20 px-6 relative overflow-hidden text-white"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-neon-purple/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-3xl space-y-10 relative z-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
            IPv6 <span className="text-neon-purple neon-text-purple">Gateway</span>
          </h1>
          <p className="text-secondary text-sm font-bold uppercase tracking-[0.2em] opacity-60">Next-Generation Topology Analysis</p>
        </div>

        <div className="glass-card p-10 space-y-10 border-2 neon-glow-purple animate-neon-purple">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-black text-neon-purple uppercase tracking-[0.2em]">Prefix Length</label>
              <span className="font-mono text-neon-purple font-black text-2xl tracking-tighter">
                /{prefix}
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="128" 
              value={prefix} 
              onChange={(e) => setPrefix(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-neon-purple"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-neon-purple uppercase tracking-[0.2em]">IPv6 Entry</label>
            <div className="relative group">
              <input 
                type="text" 
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="2001:db8::"
                className="w-full pl-6 pr-12 py-5 border-neon-purple/20 text-lg font-mono font-bold tracking-widest bg-dark-card"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {isValidIPv6(ip) ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                ) : ip ? (
                  <AlertCircle className="w-6 h-6 text-rose-500" />
                ) : null}
              </div>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-bold uppercase tracking-wider flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <div className="flex gap-6 pt-4">
            <button onClick={handleCalculate} className="flex-1 py-4 bg-neon-purple hover:bg-neon-purple/80 text-dark-bg font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-neon-purple/20">
              <Calculator className="w-5 h-5" />
              Analyze
            </button>
            <button onClick={handleClear} className="px-8 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all border border-white/10 active:scale-95">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card overflow-hidden border-neon-purple/10"
            >
              <div className="bg-neon-purple/10 px-10 py-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse shadow-[0_0_8px_rgba(191,0,255,0.8)]" />
                  <span className="font-black text-xs tracking-[0.3em] uppercase text-neon-purple">Topology Report</span>
                </div>
              </div>
              <div className="p-10 space-y-4">
                <ResultItem label="Network Prefix" value={results.networkPrefix} icon={Globe2} />
                <ResultItem label="Prefix Length" value={`/${results.prefixLength}`} icon={Info} />
                <ResultItem label="Total Pool" value={results.totalAddresses} icon={CheckCircle2} />
                <div className="mt-6 p-5 bg-neon-purple/5 border border-neon-purple/10 rounded-2xl flex items-start gap-4">
                  <Info className="w-5 h-5 text-neon-purple mt-0.5" />
                  <p className="text-secondary text-xs font-medium leading-relaxed uppercase tracking-wider">
                    Maximum address space configured. Sufficient for approximately {results.totalAddresses} endpoints.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

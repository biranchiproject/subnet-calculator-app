import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateSubnet, getCidrOptions, isValidIP, SubnetResults, IPClass } from '@/lib/subnet-logic';
import { Calculator, Trash2, Info, CheckCircle2, AlertCircle, Network, ShieldCheck } from 'lucide-react';

export default function IPv4Page() {
  const [ip, setIp] = useState('192.168.1.1');
  const [ipClass, setIpClass] = useState<IPClass | 'Any'>('Any');
  const [cidr, setCidr] = useState(24);
  const [results, setResults] = useState<SubnetResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cidrOptions = getCidrOptions(ipClass === 'Any' ? 'Any' : ipClass);

  const handleCalculate = () => {
    if (!isValidIP(ip)) {
      setError('Invalid IPv4 address format detected.');
      setResults(null);
      return;
    }
    setError(null);
    const res = calculateSubnet(ip, cidr);
    setResults(res);
  };

  const handleClear = () => {
    setIp('');
    setIpClass('Any');
    setCidr(24);
    setResults(null);
    setError(null);
  };

  const ResultItem = ({ label, value, icon: Icon }: { label: string, value: string | number, icon: any }) => (
    <div className="flex items-center justify-between p-4 bg-dark-bg/40 rounded-2xl border border-white/5 group hover:border-neon-blue/20 transition-all">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-neon-blue/10 rounded-lg group-hover:bg-neon-blue/20 transition-colors">
          <Icon className="w-4 h-4 text-neon-blue" />
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
      className="min-h-[calc(100vh-64px)] flex flex-col items-center py-20 px-6 relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-neon-blue/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-3xl space-y-10 relative z-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
            IPv4 <span className="text-neon-blue neon-text-blue">Terminal</span>
          </h1>
          <p className="text-secondary text-sm font-bold uppercase tracking-[0.2em] opacity-60">High-Precision Subnet Analysis Engine</p>
        </div>

        <div className="glass-card p-10 space-y-8 border-2 neon-glow-blue animate-neon-blue">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-neon-blue uppercase tracking-[0.2em]">Network Class</label>
              <select 
                value={ipClass} 
                onChange={(e) => setIpClass(e.target.value as any)}
                className="w-full border-neon-blue/20 text-sm font-bold bg-dark-card"
              >
                <option value="Any">Any (Classless)</option>
                <option value="A">Class A</option>
                <option value="B">Class B</option>
                <option value="C">Class C</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-neon-blue uppercase tracking-[0.2em]">Subnet Mask</label>
              <select 
                value={cidr} 
                onChange={(e) => setCidr(parseInt(e.target.value))}
                className="w-full border-neon-blue/20 text-sm font-bold bg-dark-card"
              >
                {cidrOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-neon-blue uppercase tracking-[0.2em]">IP Address</label>
            <div className="relative group">
              <input 
                type="text" 
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="0.0.0.0"
                className="w-full pl-6 pr-12 py-4 border-neon-blue/20 text-lg font-mono font-bold tracking-widest bg-dark-card"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {isValidIP(ip) ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                ) : ip ? (
                  <AlertCircle className="w-6 h-6 text-rose-500" />
                ) : null}
              </div>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-bold uppercase tracking-wider flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <div className="flex gap-6 pt-4">
            <button onClick={handleCalculate} className="flex-1 py-4 bg-neon-blue hover:bg-neon-blue/80 text-dark-bg font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-neon-blue/20">
              <Calculator className="w-5 h-5" />
              Calculate
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
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card overflow-hidden border-neon-blue/10"
            >
              <div className="bg-neon-blue/10 px-10 py-6 border-b border-white/5 flex items-center justify-between">
                <span className="font-black text-xs tracking-[0.3em] uppercase text-neon-blue">Network Analysis</span>
                <span className="text-xs font-mono font-bold bg-neon-blue/20 text-neon-blue px-4 py-1.5 rounded-full border border-neon-blue/30">{results.short}</span>
              </div>
              <div className="p-10 grid md:grid-cols-2 gap-6">
                <ResultItem label="Network Addr" value={results.networkAddress} icon={Network} />
                <ResultItem label="Broadcast Addr" value={results.broadcastAddress} icon={Network} />
                <div className="md:col-span-2">
                  <ResultItem label="Host Range" value={results.usableHostRange} icon={Info} />
                </div>
                <ResultItem label="Mask" value={results.subnetMask} icon={ShieldCheck} />
                <ResultItem label="Wildcard" value={results.wildcardMask} icon={ShieldCheck} />
                <ResultItem label="Total Hosts" value={results.totalHosts.toLocaleString()} icon={Info} />
                <ResultItem label="Usable Hosts" value={results.usableHosts.toLocaleString()} icon={CheckCircle2} />
                <ResultItem label="Class" value={results.ipClass} icon={Info} />
                <ResultItem label="Type" value={results.ipType} icon={Info} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

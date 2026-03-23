import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Network, AlertTriangle, RefreshCcw, Cpu } from 'lucide-react';
import { 
  isValidIP, 
  getCidrOptions, 
  calculateSubnet, 
  type SubnetResults 
} from '@/lib/subnet-logic';
import { CyberBadge } from '@/components/CyberBadge';
import { ResultRow } from '@/components/ResultRow';
import { cn } from '@/lib/utils';

export default function Home() {
  const [ip, setIp] = useState<string>('192.168.1.0');
  const [cidr, setCidr] = useState<number>(24);
  const [results, setResults] = useState<SubnetResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const cidrOptions = getCidrOptions();

  // Handle enter key to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleCalculate();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [ip, cidr]);

  const handleCalculate = () => {
    if (!ip) {
      setError('IP Address is required');
      setResults(null);
      return;
    }

    if (!isValidIP(ip)) {
      setError('Invalid IP address format');
      setResults(null);
      return;
    }

    setError(null);
    setIsCalculating(true);
    
    // Simulate a brief calculation delay for cyber aesthetic effect
    setTimeout(() => {
      const res = calculateSubnet(ip, cidr);
      setResults(res);
      setIsCalculating(false);
    }, 400);
  };

  const handleClear = () => {
    setIp('');
    setCidr(24);
    setResults(null);
    setError(null);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 cyber-bg opacity-30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#000_100%)]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-panel rounded-2xl w-full max-w-2xl relative z-10 overflow-hidden"
      >
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-70"></div>
        
        <div className="p-6 sm:p-8 lg:p-10">
          
          {/* Header Section */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,255,159,0.15)]">
              <Terminal className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl neon-text mb-2 tracking-tight">AI Subnet Tool</h1>
            <p className="text-muted-foreground font-mono text-sm sm:text-base flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 opacity-70" />
              Advanced Network Analysis Terminal
            </p>
          </div>

          {/* Input Section */}
          <div className="space-y-6 bg-black/40 p-6 rounded-xl border border-white/5 mb-8">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-mono text-primary/80 uppercase tracking-wider font-bold pl-1">Target IP Address</label>
                <div className="relative">
                  <Network className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={ip}
                    onChange={(e) => {
                      setIp(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="192.168.1.0"
                    className={cn(
                      "w-full bg-input/40 border border-input rounded-lg py-3 pl-10 pr-4 text-foreground font-mono placeholder:text-muted-foreground transition-all duration-300",
                      error ? "neon-border-error" : "neon-border-focus"
                    )}
                  />
                </div>
                <AnimatePresence>
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }}
                      className="text-destructive text-xs font-mono mt-1 pl-1 flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3 h-3" /> {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="sm:col-span-1 space-y-2">
                <label className="text-xs font-mono text-primary/80 uppercase tracking-wider font-bold pl-1">Subnet / CIDR</label>
                <select
                  value={cidr}
                  onChange={(e) => setCidr(Number(e.target.value))}
                  className="w-full bg-input/40 border border-input rounded-lg py-3 px-4 text-foreground font-mono neon-border-focus appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2300ff9f' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: `right 0.5rem center`,
                    backgroundRepeat: `no-repeat`,
                    backgroundSize: `1.5em 1.5em`
                  }}
                >
                  {cidrOptions.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-black text-foreground">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button 
                onClick={handleCalculate}
                disabled={isCalculating}
                className="flex-1 neon-button py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isCalculating ? (
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                ) : (
                  <Cpu className="w-5 h-5 group-hover:scale-110 transition-transform" />
                )}
                {isCalculating ? 'Processing...' : 'Execute Analysis'}
              </button>
              <button 
                onClick={handleClear}
                className="sm:w-32 neon-button-outline py-3.5 px-6 rounded-lg flex items-center justify-center gap-2"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Results Section */}
          <AnimatePresence mode="wait">
            {results && !isCalculating && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "backOut" }}
                className="overflow-hidden"
              >
                <div className="border border-primary/30 bg-primary/[0.02] rounded-xl p-6 relative shadow-[inset_0_0_20px_rgba(0,255,159,0.05)]">
                  
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"></div>

                  <div className="flex items-center gap-2 mb-6 border-b border-primary/20 pb-4">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#00ff9f]"></div>
                    <h3 className="font-mono text-lg text-primary uppercase tracking-widest font-bold">Analysis Complete</h3>
                  </div>

                  <div className="space-y-1">
                    <ResultRow 
                      label="Network Address" 
                      value={<span className="text-primary/90">{results.networkAddress}</span>} 
                      delay={0.1}
                    />
                    <ResultRow 
                      label="Broadcast Address" 
                      value={<span className="text-primary/90">{results.broadcastAddress}</span>} 
                      delay={0.15}
                    />
                    <ResultRow 
                      label="Subnet Mask" 
                      value={<span className="text-primary/90">{results.subnetMask}</span>} 
                      delay={0.2}
                    />
                    <ResultRow 
                      label="Usable Host Range" 
                      value={
                        results.totalHosts > 0 
                          ? <span className="text-foreground/90">{results.firstHost} <span className="text-muted-foreground px-1">—</span> {results.lastHost}</span>
                          : <span className="text-muted-foreground italic">N/A</span>
                      } 
                      delay={0.25}
                    />
                    <ResultRow 
                      label="Total Usable Hosts" 
                      value={<span className="text-primary font-bold">{results.totalHosts.toLocaleString()}</span>} 
                      delay={0.3}
                    />
                    <ResultRow 
                      label="Network Characteristics" 
                      value={
                        <div className="flex items-center flex-wrap gap-2 justify-end mt-2 sm:mt-0">
                          <CyberBadge label={`Class ${results.ipClass}`} />
                          <CyberBadge label={results.ipType} />
                          <CyberBadge label={`Risk: ${results.riskLevel}`} riskLevel={results.riskLevel} />
                        </div>
                      } 
                      delay={0.35}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>

      {/* Footer */}
      <div className="fixed bottom-4 left-0 w-full text-center z-0">
        <p className="text-primary/40 font-mono text-xs uppercase tracking-[0.2em]">
          Designed for Secure Network Analysis
        </p>
      </div>
    </div>
  );
}

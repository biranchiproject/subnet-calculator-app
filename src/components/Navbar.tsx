import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ShieldCheck } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/60 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {!isHome && (
            <Link
              to="/"
              className="flex items-center gap-1 text-secondary hover:text-neon-blue transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-wider">Back</span>
            </Link>
          )}
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 bg-neon-blue/10 rounded-xl border border-neon-blue/20">
              <ShieldCheck className="w-5 h-5 text-neon-blue" />
            </div>
            <h1 className="text-lg font-black tracking-tight text-white uppercase">
              Subnet <span className="text-neon-blue">Calculator</span>
            </h1>
          </Link>
        </div>

        <div className="flex items-center gap-8">
          <Link to="/ipv4" className={`text-xs font-black tracking-[0.2em] uppercase transition-all ${location.pathname === '/ipv4' ? 'text-neon-blue neon-text-blue' : 'text-secondary hover:text-white'}`}>
            IPv4
          </Link>
          <Link to="/ipv6" className={`text-xs font-black tracking-[0.2em] uppercase transition-all ${location.pathname === '/ipv6' ? 'text-neon-purple neon-text-purple' : 'text-secondary hover:text-white'}`}>
            IPv6
          </Link>
        </div>
      </div>
    </nav>
  );
};

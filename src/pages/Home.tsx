import React from 'react';
import { Link } from 'react-router-dom';
import { Network, Globe2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const NeonCard = ({
  title,
  description,
  icon: Icon,
  to,
  colorClass,
  glowClass,
  textColorClass,
  delay
}: {
  title: string,
  description: string,
  icon: any,
  to: string,
  colorClass: string,
  glowClass: string,
  textColorClass: string,
  delay: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    className={`glass-card p-10 relative group border-2 ${glowClass} hover:scale-[1.02] transition-all duration-500`}
  >
    {/* Large Background Icon */}
    <div className="absolute top-0 right-0 p-2 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 pointer-events-none">
      <Icon className={`w-48 h-48 -mr-12 -mt-12 ${textColorClass}`} />
    </div>

    <div className="relative z-10 flex flex-col h-full">
      <div className={`w-12 h-12 ${colorClass}/20 rounded-xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 border border-${colorClass}/30`}>
        <Icon className={`w-6 h-6 ${textColorClass}`} />
      </div>

      <h2 className={`text-3xl font-bold mb-4 tracking-tight`}>{title}</h2>
      <p className="text-secondary text-base mb-12 leading-relaxed font-medium">
        {description}
      </p>

      <Link to={to} className={`mt-auto inline-flex items-center gap-2 font-bold ${textColorClass} hover:opacity-80 transition-opacity group/link`}>
        Open
        <ArrowRight className="w-5 h-5 group-hover/link:translate-x-2 transition-transform duration-300" />
      </Link>
    </div>
  </motion.div>
);

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)] relative flex flex-col items-center justify-center px-6 py-12 overflow-hidden bg-dark-bg">
      {/* Background radial glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-neon-blue/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-neon-purple/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-24 relative z-10"
      >
        <h1 className="text-6xl md:text-8xl font-black flex flex-col md:flex-row items-center justify-center gap-x-6 tracking-tighter">
          <span className="text-neon-blue neon-text-blue">Brog</span>
          <span className="text-neon-purple neon-text-purple">Creativity</span>
        </h1>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-10 w-full max-w-6xl relative z-10">
        <NeonCard
          title="IPv4 Calculator"
          description="Analyze class-based and classless IPv4 networks. Get precise masks, ranges, and binary representations."
          icon={Network}
          to="/ipv4"
          colorClass="bg-neon-blue"
          glowClass="neon-glow-blue animate-neon-blue"
          textColorClass="text-neon-blue"
          delay={0.2}
        />
        <NeonCard
          title="IPv6 Calculator"
          description="Configure next-generation IPv6 prefixes and address spaces. Compliant with RFC 4291 standards."
          icon={Globe2}
          to="/ipv6"
          colorClass="bg-neon-purple"
          glowClass="neon-glow-purple animate-neon-purple"
          textColorClass="text-neon-purple"
          delay={0.4}
        />
      </div>

      <footer className="mt-20 opacity-20 text-[10px] font-bold tracking-[0.4em] uppercase text-white/50">
        Network Authority x Design
      </footer>
    </div>
  );
}

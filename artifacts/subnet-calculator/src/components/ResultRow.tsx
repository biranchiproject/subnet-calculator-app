import React from 'react';
import { motion } from 'framer-motion';

interface ResultRowProps {
  label: string;
  value: React.ReactNode;
  delay?: number;
}

export function ResultRow({ label, value, delay = 0 }: ResultRowProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-white/5 last:border-0 group hover:bg-white/[0.02] px-2 rounded transition-colors"
    >
      <span className="text-muted-foreground font-mono text-sm group-hover:text-primary/70 transition-colors">
        {label}
      </span>
      <span className="font-mono text-foreground font-medium mt-1 sm:mt-0 drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]">
        {value}
      </span>
    </motion.div>
  );
}

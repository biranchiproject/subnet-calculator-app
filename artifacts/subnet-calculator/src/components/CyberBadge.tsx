import React from 'react';
import { cn } from '@/lib/utils';
import { type RiskLevel } from '@/lib/subnet-logic';

interface CyberBadgeProps {
  label: string;
  variant?: 'default' | 'danger' | 'warning' | 'safe';
  riskLevel?: RiskLevel; // Auto-sets variant based on risk
  className?: string;
}

export function CyberBadge({ label, variant = 'default', riskLevel, className }: CyberBadgeProps) {
  
  let finalVariant = variant;
  
  if (riskLevel) {
    if (riskLevel === 'Low') finalVariant = 'safe';
    else if (riskLevel === 'Medium') finalVariant = 'warning';
    else if (riskLevel === 'High') finalVariant = 'danger';
  }

  return (
    <span className={cn(
      "px-2.5 py-0.5 text-xs font-mono uppercase tracking-wider font-bold rounded-sm border inline-flex items-center gap-1.5",
      {
        'bg-primary/10 text-primary border-primary/50 shadow-[0_0_10px_rgba(0,255,159,0.2)]': finalVariant === 'default',
        'bg-safe/10 text-safe border-safe/50 shadow-[0_0_10px_rgba(0,255,159,0.2)]': finalVariant === 'safe',
        'bg-warning/10 text-warning border-warning/50 shadow-[0_0_10px_rgba(255,170,0,0.2)]': finalVariant === 'warning',
        'bg-destructive/10 text-destructive border-destructive/50 shadow-[0_0_10px_rgba(255,0,0,0.2)]': finalVariant === 'danger',
      },
      className
    )}>
      {/* Decorative dot */}
      <span className={cn("w-1.5 h-1.5 rounded-full", {
        'bg-primary shadow-[0_0_5px_rgba(0,255,159,0.8)]': finalVariant === 'default' || finalVariant === 'safe',
        'bg-warning shadow-[0_0_5px_rgba(255,170,0,0.8)]': finalVariant === 'warning',
        'bg-destructive shadow-[0_0_5px_rgba(255,0,0,0.8)]': finalVariant === 'danger',
      })} />
      {label}
    </span>
  );
}

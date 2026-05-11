import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function ChartCard({ title, subtitle, actions, children, className, noPadding }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('rounded-xl border border-border bg-card', className)}
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className={cn(noPadding ? '' : 'p-5')}>{children}</div>
    </motion.div>
  );
}

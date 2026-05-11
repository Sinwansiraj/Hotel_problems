import { motion } from 'framer-motion';
import { cn, formatCurrency, formatPercent, formatCompact } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { KPIMetric } from '@/types';

interface KPICardProps {
  metric: KPIMetric;
  index?: number;
}

export function KPICard({ metric, index = 0 }: KPICardProps) {
  const { label, value, change, trend, format } = metric;

  const formattedValue = (() => {
    if (typeof value === 'string') return value;
    switch (format) {
      case 'currency': return formatCurrency(value);
      case 'percent': return formatPercent(value);
      case 'compact': return formatCompact(value);
      default: return value.toLocaleString('en-IN');
    }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow"
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <div className="mt-2 flex items-end justify-between">
        <p className="text-2xl font-bold text-foreground">{formattedValue}</p>
        {change !== undefined && (
          <div className={cn('flex items-center gap-1 text-xs font-semibold',
            trend === 'up' && change > 0 && 'text-green-600 dark:text-green-400',
            trend === 'up' && change < 0 && 'text-red-500',
            trend === 'down' && change < 0 && 'text-green-600 dark:text-green-400',
            trend === 'down' && change > 0 && 'text-red-500',
            trend === 'flat' && 'text-muted-foreground'
          )}>
            {trend === 'up' ? <TrendingUp size={14} /> : trend === 'down' ? <TrendingDown size={14} /> : <Minus size={14} />}
            {change > 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
    </motion.div>
  );
}

/** Grid of KPI cards */
export function KPIGrid({ metrics, columns = 4 }: { metrics: KPIMetric[]; columns?: number }) {
  return (
    <div className={cn('grid gap-4', `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns}`)}>
      {metrics.map((m, i) => (
        <KPICard key={m.label} metric={m} index={i} />
      ))}
    </div>
  );
}

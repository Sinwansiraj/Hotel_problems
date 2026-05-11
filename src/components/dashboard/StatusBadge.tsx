import { cn } from '@/lib/utils';

type Status = 'healthy' | 'degraded' | 'offline' | 'ok' | 'low' | 'critical' | 'overstock' |
  'high' | 'medium' | 'active' | 'maintenance' | 'positive' | 'negative' | 'neutral';

const statusStyles: Record<string, string> = {
  healthy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  ok: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  positive: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  degraded: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  low: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  maintenance: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  neutral: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  offline: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  negative: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  overstock: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

interface StatusBadgeProps {
  status: Status;
  label?: string;
  dot?: boolean;
  className?: string;
}

export function StatusBadge({ status, label, dot = true, className }: StatusBadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize', statusStyles[status] || statusStyles.neutral, className)}>
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', status === 'healthy' || status === 'active' || status === 'ok' || status === 'positive' ? 'bg-green-500 animate-pulse_dot' : 'bg-current')} />}
      {label || status}
    </span>
  );
}

import { cn } from '@/lib/utils';

interface ConfidenceGaugeProps {
  value: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ConfidenceGauge({ value, label, size = 'md' }: ConfidenceGaugeProps) {
  const radius = size === 'sm' ? 28 : size === 'md' ? 40 : 52;
  const stroke = size === 'sm' ? 4 : size === 'md' ? 5 : 6;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;
  const svgSize = (radius + stroke) * 2;
  const color = value >= 90 ? 'text-green-500' : value >= 75 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={svgSize} height={svgSize} className="-rotate-90">
        <circle cx={radius + stroke} cy={radius + stroke} r={radius} fill="none"
          className="stroke-muted" strokeWidth={stroke} />
        <circle cx={radius + stroke} cy={radius + stroke} r={radius} fill="none"
          className={cn('transition-all duration-700', color)} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={circumference - progress}
          strokeLinecap="round" />
      </svg>
      <span className={cn('font-bold', size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-2xl', color)}>
        {value.toFixed(1)}%
      </span>
      {label && <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</span>}
    </div>
  );
}

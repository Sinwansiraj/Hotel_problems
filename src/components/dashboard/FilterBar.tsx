import { cn } from '@/lib/utils';

interface FilterOption { value: string; label: string; }

interface FilterBarProps {
  filters: { key: string; label: string; options: FilterOption[]; value: string; onChange: (v: string) => void }[];
  className?: string;
}

export function FilterBar({ filters, className }: FilterBarProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {filters.map((f) => (
        <div key={f.key} className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground">{f.label}</label>
          <select
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
            className="h-8 rounded-lg border border-input bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

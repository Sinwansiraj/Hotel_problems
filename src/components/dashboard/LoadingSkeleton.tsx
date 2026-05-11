import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} />;
}

export function KPISkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-5">
          <Skeleton className="h-3 w-24 mb-3" />
          <Skeleton className="h-8 w-32" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton({ height = 'h-72' }: { height?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="p-5">
        <Skeleton className={cn('w-full', height)} />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4"><Skeleton className="h-4 w-40" /></div>
      <div className="p-4 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';
import { Activity, Clock, Zap, AlertTriangle } from 'lucide-react';
import type { MLModel } from '@/types';

export function ModelHealthCard({ model }: { model: MLModel }) {
  const driftWarning = model.featureDrift > 0.03;

  return (
    <div className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-foreground">{model.name}</h4>
          <p className="text-xs text-muted-foreground">{model.domain} · {model.version}</p>
        </div>
        <StatusBadge status={model.status} />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="flex items-center gap-2 text-xs">
          <Activity size={13} className="text-muted-foreground" />
          <span className="text-muted-foreground">Accuracy</span>
          <span className="ml-auto font-semibold">{model.accuracy}%</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Clock size={13} className="text-muted-foreground" />
          <span className="text-muted-foreground">Latency</span>
          <span className="ml-auto font-semibold">{model.latencyMs}ms</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Zap size={13} className="text-muted-foreground" />
          <span className="text-muted-foreground">Today</span>
          <span className="ml-auto font-semibold">{model.predictionsToday.toLocaleString()}</span>
        </div>
        <div className={cn('flex items-center gap-2 text-xs', driftWarning && 'text-orange-600 dark:text-orange-400')}>
          <AlertTriangle size={13} />
          <span>Drift</span>
          <span className="ml-auto font-semibold">{(model.featureDrift * 100).toFixed(1)}%</span>
        </div>
      </div>

      {/* Accuracy bar */}
      <div className="mt-3">
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', model.accuracy >= 90 ? 'bg-green-500' : model.accuracy >= 85 ? 'bg-yellow-500' : 'bg-red-500')}
            style={{ width: `${model.accuracy}%` }}
          />
        </div>
      </div>
    </div>
  );
}

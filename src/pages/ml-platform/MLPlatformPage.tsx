import { PageHeader, ChartCard, KPIGrid } from '@/components/dashboard';
import { ModelHealthCard } from '@/components/dashboard/ModelHealthCard';
import { useMLModels } from '@/services/hooks';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import type { KPIMetric } from '@/types';

export function MLPlatformPage() {
  const { data: models } = useMLModels();

  const mlKPIs: KPIMetric[] = [
    { label: 'Active Models', value: models?.filter(m => m.status !== 'offline').length || 0, format: 'number', trend: 'flat' },
    { label: 'Avg Accuracy', value: models ? Math.round(models.reduce((s, m) => s + m.accuracy, 0) / models.length * 10) / 10 : 0, format: 'percent', trend: 'up' },
    { label: 'Total Predictions Today', value: models?.reduce((s, m) => s + m.predictionsToday, 0) || 0, format: 'compact', trend: 'up' },
    { label: 'Drift Alerts', value: models?.filter(m => m.featureDrift > 0.03).length || 0, format: 'number', trend: 'flat' },
  ];

  const accuracyData = models?.map(m => ({
    name: m.name.replace(' ', '\n'),
    accuracy: m.accuracy,
    status: m.status,
  }));

  const latencyData = models?.filter(m => m.status !== 'offline').map(m => ({
    name: m.name,
    latency: m.latencyMs,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="ML Model Monitoring"
        subtitle="Real-time health, accuracy, drift, and inference monitoring for all deployed models"
        breadcrumb={['HotelML', 'ML Platform', 'Model Monitoring']}
        actions={
          <div className="flex gap-2">
            <button className="h-9 rounded-lg border border-input bg-background px-4 text-sm font-medium hover:bg-accent transition-colors">
              Retrain All
            </button>
            <button className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
              Deploy New Model
            </button>
          </div>
        }
      />

      <KPIGrid metrics={mlKPIs} columns={4} />

      {/* Model Cards Grid */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Model Registry</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {models?.map(m => <ModelHealthCard key={m.modelId} model={m} />)}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Accuracy Comparison */}
        <ChartCard title="Model Accuracy Comparison" subtitle="Current accuracy across all models">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={accuracyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} angle={-20} interval={0} height={60} />
              <YAxis domain={[75, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="accuracy" name="Accuracy %" radius={[4, 4, 0, 0]}>
                {accuracyData?.map((d, i) => (
                  <Cell key={i} fill={d.accuracy >= 90 ? 'hsl(160,60%,45%)' : d.accuracy >= 85 ? 'hsl(30,80%,55%)' : 'hsl(0,70%,55%)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Latency Monitor */}
        <ChartCard title="Inference Latency" subtitle="P50 latency in milliseconds per model">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={latencyData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={130} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} formatter={(v: number) => [`${v}ms`, 'Latency']} />
              <Bar dataKey="latency" name="Latency (ms)" fill="hsl(221,83%,53%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Feature Drift Monitor */}
      <ChartCard title="Feature Drift Monitor" subtitle="Drift scores across all models — threshold: 3%">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {models?.map(m => (
            <div key={m.modelId} className="rounded-lg border border-border p-4">
              <p className="text-xs font-medium text-muted-foreground mb-1">{m.name}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${m.featureDrift > 0.05 ? 'bg-red-500' : m.featureDrift > 0.03 ? 'bg-orange-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(m.featureDrift * 1000, 100)}%` }}
                  />
                </div>
                <span className={`text-xs font-bold ${m.featureDrift > 0.03 ? 'text-orange-500' : 'text-green-600'}`}>
                  {(m.featureDrift * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">Last trained: {m.lastTrained}</p>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}

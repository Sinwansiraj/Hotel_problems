import { PageHeader, KPIGrid, ChartCard, KPISkeleton, ChartSkeleton } from '@/components/dashboard';
import { useExecutiveKPIs, useRevenueTrend, useChannelMix, useSegmentMix, useOccupancyByDow, useMLModels } from '@/services/hooks';
import { ModelHealthCard } from '@/components/dashboard/ModelHealthCard';
import { formatCurrency } from '@/lib/utils';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['hsl(221,83%,53%)', 'hsl(160,60%,45%)', 'hsl(30,80%,55%)', 'hsl(280,65%,60%)', 'hsl(340,75%,55%)', 'hsl(200,70%,50%)'];

export function ExecutiveDashboard() {
  const { data: kpis, isLoading: kpisLoading } = useExecutiveKPIs();
  const { data: revenue, isLoading: revLoading } = useRevenueTrend();
  const { data: channels } = useChannelMix();
  const { data: segments } = useSegmentMix();
  const { data: dowData } = useOccupancyByDow();
  const { data: models } = useMLModels();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Dashboard"
        subtitle="Unified operational intelligence across all properties"
        breadcrumb={['HotelML', 'Executive Dashboard']}
        actions={
          <div className="flex items-center gap-2">
            <select className="h-9 rounded-lg border border-input bg-background px-3 text-sm">
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>Year to Date</option>
              <option>Last 12 Months</option>
            </select>
            <button className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              Export Report
            </button>
          </div>
        }
      />

      {/* KPI Strip */}
      {kpisLoading ? <KPISkeleton /> : kpis && <KPIGrid metrics={kpis} columns={4} />}

      {/* Revenue Trend + Channel Mix */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Revenue & Occupancy Trend" subtitle="Monthly performance over 12 months" className="lg:col-span-2">
          {revLoading ? <div className="h-72 animate-pulse bg-muted rounded" /> : (
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis yAxisId="left" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} className="text-xs" />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `${v}%`} className="text-xs" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(value: number, name: string) => {
                    if (name === 'revenue') return [formatCurrency(value), 'Revenue'];
                    if (name === 'occupancy') return [`${value}%`, 'Occupancy'];
                    return [value, name];
                  }}
                />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.15} strokeWidth={2} name="revenue" />
                <Area yAxisId="right" type="monotone" dataKey="occupancy" stroke={COLORS[1]} fill={COLORS[1]} fillOpacity={0.1} strokeWidth={2} name="occupancy" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Channel Distribution" subtitle="Booking source breakdown">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={channels} cx="50%" cy="45%" outerRadius={90} innerRadius={55} paddingAngle={3} dataKey="value" nameKey="name" label={({ name, value }) => `${value}%`} labelLine={false}>
                {channels?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />) }
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Occupancy by Day + Segment Mix */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Occupancy by Day of Week" subtitle="Average occupancy distribution">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dowData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="occupancy" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Guest Segment Mix" subtitle="Revenue contribution by traveller type">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={segments} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} width={80} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {segments?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />) }
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ML Model Health Grid */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">ML Model Health</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {models?.map((m) => <ModelHealthCard key={m.modelId} model={m} />)}
        </div>
      </div>
    </div>
  );
}

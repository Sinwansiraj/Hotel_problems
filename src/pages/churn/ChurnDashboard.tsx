import { PageHeader, ChartCard, KPIGrid, DataTable } from '@/components/dashboard';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { useChurnScores, useRFMSegments } from '@/services/hooks';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell
} from 'recharts';
import type { KPIMetric, GuestChurnScore, RFMSegment } from '@/types';

const COLORS = ['hsl(221,83%,53%)', 'hsl(160,60%,45%)', 'hsl(30,80%,55%)', 'hsl(280,65%,60%)', 'hsl(340,75%,55%)', 'hsl(0,70%,55%)'];

export function ChurnDashboard() {
  const { data: churnData } = useChurnScores();
  const { data: rfmData } = useRFMSegments();

  const churnKPIs: KPIMetric[] = [
    { label: 'Overall Churn Rate', value: 23.1, format: 'percent', change: -2.4, trend: 'down' },
    { label: 'High-Risk Guests', value: 38, format: 'number', change: 5, trend: 'up' },
    { label: 'Revenue at Risk', value: 4850000, format: 'currency', trend: 'up' },
    { label: 'Retention Rate (90d)', value: 76.9, format: 'percent', change: 2.4, trend: 'up' },
  ];

  const churnColumns = [
    { key: 'guestName', header: 'Guest', render: (r: GuestChurnScore) => (
      <div>
        <p className="font-medium">{r.guestName}</p>
        <p className="text-xs text-muted-foreground">{r.segment}</p>
      </div>
    )},
    { key: 'churnProbability', header: 'Churn Risk', render: (r: GuestChurnScore) => (
      <div className="flex items-center gap-2">
        <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
          <div className={`h-full rounded-full ${r.churnProbability >= 0.7 ? 'bg-red-500' : r.churnProbability >= 0.4 ? 'bg-yellow-500' : 'bg-green-500'}`}
            style={{ width: `${r.churnProbability * 100}%` }} />
        </div>
        <span className="text-xs font-semibold">{(r.churnProbability * 100).toFixed(0)}%</span>
      </div>
    )},
    { key: 'riskLevel', header: 'Level', render: (r: GuestChurnScore) => <StatusBadge status={r.riskLevel} /> },
    { key: 'lifetimeValue', header: 'CLV', render: (r: GuestChurnScore) => formatCurrency(r.lifetimeValue) },
    { key: 'totalStays', header: 'Stays', render: (r: GuestChurnScore) => r.totalStays },
    { key: 'lastStayDate', header: 'Last Stay', render: (r: GuestChurnScore) => r.lastStayDate },
    { key: 'topChurnDrivers', header: 'Top Drivers', render: (r: GuestChurnScore) => (
      <div className="flex flex-wrap gap-1 max-w-xs">
        {r.topChurnDrivers.slice(0, 2).map((d) => (
          <span key={d} className="inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{d}</span>
        ))}
      </div>
    ), className: 'max-w-[240px]' },
  ];

  const rfmColumns = [
    { key: 'segment', header: 'Segment', render: (r: RFMSegment) => <span className="font-medium">{r.segment}</span> },
    { key: 'count', header: 'Guests', render: (r: RFMSegment) => r.count.toLocaleString() },
    { key: 'avgLifetimeValue', header: 'Avg CLV', render: (r: RFMSegment) => formatCurrency(r.avgLifetimeValue) },
    { key: 'avgRecency', header: 'Recency (days)', render: (r: RFMSegment) => r.avgRecency },
    { key: 'avgFrequency', header: 'Frequency', render: (r: RFMSegment) => r.avgFrequency },
    { key: 'churnRate', header: 'Churn Rate', render: (r: RFMSegment) => (
      <StatusBadge status={r.churnRate > 50 ? 'critical' : r.churnRate > 25 ? 'medium' : 'healthy'} label={`${r.churnRate}%`} dot={false} />
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Churn & Retention Intelligence"
        subtitle="Predictive guest churn analysis with RFM segmentation and retention campaign tracking"
        breadcrumb={['HotelML', 'Guest Intelligence', 'Churn & Retention']}
        actions={
          <button className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
            Launch Retention Campaign
          </button>
        }
      />

      <KPIGrid metrics={churnKPIs} columns={4} />

      {/* Churn Risk Table */}
      <ChartCard title="High-Risk Guest Monitor" subtitle="Guests ranked by predicted churn probability" noPadding>
        <DataTable columns={churnColumns} data={churnData || []} keyExtractor={(r) => r.guestId} />
      </ChartCard>

      {/* RFM Visualization + Table */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="RFM Segment Distribution" subtitle="Guest count by loyalty segment">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rfmData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="segment" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} angle={-15} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Legend />
              <Bar dataKey="count" name="Guest Count" radius={[4, 4, 0, 0]}>
                {rfmData?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />) }
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Churn Rate by Segment" subtitle="Percentage of guests churned in last 12 months">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rfmData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="segment" width={110} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="churnRate" name="Churn %" radius={[0, 4, 4, 0]}>
                {rfmData?.map((r, i) => <Cell key={i} fill={r.churnRate > 50 ? 'hsl(0,70%,55%)' : r.churnRate > 25 ? 'hsl(30,80%,55%)' : 'hsl(160,60%,45%)'} />) }
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* RFM Table */}
      <ChartCard title="RFM Segment Analysis" subtitle="Detailed segment metrics for retention targeting" noPadding>
        <DataTable columns={rfmColumns} data={rfmData || []} keyExtractor={(r) => r.segment} />
      </ChartCard>
    </div>
  );
}

import { PageHeader, ChartCard, KPIGrid, DataTable } from '@/components/dashboard';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { usePriceRecommendations, useCompetitorRates, useBookingPace } from '@/services/hooks';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import type { KPIMetric, PriceRecommendation, CompetitorRate } from '@/types';

export function PricingDashboard() {
  const { data: recommendations } = usePriceRecommendations();
  const { data: competitors } = useCompetitorRates();
  const { data: pace } = useBookingPace();

  const pricingKPIs: KPIMetric[] = [
    { label: 'Current ADR', value: 6850, format: 'currency', change: 5.1, trend: 'up' },
    { label: 'Recommended ADR', value: 7450, format: 'currency', change: 8.8, trend: 'up' },
    { label: 'Revenue Uplift Potential', value: 12.4, format: 'percent', trend: 'up' },
    { label: 'Price Competitiveness', value: 88, format: 'percent', trend: 'flat' },
  ];

  const recColumns = [
    { key: 'roomType', header: 'Room Type', render: (r: PriceRecommendation) => <span className="font-medium">{r.roomType}</span> },
    { key: 'currentRate', header: 'Current Rate', render: (r: PriceRecommendation) => formatCurrency(r.currentRate) },
    { key: 'recommendedRate', header: 'Recommended', render: (r: PriceRecommendation) => (
      <span className="font-semibold text-primary">{formatCurrency(r.recommendedRate)}</span>
    )},
    { key: 'competitorAvgRate', header: 'Comp. Avg', render: (r: PriceRecommendation) => formatCurrency(r.competitorAvgRate) },
    { key: 'demandScore', header: 'Demand', render: (r: PriceRecommendation) => (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-12 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-primary" style={{ width: `${r.demandScore}%` }} />
        </div>
        <span className="text-xs">{r.demandScore}</span>
      </div>
    )},
    { key: 'confidenceScore', header: 'Confidence', render: (r: PriceRecommendation) => (
      <StatusBadge status={r.confidenceScore >= 90 ? 'healthy' : r.confidenceScore >= 80 ? 'medium' : 'low'} label={`${r.confidenceScore}%`} dot={false} />
    )},
  ];

  const compColumns = [
    { key: 'competitorName', header: 'Competitor', render: (r: CompetitorRate) => <span className="font-medium">{r.competitorName}</span> },
    { key: 'standardRate', header: 'Standard', render: (r: CompetitorRate) => formatCurrency(r.standardRate) },
    { key: 'deluxeRate', header: 'Deluxe', render: (r: CompetitorRate) => formatCurrency(r.deluxeRate) },
    { key: 'suiteRate', header: 'Suite', render: (r: CompetitorRate) => formatCurrency(r.suiteRate) },
    { key: 'availability', header: 'Availability', render: (r: CompetitorRate) => <StatusBadge status={r.availability === 'sold_out' ? 'critical' : r.availability} label={r.availability.replace('_', ' ')} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dynamic Pricing Engine"
        subtitle="ML-optimized rate recommendations based on demand, competition, and elasticity signals"
        breadcrumb={['HotelML', 'Revenue Intelligence', 'Dynamic Pricing']}
        actions={
          <button className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
            Apply All Recommendations
          </button>
        }
      />

      <KPIGrid metrics={pricingKPIs} columns={4} />

      {/* Price Recommendations Table */}
      <ChartCard title="Price Recommendations" subtitle="AI-generated optimal rates for today" noPadding>
        <DataTable columns={recColumns} data={recommendations || []} keyExtractor={(r) => r.roomType} />
      </ChartCard>

      {/* Booking Pace + Competitor Comparison */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Booking Pace Analysis" subtitle="Pickup comparison: this year vs last year vs optimal">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={pace}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} interval={4} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Legend />
              <Line type="monotone" dataKey="thisYear" stroke="hsl(221,83%,53%)" strokeWidth={2} dot={false} name="This Year" />
              <Line type="monotone" dataKey="lastYear" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Last Year" />
              <Line type="monotone" dataKey="optimal" stroke="hsl(160,60%,45%)" strokeWidth={2} dot={false} name="Optimal Pace" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Rate Position vs Competitors" subtitle="Current rates comparison">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={competitors} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="competitorName" width={100} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} formatter={(v: number) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="standardRate" fill="hsl(221,83%,53%)" radius={[0, 3, 3, 0]} name="Standard" />
              <Bar dataKey="deluxeRate" fill="hsl(160,60%,45%)" radius={[0, 3, 3, 0]} name="Deluxe" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Competitor Table */}
      <ChartCard title="Competitor Rate Intelligence" subtitle="Live rate scraping from OTA platforms" noPadding>
        <DataTable columns={compColumns} data={competitors || []} keyExtractor={(r) => r.competitorName} />
      </ChartCard>
    </div>
  );
}

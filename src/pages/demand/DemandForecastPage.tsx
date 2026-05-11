import { PageHeader, ChartCard, KPIGrid } from '@/components/dashboard';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { ConfidenceGauge } from '@/components/dashboard/ConfidenceGauge';
import { useDemandForecast, useEventImpacts } from '@/services/hooks';
import { formatPercent } from '@/lib/utils';
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import type { KPIMetric } from '@/types';

export function DemandForecastPage() {
  const { data: forecast, isLoading } = useDemandForecast();
  const { data: events } = useEventImpacts();

  const forecastKPIs: KPIMetric[] = [
    { label: 'Avg Forecast (7d)', value: 82.3, format: 'percent', change: 4.1, trend: 'up' },
    { label: 'Avg Forecast (30d)', value: 74.6, format: 'percent', change: 2.8, trend: 'up' },
    { label: 'Model Confidence', value: 93.1, format: 'percent', trend: 'flat' },
    { label: 'Upcoming Events', value: events?.length || 0, format: 'number', trend: 'flat' },
  ];

  // Chart data: show first 45 days
  const chartData = forecast?.slice(0, 45).map((d) => ({
    date: d.date.slice(5), // MM-DD
    predicted: d.predictedOccupancy,
    actual: d.actualOccupancy || undefined,
    lower: d.lowerBound,
    upper: d.upperBound,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Demand Forecasting"
        subtitle="90-day occupancy prediction with ML confidence intervals"
        breadcrumb={['HotelML', 'Revenue Intelligence', 'Demand Forecasting']}
        actions={
          <div className="flex gap-2">
            <select className="h-9 rounded-lg border border-input bg-background px-3 text-sm">
              <option>All Room Types</option>
              <option>Standard</option>
              <option>Deluxe</option>
              <option>Suite</option>
            </select>
            <button className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
              Refresh Forecast
            </button>
          </div>
        }
      />

      <KPIGrid metrics={forecastKPIs} columns={4} />

      {/* Main Forecast Chart */}
      <ChartCard title="Occupancy Forecast — Next 45 Days" subtitle="Predicted occupancy with 95% confidence interval">
        <ResponsiveContainer width="100%" height={380}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} interval={3} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
            <Legend />
            {/* Confidence band */}
            <Area type="monotone" dataKey="upper" stroke="none" fill="hsl(221,83%,53%)" fillOpacity={0.08} name="Upper Bound" />
            <Area type="monotone" dataKey="lower" stroke="none" fill="hsl(221,83%,53%)" fillOpacity={0.08} name="Lower Bound" />
            {/* Prediction line */}
            <Line type="monotone" dataKey="predicted" stroke="hsl(221,83%,53%)" strokeWidth={2.5} dot={false} name="Predicted" />
            {/* Actual (where available) */}
            <Line type="monotone" dataKey="actual" stroke="hsl(160,60%,45%)" strokeWidth={2} dot={{ r: 3 }} name="Actual" connectNulls={false} />
            {/* Threshold line */}
            <ReferenceLine y={80} stroke="hsl(var(--destructive))" strokeDasharray="5 5" label={{ value: '80% Target', fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Events + Confidence Panel */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Event Impact Table */}
        <ChartCard title="Event Impact Predictions" subtitle="Upcoming events affecting demand" className="lg:col-span-2" noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Event</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Impact</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {events?.map((e) => (
                  <tr key={e.eventName} className="hover:bg-accent/30">
                    <td className="px-5 py-3 font-medium">{e.eventName}</td>
                    <td className="px-5 py-3 text-muted-foreground">{e.eventDate}</td>
                    <td className="px-5 py-3">
                      <StatusBadge
                        status={e.type === 'positive' ? 'positive' : 'negative'}
                        label={`${e.type === 'positive' ? '+' : ''}${e.expectedImpact}%`}
                        dot={false}
                      />
                    </td>
                    <td className="px-5 py-3 font-medium">{e.confidence}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        {/* Model Confidence Panel */}
        <ChartCard title="Forecast Confidence" subtitle="Model prediction reliability">
          <div className="flex flex-col items-center gap-6 py-4">
            <ConfidenceGauge value={93.1} label="Overall Accuracy" size="lg" />
            <div className="w-full space-y-3">
              {[
                { label: '7-day horizon', value: 96.2 },
                { label: '14-day horizon', value: 93.8 },
                { label: '30-day horizon', value: 89.4 },
                { label: '90-day horizon', value: 82.1 },
              ].map((h) => (
                <div key={h.label} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{h.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${h.value}%` }} />
                    </div>
                    <span className="font-semibold w-10 text-right">{h.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

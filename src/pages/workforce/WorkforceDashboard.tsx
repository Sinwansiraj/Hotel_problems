import { PageHeader, ChartCard, KPIGrid, DataTable } from '@/components/dashboard';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { useStaffSchedules, useLabourCostTrend } from '@/services/hooks';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart, Bar, AreaChart, Area, ComposedChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import type { KPIMetric, StaffSchedule } from '@/types';

export function WorkforceDashboard() {
  const { data: schedules } = useStaffSchedules();
  const { data: costTrend } = useLabourCostTrend();

  const wfKPIs: KPIMetric[] = [
    { label: 'Staff Efficiency', value: 87.2, format: 'percent', change: 1.8, trend: 'up' },
    { label: 'Overtime Hours (MTD)', value: 342, format: 'number', change: -8.5, trend: 'down' },
    { label: 'Labour Cost Ratio', value: 34.2, format: 'percent', change: -1.1, trend: 'down' },
    { label: 'Understaffing Incidents', value: 4, format: 'number', change: -2, trend: 'down' },
  ];

  const scheduleColumns = [
    { key: 'department', header: 'Department', render: (r: StaffSchedule) => <span className="font-medium">{r.department}</span> },
    { key: 'requiredStaff', header: 'Required' },
    { key: 'scheduledStaff', header: 'Scheduled' },
    { key: 'actualStaff', header: 'Actual', render: (r: StaffSchedule) => (
      <span className={r.actualStaff < r.requiredStaff ? 'text-red-500 font-semibold' : ''}>{r.actualStaff}</span>
    )},
    { key: 'gap', header: 'Gap', render: (r: StaffSchedule) => {
      const gap = r.actualStaff - r.requiredStaff;
      return <StatusBadge status={gap >= 0 ? 'healthy' : gap >= -2 ? 'medium' : 'critical'} label={`${gap >= 0 ? '+' : ''}${gap}`} dot={false} />;
    }},
    { key: 'overtimeHours', header: 'OT Hours', render: (r: StaffSchedule) => (
      <span className={r.overtimeHours > 5 ? 'text-orange-500 font-medium' : ''}>{r.overtimeHours}h</span>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workforce Planning & Optimization"
        subtitle="ML-driven staff scheduling, labour cost forecasting, and overtime monitoring"
        breadcrumb={['HotelML', 'Operations Intelligence', 'Workforce Planning']}
        actions={
          <button className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
            Generate Optimal Schedule
          </button>
        }
      />

      <KPIGrid metrics={wfKPIs} columns={4} />

      {/* Staff Schedule Table */}
      <ChartCard title="Today's Staff Allocation" subtitle="Current shift staffing levels vs ML-recommended requirements" noPadding>
        <DataTable columns={scheduleColumns} data={schedules || []} keyExtractor={(r) => r.department} />
      </ChartCard>

      {/* Labour Cost Trend */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Labour Cost Breakdown — 12 Month" subtitle="Base, overtime, and contract labour costs">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={costTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} formatter={(v: number) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="baseCost" stackId="a" fill="hsl(221,83%,53%)" name="Base Cost" />
              <Bar dataKey="overtimeCost" stackId="a" fill="hsl(30,80%,55%)" name="Overtime" />
              <Bar dataKey="contractCost" stackId="a" fill="hsl(280,65%,60%)" name="Contract" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Staff Efficiency Trend" subtitle="Efficiency score computed from workload / staffing ratio">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={costTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} domain={[70, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="efficiency" fill="hsl(160,60%,45%)" fillOpacity={0.15} stroke="hsl(160,60%,45%)" strokeWidth={2} name="Efficiency %" />
              <Line type="monotone" dataKey="efficiency" stroke="hsl(160,60%,45%)" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

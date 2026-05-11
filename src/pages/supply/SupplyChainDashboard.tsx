import { PageHeader, ChartCard, KPIGrid, DataTable } from '@/components/dashboard';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { useInventoryItems } from '@/services/hooks';
import { formatPercent } from '@/lib/utils';
import {
  BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import type { KPIMetric, InventoryItem } from '@/types';

export function SupplyChainDashboard() {
  const { data: inventory } = useInventoryItems();

  const supplyKPIs: KPIMetric[] = [
    { label: 'Critical Items', value: inventory?.filter(i => i.status === 'critical').length || 0, format: 'number', trend: 'up' },
    { label: 'Overstock Items', value: inventory?.filter(i => i.status === 'overstock').length || 0, format: 'number', trend: 'flat' },
    { label: 'Avg Waste Rate', value: 5.8, format: 'percent', change: -0.8, trend: 'down' },
    { label: 'Reorder Alerts', value: 3, format: 'number', trend: 'flat' },
  ];

  const invColumns = [
    { key: 'name', header: 'Item', render: (r: InventoryItem) => (
      <div>
        <p className="font-medium">{r.name}</p>
        <p className="text-xs text-muted-foreground">{r.category}</p>
      </div>
    )},
    { key: 'currentStock', header: 'Current', render: (r: InventoryItem) => r.currentStock },
    { key: 'parLevel', header: 'PAR Level', render: (r: InventoryItem) => r.parLevel },
    { key: 'dailyConsumption', header: 'Daily Use', render: (r: InventoryItem) => r.dailyConsumption },
    { key: 'daysUntilStockout', header: 'Days Left', render: (r: InventoryItem) => (
      <span className={r.daysUntilStockout <= 3 ? 'text-red-500 font-bold' : r.daysUntilStockout <= 7 ? 'text-orange-500 font-medium' : ''}>
        {r.daysUntilStockout}
      </span>
    )},
    { key: 'status', header: 'Status', render: (r: InventoryItem) => <StatusBadge status={r.status} /> },
    { key: 'wasteRate', header: 'Waste %', render: (r: InventoryItem) => (
      <span className={r.wasteRate > 10 ? 'text-red-500 font-medium' : ''}>{formatPercent(r.wasteRate)}</span>
    )},
    { key: 'action', header: 'Action', render: (r: InventoryItem) => (
      r.status === 'critical' || r.status === 'low' ? (
        <button className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
          Auto-Reorder
        </button>
      ) : r.status === 'overstock' ? (
        <span className="text-xs text-muted-foreground">Reduce next order</span>
      ) : null
    )},
  ];

  // Waste chart data
  const wasteData = inventory?.map(i => ({
    name: i.name.length > 15 ? i.name.slice(0, 15) + '…' : i.name,
    waste: i.wasteRate,
  })).sort((a, b) => b.waste - a.waste);

  // Stockout prediction chart
  const stockoutData = inventory?.map(i => ({
    name: i.name.length > 15 ? i.name.slice(0, 15) + '…' : i.name,
    daysLeft: i.daysUntilStockout,
    status: i.status,
  })).sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supply Chain & Inventory Intelligence"
        subtitle="ML-powered inventory monitoring, stockout prediction, and automated reorder recommendations"
        breadcrumb={['HotelML', 'Operations Intelligence', 'Supply Chain']}
        actions={
          <button className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
            Run Reorder Optimization
          </button>
        }
      />

      <KPIGrid metrics={supplyKPIs} columns={4} />

      {/* Inventory Table */}
      <ChartCard title="Inventory Monitor" subtitle="Real-time stock levels with ML-predicted stockout dates" noPadding>
        <DataTable columns={invColumns} data={inventory || []} keyExtractor={(r) => r.itemId} />
      </ChartCard>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Stockout Prediction */}
        <ChartCard title="Stockout Risk Timeline" subtitle="Predicted days until stockout by item">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stockoutData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="daysLeft" name="Days Until Stockout" radius={[0, 4, 4, 0]}>
                {stockoutData?.map((d, i) => (
                  <Cell key={i} fill={d.daysLeft <= 3 ? 'hsl(0,70%,55%)' : d.daysLeft <= 7 ? 'hsl(30,80%,55%)' : 'hsl(160,60%,45%)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Waste Analysis */}
        <ChartCard title="Waste Rate Analysis" subtitle="Percentage waste by inventory item">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={wasteData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="waste" name="Waste %" radius={[0, 4, 4, 0]}>
                {wasteData?.map((d, i) => (
                  <Cell key={i} fill={d.waste > 10 ? 'hsl(0,70%,55%)' : d.waste > 5 ? 'hsl(30,80%,55%)' : 'hsl(160,60%,45%)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

import { PageHeader, ChartCard, KPIGrid, DataTable } from '@/components/dashboard';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { useReviewSentiment, useSentimentTrend } from '@/services/hooks';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import type { KPIMetric } from '@/types';

export function ReputationDashboard() {
  const { data: sentiment } = useReviewSentiment();
  const { data: trend } = useSentimentTrend();

  const repKPIs: KPIMetric[] = [
    { label: 'Overall Score', value: 4.2, format: 'number', change: 0.1, trend: 'up' },
    { label: 'Positive Reviews', value: 72, format: 'percent', change: 3.5, trend: 'up' },
    { label: 'Negative Reviews', value: 12, format: 'percent', change: -1.2, trend: 'down' },
    { label: 'Response Rate', value: 94, format: 'percent', change: 2.0, trend: 'up' },
  ];

  // Topic data for chart
  const topicData = sentiment?.flatMap(s => s.topTopics.map(t => ({
    topic: t.topic,
    platform: s.platform,
    sentiment: Math.round(t.sentiment * 100),
    count: t.count,
  })));

  const uniqueTopics = [...new Set(topicData?.map(t => t.topic) || [])];
  const topicChartData = uniqueTopics.map(topic => {
    const items = topicData?.filter(t => t.topic === topic) || [];
    return {
      topic,
      avgSentiment: Math.round(items.reduce((s, i) => s + i.sentiment, 0) / items.length),
      totalMentions: items.reduce((s, i) => s + i.count, 0),
    };
  }).sort((a, b) => b.totalMentions - a.totalMentions);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reputation Management"
        subtitle="AI-powered review sentiment analysis and topic monitoring across all platforms"
        breadcrumb={['HotelML', 'Operations Intelligence', 'Reputation']}
        actions={
          <div className="flex gap-2">
            <select className="h-9 rounded-lg border border-input bg-background px-3 text-sm">
              <option>All Platforms</option>
              <option>Google</option>
              <option>Booking.com</option>
              <option>TripAdvisor</option>
            </select>
          </div>
        }
      />

      <KPIGrid metrics={repKPIs} columns={4} />

      {/* Sentiment Trend */}
      <ChartCard title="Sentiment Trend — 12 Month" subtitle="Positive, neutral, and negative review distribution over time">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
            <Legend />
            <Area type="monotone" dataKey="positive" stackId="1" stroke="hsl(160,60%,45%)" fill="hsl(160,60%,45%)" fillOpacity={0.6} name="Positive" />
            <Area type="monotone" dataKey="neutral" stackId="1" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground))" fillOpacity={0.3} name="Neutral" />
            <Area type="monotone" dataKey="negative" stackId="1" stroke="hsl(0,70%,55%)" fill="hsl(0,70%,55%)" fillOpacity={0.5} name="Negative" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Topic Analysis + Platform Breakdown */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Topic Sentiment Analysis" subtitle="AI-classified review topics with sentiment scores">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topicChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" domain={[-100, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis type="category" dataKey="topic" width={90} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="avgSentiment" name="Sentiment Score" radius={[0, 4, 4, 0]}>
                {topicChartData.map((entry, i) => (
                  <rect key={i} fill={entry.avgSentiment >= 0 ? 'hsl(160,60%,45%)' : 'hsl(0,70%,55%)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Platform Performance" subtitle="Score comparison across review platforms" noPadding>
          <div className="p-5 space-y-4">
            {sentiment?.map((s) => (
              <div key={s.platform} className="flex items-center gap-4">
                <div className="w-24 shrink-0">
                  <p className="text-sm font-medium">{s.platform}</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden flex">
                      <div className="h-full bg-green-500" style={{ width: `${(s.positiveCount / (s.positiveCount + s.neutralCount + s.negativeCount)) * 100}%` }} />
                      <div className="h-full bg-gray-400" style={{ width: `${(s.neutralCount / (s.positiveCount + s.neutralCount + s.negativeCount)) * 100}%` }} />
                      <div className="h-full bg-red-500" style={{ width: `${(s.negativeCount / (s.positiveCount + s.neutralCount + s.negativeCount)) * 100}%` }} />
                    </div>
                    <span className="text-lg font-bold w-10">{s.averageScore}</span>
                  </div>
                  <div className="flex gap-4 mt-1 text-[10px] text-muted-foreground">
                    <span>{s.positiveCount} positive</span>
                    <span>{s.neutralCount} neutral</span>
                    <span>{s.negativeCount} negative</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { PageHeader, ChartCard } from '@/components/dashboard';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { useAuthStore, useThemeStore } from '@/store';
import { Shield, Users, Bell, Database, Globe, Key } from 'lucide-react';

const roles = [
  { role: 'admin', label: 'Administrator', users: 2, permissions: 'Full access to all modules and settings' },
  { role: 'revenue_manager', label: 'Revenue Manager', users: 3, permissions: 'Revenue, Pricing, Demand dashboards' },
  { role: 'operations_manager', label: 'Operations Manager', users: 4, permissions: 'Workforce, Supply Chain, Reputation' },
  { role: 'gm', label: 'General Manager', users: 1, permissions: 'Executive Dashboard, all read-only access' },
  { role: 'analyst', label: 'Data Analyst', users: 5, permissions: 'ML Platform, Feature Store, read-only dashboards' },
  { role: 'viewer', label: 'Viewer', users: 8, permissions: 'Read-only access to assigned dashboards' },
];

const integrations = [
  { name: 'Opera PMS', status: 'active' as const, lastSync: '2 min ago' },
  { name: 'Booking.com API', status: 'active' as const, lastSync: '5 min ago' },
  { name: 'TripAdvisor API', status: 'active' as const, lastSync: '15 min ago' },
  { name: 'Google Reviews API', status: 'active' as const, lastSync: '8 min ago' },
  { name: 'SAP Procurement', status: 'maintenance' as const, lastSync: '2 hours ago' },
  { name: 'Weather API', status: 'active' as const, lastSync: '30 min ago' },
];

export function SettingsPage() {
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'general' | 'roles' | 'integrations' | 'notifications'>('general');

  const tabs = [
    { key: 'general', label: 'General', icon: <Globe size={16} /> },
    { key: 'roles', label: 'Roles & Access', icon: <Shield size={16} /> },
    { key: 'integrations', label: 'Integrations', icon: <Database size={16} /> },
    { key: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings"
        subtitle="Platform configuration, access control, and integrations"
        breadcrumb={['HotelML', 'Governance', 'Settings']}
      />

      {/* Tab navigation */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
              activeTab === t.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Appearance" subtitle="Theme and display preferences">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Theme</p>
                  <p className="text-xs text-muted-foreground">Toggle between light and dark mode</p>
                </div>
                <button onClick={toggleTheme} className="rounded-lg border border-input bg-background px-4 py-2 text-sm hover:bg-accent transition-colors">
                  {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Language</p>
                  <p className="text-xs text-muted-foreground">Platform display language</p>
                </div>
                <select className="h-9 rounded-lg border border-input bg-background px-3 text-sm">
                  <option>English</option>
                  <option>Hindi</option>
                  <option>French</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Currency</p>
                  <p className="text-xs text-muted-foreground">Default currency for all dashboards</p>
                </div>
                <select className="h-9 rounded-lg border border-input bg-background px-3 text-sm">
                  <option>INR (₹)</option>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                </select>
              </div>
            </div>
          </ChartCard>

          <ChartCard title="Account" subtitle="Your profile and security settings">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold">
                  {user?.name?.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <StatusBadge status="active" label={user?.role?.replace('_', ' ') || 'user'} className="mt-1" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-2 text-sm">
                  <Key size={14} /> API Keys
                </div>
                <button className="text-xs text-primary hover:underline">Manage Keys</button>
              </div>
            </div>
          </ChartCard>
        </div>
      )}

      {activeTab === 'roles' && (
        <ChartCard title="Role-Based Access Control" subtitle="User roles and their associated permissions" noPadding>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Role</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Users</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Permissions</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {roles.map(r => (
                <tr key={r.role} className="hover:bg-accent/30">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-muted-foreground" />
                      <span className="font-medium">{r.label}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">{r.users}</td>
                  <td className="px-5 py-3 text-muted-foreground text-xs max-w-xs">{r.permissions}</td>
                  <td className="px-5 py-3">
                    <button className="text-xs text-primary hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ChartCard>
      )}

      {activeTab === 'integrations' && (
        <ChartCard title="System Integrations" subtitle="Connected data sources and APIs" noPadding>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Integration</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Last Sync</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {integrations.map(i => (
                <tr key={i.name} className="hover:bg-accent/30">
                  <td className="px-5 py-3 font-medium">{i.name}</td>
                  <td className="px-5 py-3"><StatusBadge status={i.status} /></td>
                  <td className="px-5 py-3 text-muted-foreground text-xs">{i.lastSync}</td>
                  <td className="px-5 py-3">
                    <button className="text-xs text-primary hover:underline mr-3">Configure</button>
                    <button className="text-xs text-muted-foreground hover:underline">Sync Now</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ChartCard>
      )}

      {activeTab === 'notifications' && (
        <ChartCard title="Notification Preferences" subtitle="Configure alert thresholds and delivery channels">
          <div className="space-y-4">
            {[
              { label: 'Model Drift Alerts', desc: 'Notify when feature drift exceeds threshold', enabled: true },
              { label: 'Demand Spike Alerts', desc: 'Notify when occupancy forecast exceeds 90%', enabled: true },
              { label: 'Inventory Stockout Warnings', desc: 'Notify when items reach reorder point', enabled: true },
              { label: 'Negative Review Clusters', desc: 'Notify when 5+ negative reviews in 24 hours', enabled: false },
              { label: 'Revenue Target Alerts', desc: 'Daily RevPAR vs target notification', enabled: true },
              { label: 'Staff Overtime Warnings', desc: 'Notify when overtime exceeds budget threshold', enabled: false },
            ].map(n => (
              <div key={n.label} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
                <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${n.enabled ? 'bg-primary' : 'bg-muted'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${n.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </ChartCard>
      )}
    </div>
  );
}

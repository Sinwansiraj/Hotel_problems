import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/store';
import {
  LayoutDashboard, Hotel, CalendarRange, DollarSign, Brain, Database,
  Activity, Shield, Settings, TrendingUp, BarChart3, Users, Star,
  UserMinus, MessageSquare, HardHat, Package, ChevronDown, ChevronRight,
  Zap, PanelLeftClose, PanelLeft, Cpu, Gauge, Layers
} from 'lucide-react';

interface NavItem {
  label: string;
  path?: string;
  icon: React.ReactNode;
  children?: { label: string; path: string; icon: React.ReactNode }[];
}

const navGroups: { group: string; items: NavItem[] }[] = [
  {
    group: 'Core Platform',
    items: [
      { label: 'Executive Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
      { label: 'Property Overview', path: '/properties', icon: <Hotel size={18} /> },
      { label: 'Reservation Intelligence', path: '/reservations', icon: <CalendarRange size={18} /> },
    ],
  },
  {
    group: 'Revenue Intelligence',
    items: [
      {
        label: 'Demand Forecasting', icon: <TrendingUp size={18} />,
        children: [
          { label: 'Occupancy Forecast', path: '/demand/forecast', icon: <BarChart3 size={16} /> },
          { label: 'ADR & RevPAR Trends', path: '/demand/trends', icon: <TrendingUp size={16} /> },
          { label: 'Event & Weather Impact', path: '/demand/events', icon: <Zap size={16} /> },
        ],
      },
      {
        label: 'Dynamic Pricing', icon: <DollarSign size={18} />,
        children: [
          { label: 'Price Recommendations', path: '/pricing/recommend', icon: <DollarSign size={16} /> },
          { label: 'Competitor Analysis', path: '/pricing/competitors', icon: <Gauge size={16} /> },
          { label: 'Booking Pace', path: '/pricing/pace', icon: <Activity size={16} /> },
        ],
      },
      { label: 'Revenue Dashboard', path: '/revenue', icon: <DollarSign size={18} /> },
    ],
  },
  {
    group: 'Guest Intelligence',
    items: [
      {
        label: 'Churn & Retention', icon: <UserMinus size={18} />,
        children: [
          { label: 'Churn Risk Dashboard', path: '/churn/risk', icon: <UserMinus size={16} /> },
          { label: 'RFM Analysis', path: '/churn/rfm', icon: <Users size={16} /> },
          { label: 'Retention Campaigns', path: '/churn/campaigns', icon: <Zap size={16} /> },
        ],
      },
      { label: 'Guest Personalization', path: '/personalization', icon: <Star size={18} /> },
    ],
  },
  {
    group: 'Operations Intelligence',
    items: [
      {
        label: 'Reputation Management', icon: <MessageSquare size={18} />,
        children: [
          { label: 'Sentiment Dashboard', path: '/reputation/sentiment', icon: <MessageSquare size={16} /> },
          { label: 'Topic Analysis', path: '/reputation/topics', icon: <Layers size={16} /> },
          { label: 'Score Trends', path: '/reputation/trends', icon: <TrendingUp size={16} /> },
        ],
      },
      {
        label: 'Workforce Planning', icon: <HardHat size={18} />,
        children: [
          { label: 'Staff Scheduling', path: '/workforce/schedule', icon: <CalendarRange size={16} /> },
          { label: 'Labour Cost Forecast', path: '/workforce/cost', icon: <DollarSign size={16} /> },
          { label: 'Overtime Monitor', path: '/workforce/overtime', icon: <Activity size={16} /> },
        ],
      },
      {
        label: 'Supply Chain', icon: <Package size={18} />,
        children: [
          { label: 'Inventory Monitor', path: '/supply/inventory', icon: <Package size={16} /> },
          { label: 'Stockout Prediction', path: '/supply/stockout', icon: <Zap size={16} /> },
          { label: 'Waste Analysis', path: '/supply/waste', icon: <BarChart3 size={16} /> },
        ],
      },
    ],
  },
  {
    group: 'ML Platform',
    items: [
      { label: 'Model Monitoring', path: '/ml-platform/models', icon: <Brain size={18} /> },
      { label: 'Feature Store', path: '/ml-platform/features', icon: <Database size={18} /> },
      { label: 'Inference Monitor', path: '/ml-platform/inference', icon: <Cpu size={18} /> },
    ],
  },
  {
    group: 'Governance',
    items: [
      { label: 'Access Control', path: '/settings/access', icon: <Shield size={18} /> },
      { label: 'System Settings', path: '/settings', icon: <Settings size={18} /> },
    ],
  },
];

export function Sidebar() {
  const { collapsed, toggle, mobileOpen, setMobileOpen } = useSidebarStore();
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full flex-col border-r border-border bg-card transition-all duration-300',
          collapsed ? 'w-[68px]' : 'w-[260px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            ML
          </div>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col leading-tight">
              <span className="font-semibold text-sm text-foreground">HotelML</span>
              <span className="text-[10px] text-muted-foreground tracking-wider uppercase">Intelligence Platform</span>
            </motion.div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-5">
          {navGroups.map((group) => (
            <div key={group.group}>
              {!collapsed && (
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.group}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) =>
                  item.children ? (
                    <CollapsibleNav key={item.label} item={item} collapsed={collapsed} currentPath={location.pathname} />
                  ) : (
                    <NavLink
                      key={item.path}
                      to={item.path!}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                        )
                      }
                    >
                      {item.icon}
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </NavLink>
                  )
                )}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={toggle}
          className="hidden lg:flex h-12 items-center justify-center border-t border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </aside>
    </>
  );
}

function CollapsibleNav({ item, collapsed, currentPath }: { item: NavItem; collapsed: boolean; currentPath: string }) {
  const isChildActive = item.children?.some((c) => currentPath.startsWith(c.path)) || false;
  const [open, setOpen] = useState(isChildActive);

  if (collapsed) {
    return (
      <div className="relative group">
        <div className={cn('flex items-center justify-center rounded-md px-3 py-2', isChildActive ? 'text-primary' : 'text-muted-foreground')}>
          {item.icon}
        </div>
        <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-50 w-48 rounded-md border border-border bg-popover p-1 shadow-lg">
          {item.children?.map((child) => (
            <NavLink key={child.path} to={child.path}
              className={({ isActive }) =>
                cn('flex items-center gap-2 rounded px-3 py-1.5 text-xs', isActive ? 'bg-primary/10 text-primary' : 'text-popover-foreground hover:bg-accent')
              }
            >
              {child.icon} {child.label}
            </NavLink>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isChildActive ? 'text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        )}
      >
        {item.icon}
        <span className="flex-1 text-left truncate">{item.label}</span>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="ml-5 border-l border-border pl-3 py-1 space-y-0.5">
              {item.children?.map((child) => (
                <NavLink key={child.path} to={child.path}
                  className={({ isActive }) =>
                    cn('flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
                      isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent')
                  }
                >
                  {child.icon} {child.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

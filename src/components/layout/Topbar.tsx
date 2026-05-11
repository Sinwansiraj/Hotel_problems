import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useThemeStore, useSidebarStore, useNotificationStore, useAuthStore, usePropertyStore } from '@/store';
import {
  Search, Bell, Sun, Moon, Menu, X, ChevronDown, LogOut, User, Settings
} from 'lucide-react';

export function Topbar() {
  const { theme, toggleTheme } = useThemeStore();
  const { setMobileOpen } = useSidebarStore();
  const { notifications, unreadCount, markAllRead, markRead } = useNotificationStore();
  const { user } = useAuthStore();
  const { properties, selectedPropertyId, setSelectedProperty } = usePropertyStore();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-4 lg:px-6">
      {/* Left: mobile toggle + search */}
      <div className="flex items-center gap-3">
        <button onClick={() => setMobileOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground">
          <Menu size={20} />
        </button>

        <div className={cn('relative hidden md:flex items-center transition-all', searchFocused ? 'w-80' : 'w-64')}>
          <Search size={16} className="absolute left-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search dashboards, metrics, guests..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <kbd className="absolute right-3 hidden lg:inline-flex h-5 items-center rounded border border-border bg-muted px-1.5 text-[10px] font-mono text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: property selector, theme, notifications, profile */}
      <div className="flex items-center gap-2">
        {/* Property selector */}
        <div className="relative hidden lg:block">
          <select
            value={selectedPropertyId || ''}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="h-9 appearance-none rounded-lg border border-input bg-background pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>

        {/* Theme toggle */}
        <button onClick={toggleTheme} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="absolute right-0 top-12 w-96 rounded-xl border border-border bg-popover shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  <button onClick={markAllRead} className="text-xs text-primary hover:underline">Mark all read</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.slice(0, 8).map((n) => (
                    <div key={n.id} onClick={() => markRead(n.id)}
                      className={cn('flex gap-3 px-4 py-3 border-b border-border last:border-0 cursor-pointer hover:bg-accent/50 transition-colors', !n.read && 'bg-primary/5')}>
                      <div className={cn('mt-0.5 h-2 w-2 shrink-0 rounded-full', n.type === 'alert' && 'bg-destructive', n.type === 'warning' && 'bg-orange-500', n.type === 'info' && 'bg-blue-500', n.type === 'success' && 'bg-green-500')} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent transition-colors">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium leading-tight">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
            <ChevronDown size={14} className="hidden lg:block text-muted-foreground" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="absolute right-0 top-12 w-52 rounded-xl border border-border bg-popover p-1 shadow-xl"
              >
                {[
                  { icon: <User size={14} />, label: 'Profile' },
                  { icon: <Settings size={14} />, label: 'Settings' },
                ].map(({ icon, label }) => (
                  <button key={label} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors">
                    {icon} {label}
                  </button>
                ))}
                <div className="my-1 border-t border-border" />
                <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                  <LogOut size={14} /> Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

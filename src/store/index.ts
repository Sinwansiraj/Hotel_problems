import { create } from 'zustand';
import type { User, Notification, Property } from '@/types';

// ─── Theme Store ────────────────────────────────────────────────────

interface ThemeStore {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: (typeof window !== 'undefined' && localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', next === 'dark');
      localStorage.setItem('theme', next);
      return { theme: next };
    }),
  setTheme: (theme) => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
    set({ theme });
  },
}));

// ─── Sidebar Store ──────────────────────────────────────────────────

interface SidebarStore {
  collapsed: boolean;
  mobileOpen: boolean;
  toggle: () => void;
  setMobileOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  collapsed: false,
  mobileOpen: false,
  toggle: () => set((s) => ({ collapsed: !s.collapsed })),
  setMobileOpen: (open) => set({ mobileOpen: open }),
}));

// ─── Auth Store ─────────────────────────────────────────────────────

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  hasPermission: (roles: string[]) => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: {
    id: 'usr_001',
    name: 'Sinwan Siraj',
    email: 'sinwan@hotelml.io',
    role: 'admin',
    properties: ['prop_001', 'prop_002', 'prop_003'],
  },
  isAuthenticated: true,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  hasPermission: (roles) => {
    const user = get().user;
    return user ? roles.includes(user.role) : false;
  },
}));

// ─── Notification Store ─────────────────────────────────────────────

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [
    { id: '1', type: 'alert', title: 'Demand Spike Detected', message: 'Occupancy forecast exceeds 95% for Dec 24-26. Consider rate adjustment.', timestamp: new Date().toISOString(), read: false, actionUrl: '/demand' },
    { id: '2', type: 'warning', title: 'Model Drift Alert', message: 'Churn prediction model accuracy dropped below 88% threshold.', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false, actionUrl: '/ml-platform' },
    { id: '3', type: 'info', title: 'New Review Cluster', message: '12 negative reviews about WiFi quality detected in the last 48 hours.', timestamp: new Date(Date.now() - 7200000).toISOString(), read: false, actionUrl: '/reputation' },
    { id: '4', type: 'success', title: 'Retraining Complete', message: 'Dynamic pricing model v2.4 deployed successfully with 94.2% accuracy.', timestamp: new Date(Date.now() - 14400000).toISOString(), read: true },
  ],
  unreadCount: 3,
  addNotification: (n) =>
    set((s) => ({
      notifications: [{ ...n, id: crypto.randomUUID(), timestamp: new Date().toISOString(), read: false }, ...s.notifications],
      unreadCount: s.unreadCount + 1,
    })),
  markRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      unreadCount: Math.max(0, s.unreadCount - (s.notifications.find((n) => n.id === id && !n.read) ? 1 : 0)),
    })),
  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  dismiss: (id) =>
    set((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
      unreadCount: s.unreadCount - (s.notifications.find((n) => n.id === id && !n.read) ? 1 : 0),
    })),
}));

// ─── Property Store ─────────────────────────────────────────────────

interface PropertyStore {
  properties: Property[];
  selectedPropertyId: string | null;
  setSelectedProperty: (id: string) => void;
}

export const usePropertyStore = create<PropertyStore>((set) => ({
  properties: [
    { id: 'prop_001', name: 'The Grand Palace', location: 'Mumbai, MH', totalRooms: 320, starRating: 5, status: 'active' },
    { id: 'prop_002', name: 'Coastal Breeze Resort', location: 'Goa', totalRooms: 180, starRating: 4, status: 'active' },
    { id: 'prop_003', name: 'Heritage Haveli', location: 'Jaipur, RJ', totalRooms: 95, starRating: 4, status: 'active' },
    { id: 'prop_004', name: 'TechPark Suites', location: 'Bangalore, KA', totalRooms: 210, starRating: 3, status: 'maintenance' },
  ],
  selectedPropertyId: 'prop_001',
  setSelectedProperty: (id) => set({ selectedPropertyId: id }),
}));

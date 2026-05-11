import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { useSidebarStore } from '@/store';
import { cn } from '@/lib/utils';

export function DashboardLayout() {
  const { collapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={cn('transition-all duration-300', collapsed ? 'lg:ml-[68px]' : 'lg:ml-[260px]')}>
        <Topbar />
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

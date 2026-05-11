import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import { router } from '@/routes';
import { useThemeStore } from '@/store';
import '@/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

/** Initialize theme from localStorage */
function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  return <>{children}</>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeInitializer>
        <RouterProvider router={router} />
        <Analytics />
      </ThemeInitializer>
    </QueryClientProvider>
  </React.StrictMode>
);

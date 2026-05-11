import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';

// ─── Lazy imports for code splitting ────────────────────────────────
import { ExecutiveDashboard } from '@/pages/executive/ExecutiveDashboard';
import { DemandForecastPage } from '@/pages/demand/DemandForecastPage';
import { PricingDashboard } from '@/pages/pricing/PricingDashboard';
import { ChurnDashboard } from '@/pages/churn/ChurnDashboard';
import { ReputationDashboard } from '@/pages/reputation/ReputationDashboard';
import { WorkforceDashboard } from '@/pages/workforce/WorkforceDashboard';
import { SupplyChainDashboard } from '@/pages/supply/SupplyChainDashboard';
import { MLPlatformPage } from '@/pages/ml-platform/MLPlatformPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      // Core Platform
      { index: true, element: <ExecutiveDashboard /> },
      { path: 'properties', element: <ExecutiveDashboard /> },
      { path: 'reservations', element: <ExecutiveDashboard /> },
      { path: 'revenue', element: <PricingDashboard /> },

      // Demand Forecasting
      { path: 'demand/forecast', element: <DemandForecastPage /> },
      { path: 'demand/trends', element: <DemandForecastPage /> },
      { path: 'demand/events', element: <DemandForecastPage /> },

      // Dynamic Pricing
      { path: 'pricing/recommend', element: <PricingDashboard /> },
      { path: 'pricing/competitors', element: <PricingDashboard /> },
      { path: 'pricing/pace', element: <PricingDashboard /> },

      // Guest Intelligence
      { path: 'churn/risk', element: <ChurnDashboard /> },
      { path: 'churn/rfm', element: <ChurnDashboard /> },
      { path: 'churn/campaigns', element: <ChurnDashboard /> },
      { path: 'personalization', element: <ChurnDashboard /> },

      // Operations Intelligence
      { path: 'reputation/sentiment', element: <ReputationDashboard /> },
      { path: 'reputation/topics', element: <ReputationDashboard /> },
      { path: 'reputation/trends', element: <ReputationDashboard /> },
      { path: 'workforce/schedule', element: <WorkforceDashboard /> },
      { path: 'workforce/cost', element: <WorkforceDashboard /> },
      { path: 'workforce/overtime', element: <WorkforceDashboard /> },
      { path: 'supply/inventory', element: <SupplyChainDashboard /> },
      { path: 'supply/stockout', element: <SupplyChainDashboard /> },
      { path: 'supply/waste', element: <SupplyChainDashboard /> },

      // ML Platform
      { path: 'ml-platform/models', element: <MLPlatformPage /> },
      { path: 'ml-platform/features', element: <MLPlatformPage /> },
      { path: 'ml-platform/inference', element: <MLPlatformPage /> },

      // Governance
      { path: 'settings/access', element: <SettingsPage /> },
      { path: 'settings', element: <SettingsPage /> },

      // Catch-all
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

// ─── Core Domain Types ──────────────────────────────────────────────

export interface Property {
  id: string;
  name: string;
  location: string;
  totalRooms: number;
  starRating: number;
  status: 'active' | 'maintenance' | 'offline';
}

export interface KPIMetric {
  label: string;
  value: number | string;
  change?: number;        // percentage change
  changeLabel?: string;   // e.g. "vs last month"
  trend?: 'up' | 'down' | 'flat';
  icon?: string;
  format?: 'currency' | 'percent' | 'number' | 'compact';
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  forecast?: number;
  lower?: number;
  upper?: number;
}

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

// ─── Demand Forecasting ─────────────────────────────────────────────

export interface DemandForecast {
  date: string;
  actualOccupancy: number;
  predictedOccupancy: number;
  confidence: number;
  lowerBound: number;
  upperBound: number;
}

export interface EventImpact {
  eventName: string;
  eventDate: string;
  expectedImpact: number;  // percentage occupancy change
  type: 'positive' | 'negative';
  confidence: number;
}

// ─── Dynamic Pricing ────────────────────────────────────────────────

export interface PriceRecommendation {
  roomType: string;
  currentRate: number;
  recommendedRate: number;
  competitorAvgRate: number;
  demandScore: number;
  confidenceScore: number;
  reasoning: string;
}

export interface CompetitorRate {
  competitorName: string;
  date: string;
  standardRate: number;
  deluxeRate: number;
  suiteRate: number;
  availability: 'high' | 'medium' | 'low' | 'sold_out';
}

// ─── Churn & Retention ──────────────────────────────────────────────

export interface GuestChurnScore {
  guestId: string;
  guestName: string;
  segment: string;
  churnProbability: number;
  lifetimeValue: number;
  lastStayDate: string;
  totalStays: number;
  riskLevel: 'high' | 'medium' | 'low';
  topChurnDrivers: string[];
}

export interface RFMSegment {
  segment: string;
  count: number;
  avgLifetimeValue: number;
  avgRecency: number;
  avgFrequency: number;
  avgMonetary: number;
  churnRate: number;
}

// ─── Reputation ─────────────────────────────────────────────────────

export interface ReviewSentiment {
  platform: string;
  date: string;
  averageScore: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  topTopics: { topic: string; sentiment: number; count: number }[];
}

// ─── Workforce ──────────────────────────────────────────────────────

export interface StaffSchedule {
  department: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'night';
  requiredStaff: number;
  scheduledStaff: number;
  actualStaff: number;
  overtimeHours: number;
}

// ─── Inventory / Supply ─────────────────────────────────────────────

export interface InventoryItem {
  itemId: string;
  name: string;
  category: string;
  currentStock: number;
  parLevel: number;
  reorderPoint: number;
  dailyConsumption: number;
  daysUntilStockout: number;
  status: 'ok' | 'low' | 'critical' | 'overstock';
  wasteRate: number;
}

// ─── ML Model ───────────────────────────────────────────────────────

export interface MLModel {
  modelId: string;
  name: string;
  domain: string;
  version: string;
  status: 'healthy' | 'degraded' | 'offline';
  accuracy: number;
  latencyMs: number;
  lastTrained: string;
  featureDrift: number;
  predictionsToday: number;
}

// ─── Notifications ──────────────────────────────────────────────────

export interface Notification {
  id: string;
  type: 'alert' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// ─── User / Auth ────────────────────────────────────────────────────

export type UserRole = 'admin' | 'revenue_manager' | 'operations_manager' | 'gm' | 'analyst' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  properties: string[];
}

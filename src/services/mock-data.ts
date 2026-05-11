/**
 * Mock Data Generator
 * Provides realistic hospitality data for all ML domains.
 */
import type {
  DemandForecast, PriceRecommendation, CompetitorRate,
  GuestChurnScore, ReviewSentiment, StaffSchedule, InventoryItem,
  MLModel, EventImpact, RFMSegment, ChartDataPoint
} from '@/types';

// ─── Helpers ────────────────────────────────────────────────────────

function rand(min: number, max: number) { return Math.round((Math.random() * (max - min) + min) * 100) / 100; }
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function dateOffset(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// ─── Executive KPIs ─────────────────────────────────────────────────

export const executiveKPIs = [
  { label: 'Occupancy Rate', value: 78.4, change: 3.2, trend: 'up' as const, format: 'percent' as const },
  { label: 'ADR', value: 6850, change: 5.1, trend: 'up' as const, format: 'currency' as const },
  { label: 'RevPAR', value: 5370, change: 8.3, trend: 'up' as const, format: 'currency' as const },
  { label: 'Total Revenue', value: 42500000, change: 12.4, trend: 'up' as const, format: 'currency' as const },
  { label: 'Guest Satisfaction', value: 4.3, change: 0.1, trend: 'up' as const, format: 'number' as const },
  { label: 'Churn Rate', value: 23.1, change: -2.4, trend: 'down' as const, format: 'percent' as const },
  { label: 'Staff Efficiency', value: 87.2, change: 1.8, trend: 'up' as const, format: 'percent' as const },
  { label: 'F&B Waste', value: 4.2, change: -0.8, trend: 'down' as const, format: 'percent' as const },
];

// ─── Revenue Trend ──────────────────────────────────────────────────

export const revenueTrend: ChartDataPoint[] = Array.from({ length: 12 }, (_, i) => ({
  name: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  revenue: randInt(28, 52) * 100000,
  revpar: randInt(4200, 6800),
  adr: randInt(5500, 8500),
  occupancy: rand(58, 92),
}));

// ─── Demand Forecast ────────────────────────────────────────────────

export const demandForecast: DemandForecast[] = Array.from({ length: 90 }, (_, i) => {
  const base = 65 + 20 * Math.sin(i / 14 * Math.PI) + rand(-5, 5);
  const predicted = Math.min(100, Math.max(20, base + rand(-3, 3)));
  return {
    date: dateOffset(i),
    actualOccupancy: i < 7 ? Math.min(100, Math.max(20, base)) : 0,
    predictedOccupancy: Math.round(predicted * 10) / 10,
    confidence: rand(82, 97),
    lowerBound: Math.max(15, predicted - rand(8, 15)),
    upperBound: Math.min(100, predicted + rand(8, 15)),
  };
});

export const eventImpacts: EventImpact[] = [
  { eventName: 'International Film Festival', eventDate: dateOffset(12), expectedImpact: 35, type: 'positive', confidence: 91 },
  { eventName: 'City Marathon', eventDate: dateOffset(25), expectedImpact: 28, type: 'positive', confidence: 88 },
  { eventName: 'Monsoon Season Peak', eventDate: dateOffset(45), expectedImpact: -18, type: 'negative', confidence: 85 },
  { eventName: 'Tech Conference 2026', eventDate: dateOffset(60), expectedImpact: 42, type: 'positive', confidence: 93 },
  { eventName: 'Political Rally', eventDate: dateOffset(30), expectedImpact: -12, type: 'negative', confidence: 72 },
];

// ─── Dynamic Pricing ────────────────────────────────────────────────

export const priceRecommendations: PriceRecommendation[] = [
  { roomType: 'Standard', currentRate: 4500, recommendedRate: 5200, competitorAvgRate: 4800, demandScore: 82, confidenceScore: 91, reasoning: 'High demand detected for next 7 days; competitor availability declining.' },
  { roomType: 'Deluxe', currentRate: 6500, recommendedRate: 7800, competitorAvgRate: 7200, demandScore: 88, confidenceScore: 94, reasoning: 'Event-driven demand surge. Competitor rates rising 12% above baseline.' },
  { roomType: 'Suite', currentRate: 12000, recommendedRate: 14500, competitorAvgRate: 13800, demandScore: 76, confidenceScore: 87, reasoning: 'Premium segment demand steady. Upsell opportunity from deluxe conversions.' },
  { roomType: 'Executive', currentRate: 8500, recommendedRate: 8200, competitorAvgRate: 7900, demandScore: 54, confidenceScore: 83, reasoning: 'Midweek corporate demand softening. Slight reduction to capture price-sensitive bookings.' },
];

export const competitorRates: CompetitorRate[] = [
  { competitorName: 'Taj Lands End', date: dateOffset(0), standardRate: 5200, deluxeRate: 7800, suiteRate: 15000, availability: 'medium' },
  { competitorName: 'ITC Maratha', date: dateOffset(0), standardRate: 4900, deluxeRate: 7400, suiteRate: 14200, availability: 'high' },
  { competitorName: 'Oberoi Mumbai', date: dateOffset(0), standardRate: 6100, deluxeRate: 9200, suiteRate: 18500, availability: 'low' },
  { competitorName: 'Marriott Juhu', date: dateOffset(0), standardRate: 4600, deluxeRate: 6800, suiteRate: 12800, availability: 'high' },
  { competitorName: 'Hyatt Regency', date: dateOffset(0), standardRate: 4800, deluxeRate: 7100, suiteRate: 13500, availability: 'medium' },
];

export const bookingPace: ChartDataPoint[] = Array.from({ length: 30 }, (_, i) => ({
  name: `D-${30 - i}`,
  thisYear: randInt(8, 35),
  lastYear: randInt(5, 30),
  optimal: randInt(12, 28),
}));

// ─── Churn / Retention ──────────────────────────────────────────────

export const churnScores: GuestChurnScore[] = [
  { guestId: 'G001', guestName: 'Rajesh Mehta', segment: 'Corporate', churnProbability: 0.89, lifetimeValue: 485000, lastStayDate: '2025-11-15', totalStays: 14, riskLevel: 'high', topChurnDrivers: ['No stay in 6+ months', 'Unresolved billing complaint', 'Competitor loyalty switch'] },
  { guestId: 'G002', guestName: 'Sarah Chen', segment: 'Luxury Leisure', churnProbability: 0.72, lifetimeValue: 820000, lastStayDate: '2025-12-01', totalStays: 8, riskLevel: 'high', topChurnDrivers: ['Declining NPS scores', 'Room preference not met last visit'] },
  { guestId: 'G003', guestName: 'Amit Patel', segment: 'MICE', churnProbability: 0.45, lifetimeValue: 1250000, lastStayDate: '2026-02-20', totalStays: 22, riskLevel: 'medium', topChurnDrivers: ['Corporate contract renewal pending', 'F&B quality complaints'] },
  { guestId: 'G004', guestName: 'Lisa Monroe', segment: 'Leisure', churnProbability: 0.31, lifetimeValue: 195000, lastStayDate: '2026-03-10', totalStays: 5, riskLevel: 'low', topChurnDrivers: ['Seasonal visitor pattern'] },
  { guestId: 'G005', guestName: 'Vikram Sharma', segment: 'Corporate', churnProbability: 0.91, lifetimeValue: 620000, lastStayDate: '2025-09-05', totalStays: 18, riskLevel: 'high', topChurnDrivers: ['No stay in 8 months', 'WiFi complaint repeated', 'Lost loyalty tier'] },
  { guestId: 'G006', guestName: 'Priya Nair', segment: 'Staycation', churnProbability: 0.28, lifetimeValue: 145000, lastStayDate: '2026-04-12', totalStays: 6, riskLevel: 'low', topChurnDrivers: ['Price sensitivity increasing'] },
];

export const rfmSegments: RFMSegment[] = [
  { segment: 'Champions', count: 245, avgLifetimeValue: 780000, avgRecency: 15, avgFrequency: 12, avgMonetary: 65000, churnRate: 5 },
  { segment: 'Loyal', count: 520, avgLifetimeValue: 420000, avgRecency: 35, avgFrequency: 7, avgMonetary: 42000, churnRate: 12 },
  { segment: 'Potential Loyalists', count: 380, avgLifetimeValue: 185000, avgRecency: 25, avgFrequency: 3, avgMonetary: 38000, churnRate: 18 },
  { segment: 'At Risk', count: 290, avgLifetimeValue: 310000, avgRecency: 90, avgFrequency: 5, avgMonetary: 35000, churnRate: 45 },
  { segment: 'Hibernating', count: 410, avgLifetimeValue: 125000, avgRecency: 180, avgFrequency: 2, avgMonetary: 22000, churnRate: 72 },
  { segment: 'Lost', count: 335, avgLifetimeValue: 85000, avgRecency: 365, avgFrequency: 1, avgMonetary: 18000, churnRate: 91 },
];

// ─── Reputation / Reviews ───────────────────────────────────────────

export const reviewSentiment: ReviewSentiment[] = [
  { platform: 'Google', date: dateOffset(0), averageScore: 4.3, positiveCount: 142, neutralCount: 38, negativeCount: 22, topTopics: [{ topic: 'Staff', sentiment: 0.85, count: 65 }, { topic: 'Cleanliness', sentiment: 0.78, count: 48 }, { topic: 'WiFi', sentiment: -0.42, count: 35 }] },
  { platform: 'Booking.com', date: dateOffset(0), averageScore: 4.1, positiveCount: 198, neutralCount: 56, negativeCount: 41, topTopics: [{ topic: 'Location', sentiment: 0.92, count: 88 }, { topic: 'Food', sentiment: 0.65, count: 72 }, { topic: 'Check-in', sentiment: -0.31, count: 28 }] },
  { platform: 'TripAdvisor', date: dateOffset(0), averageScore: 4.2, positiveCount: 156, neutralCount: 42, negativeCount: 28, topTopics: [{ topic: 'Room Quality', sentiment: 0.72, count: 55 }, { topic: 'Value', sentiment: 0.58, count: 42 }, { topic: 'Noise', sentiment: -0.55, count: 22 }] },
];

export const sentimentTrend: ChartDataPoint[] = Array.from({ length: 12 }, (_, i) => ({
  name: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  positive: randInt(55, 75),
  neutral: randInt(15, 25),
  negative: randInt(8, 22),
  avgScore: rand(3.8, 4.5),
}));

// ─── Workforce ──────────────────────────────────────────────────────

export const staffSchedules: StaffSchedule[] = [
  { department: 'Front Desk', date: dateOffset(0), shift: 'morning', requiredStaff: 8, scheduledStaff: 7, actualStaff: 7, overtimeHours: 4 },
  { department: 'Housekeeping', date: dateOffset(0), shift: 'morning', requiredStaff: 24, scheduledStaff: 22, actualStaff: 20, overtimeHours: 12 },
  { department: 'F&B Service', date: dateOffset(0), shift: 'morning', requiredStaff: 15, scheduledStaff: 14, actualStaff: 14, overtimeHours: 3 },
  { department: 'Kitchen', date: dateOffset(0), shift: 'morning', requiredStaff: 18, scheduledStaff: 18, actualStaff: 16, overtimeHours: 8 },
  { department: 'Security', date: dateOffset(0), shift: 'morning', requiredStaff: 6, scheduledStaff: 6, actualStaff: 6, overtimeHours: 0 },
  { department: 'Maintenance', date: dateOffset(0), shift: 'morning', requiredStaff: 5, scheduledStaff: 5, actualStaff: 4, overtimeHours: 2 },
  { department: 'Spa & Wellness', date: dateOffset(0), shift: 'morning', requiredStaff: 4, scheduledStaff: 4, actualStaff: 4, overtimeHours: 0 },
];

export const labourCostTrend: ChartDataPoint[] = Array.from({ length: 12 }, (_, i) => ({
  name: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  baseCost: randInt(1800000, 2400000),
  overtimeCost: randInt(120000, 380000),
  contractCost: randInt(200000, 450000),
  efficiency: rand(78, 92),
}));

// ─── Inventory / Supply Chain ───────────────────────────────────────

export const inventoryItems: InventoryItem[] = [
  { itemId: 'INV001', name: 'Fresh Vegetables', category: 'F&B Perishable', currentStock: 120, parLevel: 200, reorderPoint: 80, dailyConsumption: 35, daysUntilStockout: 3, status: 'critical', wasteRate: 12.5 },
  { itemId: 'INV002', name: 'Bath Towels', category: 'Linen', currentStock: 850, parLevel: 600, reorderPoint: 300, dailyConsumption: 45, daysUntilStockout: 19, status: 'overstock', wasteRate: 2.1 },
  { itemId: 'INV003', name: 'Dairy Products', category: 'F&B Perishable', currentStock: 65, parLevel: 100, reorderPoint: 40, dailyConsumption: 22, daysUntilStockout: 3, status: 'low', wasteRate: 8.3 },
  { itemId: 'INV004', name: 'Amenity Kits', category: 'Guest Supplies', currentStock: 420, parLevel: 500, reorderPoint: 200, dailyConsumption: 28, daysUntilStockout: 15, status: 'ok', wasteRate: 0.5 },
  { itemId: 'INV005', name: 'Cleaning Chemicals', category: 'Housekeeping', currentStock: 180, parLevel: 200, reorderPoint: 80, dailyConsumption: 8, daysUntilStockout: 22, status: 'ok', wasteRate: 1.2 },
  { itemId: 'INV006', name: 'Proteins (Meat/Fish)', category: 'F&B Perishable', currentStock: 45, parLevel: 80, reorderPoint: 30, dailyConsumption: 18, daysUntilStockout: 2, status: 'critical', wasteRate: 15.8 },
  { itemId: 'INV007', name: 'King-size Linen Sets', category: 'Linen', currentStock: 55, parLevel: 120, reorderPoint: 50, dailyConsumption: 12, daysUntilStockout: 4, status: 'low', wasteRate: 1.8 },
  { itemId: 'INV008', name: 'LED Bulbs', category: 'Maintenance', currentStock: 340, parLevel: 150, reorderPoint: 60, dailyConsumption: 3, daysUntilStockout: 113, status: 'overstock', wasteRate: 0.2 },
];

// ─── ML Models ──────────────────────────────────────────────────────

export const mlModels: MLModel[] = [
  { modelId: 'mdl_001', name: 'Demand Forecaster', domain: 'Demand', version: 'v3.2.1', status: 'healthy', accuracy: 94.2, latencyMs: 45, lastTrained: '2026-04-28', featureDrift: 0.012, predictionsToday: 14520 },
  { modelId: 'mdl_002', name: 'Dynamic Price Engine', domain: 'Pricing', version: 'v2.4.0', status: 'healthy', accuracy: 91.8, latencyMs: 32, lastTrained: '2026-05-01', featureDrift: 0.008, predictionsToday: 8340 },
  { modelId: 'mdl_003', name: 'Churn Predictor', domain: 'Churn', version: 'v1.8.3', status: 'degraded', accuracy: 87.1, latencyMs: 58, lastTrained: '2026-04-15', featureDrift: 0.045, predictionsToday: 3200 },
  { modelId: 'mdl_004', name: 'Sentiment Classifier', domain: 'Reputation', version: 'v2.1.0', status: 'healthy', accuracy: 92.5, latencyMs: 28, lastTrained: '2026-04-30', featureDrift: 0.015, predictionsToday: 1850 },
  { modelId: 'mdl_005', name: 'Workforce Optimizer', domain: 'Workforce', version: 'v1.5.2', status: 'healthy', accuracy: 89.4, latencyMs: 120, lastTrained: '2026-04-22', featureDrift: 0.022, predictionsToday: 720 },
  { modelId: 'mdl_006', name: 'Inventory Predictor', domain: 'Supply Chain', version: 'v1.3.0', status: 'healthy', accuracy: 90.1, latencyMs: 55, lastTrained: '2026-04-25', featureDrift: 0.018, predictionsToday: 2100 },
  { modelId: 'mdl_007', name: 'Overbooking Controller', domain: 'Overbooking', version: 'v2.0.1', status: 'healthy', accuracy: 93.7, latencyMs: 38, lastTrained: '2026-04-29', featureDrift: 0.009, predictionsToday: 5600 },
  { modelId: 'mdl_008', name: 'Guest Personalizer', domain: 'Personalization', version: 'v1.6.0', status: 'offline', accuracy: 85.3, latencyMs: 0, lastTrained: '2026-03-10', featureDrift: 0.068, predictionsToday: 0 },
];

// ─── Channel / Segment breakdowns ───────────────────────────────────

export const channelMix: ChartDataPoint[] = [
  { name: 'OTA (Booking.com)', value: 35, revenue: 14875000 },
  { name: 'OTA (MakeMyTrip)', value: 18, revenue: 7650000 },
  { name: 'Direct Website', value: 22, revenue: 9350000 },
  { name: 'Corporate', value: 15, revenue: 6375000 },
  { name: 'Walk-in', value: 5, revenue: 2125000 },
  { name: 'GDS / Travel Agent', value: 5, revenue: 2125000 },
];

export const segmentMix: ChartDataPoint[] = [
  { name: 'Business', value: 42 },
  { name: 'Leisure', value: 28 },
  { name: 'MICE', value: 15 },
  { name: 'Staycation', value: 10 },
  { name: 'Long Stay', value: 5 },
];

export const occupancyByDow: ChartDataPoint[] = [
  { name: 'Mon', occupancy: 62 },
  { name: 'Tue', occupancy: 68 },
  { name: 'Wed', occupancy: 71 },
  { name: 'Thu', occupancy: 74 },
  { name: 'Fri', occupancy: 88 },
  { name: 'Sat', occupancy: 95 },
  { name: 'Sun', occupancy: 72 },
];

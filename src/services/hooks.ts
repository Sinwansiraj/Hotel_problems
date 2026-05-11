/**
 * React Query hooks for every ML domain endpoint.
 * When VITE_USE_MOCK is true (default), returns mock data with simulated latency.
 */
import { useQuery } from '@tanstack/react-query';
import { delay } from '@/lib/utils';
import * as mock from './mock-data';

const MOCK_DELAY = 600;

// ─── Generic mock wrapper ───────────────────────────────────────────

function useMockQuery<T>(key: string[], data: T, delayMs = MOCK_DELAY) {
  return useQuery({
    queryKey: key,
    queryFn: async () => { await delay(delayMs); return data; },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// ─── Executive Dashboard ────────────────────────────────────────────
export const useExecutiveKPIs = () => useMockQuery(['executive', 'kpis'], mock.executiveKPIs);
export const useRevenueTrend = () => useMockQuery(['executive', 'revenue-trend'], mock.revenueTrend);
export const useChannelMix = () => useMockQuery(['executive', 'channel-mix'], mock.channelMix);
export const useSegmentMix = () => useMockQuery(['executive', 'segment-mix'], mock.segmentMix);
export const useOccupancyByDow = () => useMockQuery(['executive', 'occupancy-dow'], mock.occupancyByDow);

// ─── Demand Forecasting ─────────────────────────────────────────────
export const useDemandForecast = () => useMockQuery(['demand', 'forecast'], mock.demandForecast);
export const useEventImpacts = () => useMockQuery(['demand', 'events'], mock.eventImpacts);

// ─── Dynamic Pricing ────────────────────────────────────────────────
export const usePriceRecommendations = () => useMockQuery(['pricing', 'recommendations'], mock.priceRecommendations);
export const useCompetitorRates = () => useMockQuery(['pricing', 'competitors'], mock.competitorRates);
export const useBookingPace = () => useMockQuery(['pricing', 'booking-pace'], mock.bookingPace);

// ─── Churn & Retention ──────────────────────────────────────────────
export const useChurnScores = () => useMockQuery(['churn', 'scores'], mock.churnScores);
export const useRFMSegments = () => useMockQuery(['churn', 'rfm'], mock.rfmSegments);

// ─── Reputation ─────────────────────────────────────────────────────
export const useReviewSentiment = () => useMockQuery(['reputation', 'sentiment'], mock.reviewSentiment);
export const useSentimentTrend = () => useMockQuery(['reputation', 'trend'], mock.sentimentTrend);

// ─── Workforce ──────────────────────────────────────────────────────
export const useStaffSchedules = () => useMockQuery(['workforce', 'schedules'], mock.staffSchedules);
export const useLabourCostTrend = () => useMockQuery(['workforce', 'labour-cost'], mock.labourCostTrend);

// ─── Supply Chain ───────────────────────────────────────────────────
export const useInventoryItems = () => useMockQuery(['supply', 'inventory'], mock.inventoryItems);

// ─── ML Platform ────────────────────────────────────────────────────
export const useMLModels = () => useMockQuery(['ml', 'models'], mock.mlModels);

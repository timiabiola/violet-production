import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { TimeRange } from '@/components/dashboard/TimeRangeSelector';
import { ReviewRequest } from '@/types/supabase';

interface ReviewMetrics {
  totalSent: number;
  totalClicked: number;
  totalCompleted: number;
  responseRate: number;
  averageResponseTime: number;
  previousPeriod: {
    totalSent: number;
    totalCompleted: number;
    responseRate: number;
  };
  chartData: Array<{
    date: string;
    sent: number;
    completed: number;
    clicked: number;
  }>;
  physicianStats: Array<{
    name: string;
    sent: number;
    completed: number;
    responseRate: number;
  }>;
  hourlyDistribution: Array<{
    hour: number;
    count: number;
  }>;
}

interface ExtendedReviewRequest extends ReviewRequest {
  status?: string | null;
  response_time_minutes?: number | null;
  physician_name?: string | null;
  physician?: string | null;
}

export const useReviewMetrics = (
  timeRange: TimeRange,
  customDateRange?: DateRange
) => {
  const { user } = useAuth();

  const getDateRange = (): { from: Date; to: Date } => {
    const now = new Date();
    const today = endOfDay(now);

    switch (timeRange) {
      case '24h':
        return { from: subDays(now, 1), to: now };
      case '7d':
        return { from: startOfDay(subDays(today, 7)), to: today };
      case '30d':
        return { from: startOfDay(subDays(today, 30)), to: today };
      case '90d':
        return { from: startOfDay(subDays(today, 90)), to: today };
      case '1y':
        return { from: startOfDay(subDays(today, 365)), to: today };
      case 'custom':
        return customDateRange?.from && customDateRange?.to
          ? { from: customDateRange.from, to: customDateRange.to }
          : { from: startOfDay(subDays(today, 30)), to: today };
      default:
        return { from: startOfDay(subDays(today, 7)), to: today };
    }
  };

  return useQuery<ReviewMetrics>({
    queryKey: ['reviewMetrics', timeRange, customDateRange, user?.id],
    queryFn: async () => {
      const { from, to } = getDateRange();

      // Calculate previous period for comparison
      const periodDuration = to.getTime() - from.getTime();
      const previousFrom = new Date(from.getTime() - periodDuration);
      const previousTo = new Date(from);

      // Fetch current period metrics
      const { data: currentRequests, error: currentError } = await supabase
        .from('review_requests')
        .select('*')
        .gte('created_at', from.toISOString())
        .lte('created_at', to.toISOString())
        .eq('created_by', user?.id);

      if (currentError) throw currentError;

      // Fetch previous period metrics for comparison
      const { data: previousRequests, error: previousError } = await supabase
        .from('review_requests')
        .select('*')
        .gte('created_at', previousFrom.toISOString())
        .lte('created_at', previousTo.toISOString())
        .eq('created_by', user?.id);

      if (previousError) throw previousError;

      // Process current period data
      const current = (currentRequests ?? []) as ExtendedReviewRequest[];
      const totalSent = current.length;
      const totalClicked = current.filter((request) => request.status === 'clicked' || request.status === 'completed').length;
      const totalCompleted = current.filter((request) => request.status === 'completed').length;
      const responseRate = totalSent > 0 ? (totalCompleted / totalSent) * 100 : 0;

      // Calculate average response time
      const responseTimes = current
        .filter((request) => typeof request.response_time_minutes === 'number')
        .map((request) => request.response_time_minutes as number);
      const averageResponseTime = responseTimes.length > 0
        ? responseTimes.reduce((a: number, b: number) => a + b, 0) / responseTimes.length
        : 0;

      // Process previous period data
      const previous = (previousRequests ?? []) as ExtendedReviewRequest[];
      const previousTotalSent = previous.length;
      const previousTotalCompleted = previous.filter((request) => request.status === 'completed').length;
      const previousResponseRate = previousTotalSent > 0
        ? (previousTotalCompleted / previousTotalSent) * 100
        : 0;

      // Prepare chart data
      const chartData = prepareChartData(current, from, to);

      // Prepare physician statistics
      const physicianStats = preparePhysicianStats(current);

      // Prepare hourly distribution
      const hourlyDistribution = prepareHourlyDistribution(current);

      return {
        totalSent,
        totalClicked,
        totalCompleted,
        responseRate,
        averageResponseTime,
        previousPeriod: {
          totalSent: previousTotalSent,
          totalCompleted: previousTotalCompleted,
          responseRate: previousResponseRate,
        },
        chartData,
        physicianStats,
        hourlyDistribution,
      };
    },
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

function prepareChartData(data: ExtendedReviewRequest[], from: Date, to: Date) {
  const dayMap = new Map<string, { sent: number; completed: number; clicked: number }>();

  // Initialize all days in range
  const currentDate = new Date(from);
  while (currentDate <= to) {
    const dateKey = currentDate.toISOString().split('T')[0];
    dayMap.set(dateKey, { sent: 0, completed: 0, clicked: 0 });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Count by day
  data.forEach((item) => {
    const date = new Date(item.created_at).toISOString().split('T')[0];
    const existing = dayMap.get(date) || { sent: 0, completed: 0, clicked: 0 };

    existing.sent++;
    if (item.status === 'clicked') existing.clicked++;
    if (item.status === 'completed') existing.completed++;

    dayMap.set(date, existing);
  });

  // Convert to array
  return Array.from(dayMap.entries()).map(([date, values]) => ({
    date,
    ...values,
  }));
}

function preparePhysicianStats(data: ExtendedReviewRequest[]) {
  const physicianMap = new Map<string, { sent: number; completed: number }>();

  data.forEach((item) => {
    const physician = item.physician_name || item.physician || 'Unknown';
    const existing = physicianMap.get(physician) || { sent: 0, completed: 0 };

    existing.sent++;
    if (item.status === 'completed') existing.completed++;

    physicianMap.set(physician, existing);
  });

  return Array.from(physicianMap.entries())
    .map(([name, stats]) => ({
      name,
      sent: stats.sent,
      completed: stats.completed,
      responseRate: stats.sent > 0 ? (stats.completed / stats.sent) * 100 : 0,
    }))
    .sort((a, b) => b.completed - a.completed)
    .slice(0, 10); // Top 10 physicians
}

function prepareHourlyDistribution(data: ExtendedReviewRequest[]) {
  const hourMap = new Map<number, number>();

  // Initialize all hours
  for (let i = 0; i < 24; i++) {
    hourMap.set(i, 0);
  }

  // Count by hour
  data.forEach((item) => {
    const hour = new Date(item.created_at).getHours();
    hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
  });

  return Array.from(hourMap.entries()).map(([hour, count]) => ({
    hour,
    count,
  }));
}

export default useReviewMetrics;

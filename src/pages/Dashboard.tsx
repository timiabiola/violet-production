import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';
import TimeRangeSelector, { TimeRange } from '@/components/dashboard/TimeRangeSelector';
import MetricCard from '@/components/dashboard/MetricCard';
import { useReviewMetrics } from '@/hooks/useReviewMetrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import {
  MessageCircle,
  FileText,
  Download,
  Activity,
  Send,
} from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>();

  const { data: metrics, isLoading } = useReviewMetrics(timeRange, customDateRange);

  const handleTimeRangeChange = (range: TimeRange, customDates?: DateRange) => {
    setTimeRange(range);
    if (customDates) {
      setCustomDateRange(customDates);
    }
  };

  // Calculate percentage changes for sent requests
  const sentChange = metrics?.previousPeriod?.totalSent
    ? ((metrics.totalSent - metrics.previousPeriod.totalSent) / metrics.previousPeriod.totalSent) * 100
    : 0;

  const exportData = () => {
    if (!metrics) return;

    const csvData = [
      ['Metric', 'Value'],
      ['Total Sent', metrics.totalSent],
      ['Period', timeRange],
      ...metrics.chartData.map(d => [d.date, d.sent]),
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `review-requests-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  // Prepare chart data for sent requests only
  const sentChartData = metrics?.chartData?.map(d => ({
    date: d.date,
    sent: d.sent
  })) || [];

  return (
    <div className="min-h-screen bg-black text-white">
      <AuthNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Review Request Analytics</h1>
              <p className="text-gray-400">
                Track your review request volume and timing patterns
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <TimeRangeSelector
                value={timeRange}
                customDateRange={customDateRange}
                onChange={handleTimeRangeChange}
              />
              <Button
                onClick={exportData}
                variant="outline"
                className="bg-black border-white/10 text-white hover:bg-white/5"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Main Metric - Centered and Prominent */}
          <div className="flex justify-center mb-10">
            <div className="w-full max-w-md">
              <MetricCard
                title="Total Review Requests Sent"
                value={metrics?.totalSent || 0}
                change={sentChange}
                icon={<Send className="h-6 w-6" />}
                loading={isLoading}
                className="transform scale-110"
              />
            </div>
          </div>

          {/* Daily Trend Chart - Full Width */}
          <Card className="bg-glass border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-violet-400" />
                Daily Review Requests Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={sentChartData}>
                  <defs>
                    <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    tickFormatter={(date) => format(new Date(date), 'MMM d')}
                  />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                    }}
                    labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                  />
                  <Area
                    type="monotone"
                    dataKey="sent"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorSent)"
                    name="Requests Sent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Hourly Distribution - Full Width */}
          <Card className="bg-glass border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-violet-400" />
                Peak Activity Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={metrics?.hourlyDistribution || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="hour"
                    stroke="#9ca3af"
                    tickFormatter={(hour) => `${hour}:00`}
                  />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                    }}
                    labelFormatter={(hour) => `${hour}:00 - ${hour}:59`}
                  />
                  <Bar
                    dataKey="count"
                    fill="#8b5cf6"
                    name="Requests"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 text-center text-sm text-gray-400">
                Identify the best times to send review requests based on your activity patterns
              </div>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <div className="bg-glass rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-gray-400 text-sm mb-1">Daily Average</p>
                <p className="text-2xl font-bold text-white">
                  {metrics?.chartData?.length
                    ? Math.round(metrics.totalSent / metrics.chartData.length)
                    : 0}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Peak Hour</p>
                <p className="text-2xl font-bold text-white">
                  {metrics?.hourlyDistribution?.length
                    ? `${metrics.hourlyDistribution.reduce((max, h) =>
                        h.count > max.count ? h : max
                      ).hour}:00`
                    : '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <Button
              onClick={() => navigate('/review-form')}
              className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3"
            >
              <FileText className="h-5 w-5 mr-2" />
              Go to Review Form
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
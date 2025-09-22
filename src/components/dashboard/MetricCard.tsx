import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Minus, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
  format?: 'number' | 'percentage' | 'currency' | 'time';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeLabel = 'vs. previous period',
  icon,
  loading = false,
  className,
  format = 'number',
}) => {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'string') return val;

    switch (format) {
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'time':
        return `${Math.round(val)} min`;
      case 'number':
      default:
        return val.toLocaleString();
    }
  };

  const getTrendIcon = () => {
    if (change === undefined || change === 0) {
      return <Minus className="h-4 w-4 text-gray-400" />;
    }

    if (change > 0) {
      return <ArrowUp className="h-4 w-4 text-green-400" />;
    }

    return <ArrowDown className="h-4 w-4 text-red-400" />;
  };

  const getTrendColor = () => {
    if (change === undefined || change === 0) {
      return 'text-gray-400';
    }

    // For most metrics, up is good
    // You could customize this based on metric type
    return change > 0 ? 'text-green-400' : 'text-red-400';
  };

  if (loading) {
    return (
      <Card className={cn('bg-glass border-white/10', className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">
            {title}
          </CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-7 bg-white/5 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-white/5 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('bg-glass border-white/10 hover:border-violet-500/30 transition-all', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">
          {title}
        </CardTitle>
        {icon && (
          <div className="text-violet-400">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">
          {formatValue(value)}
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            {getTrendIcon()}
            <span className={cn('text-xs', getTrendColor())}>
              {Math.abs(change).toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500">
              {changeLabel}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
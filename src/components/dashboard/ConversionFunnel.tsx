import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FunnelStage {
  name: string;
  value: number;
  percentage: number;
  color?: string;
}

interface ConversionFunnelProps {
  stages: FunnelStage[];
  loading?: boolean;
  className?: string;
}

export const ConversionFunnel: React.FC<ConversionFunnelProps> = ({
  stages,
  loading = false,
  className,
}) => {
  if (loading) {
    return (
      <Card className={cn('bg-glass border-white/10', className)}>
        <CardHeader>
          <CardTitle className="text-white">Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-white/5 rounded animate-pulse"></div>
                <div className="h-8 bg-white/5 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(...stages.map(s => s.value), 1);

  return (
    <Card className={cn('bg-glass border-white/10 hover:border-violet-500/30 transition-all', className)}>
      <CardHeader>
        <CardTitle className="text-white">Conversion Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {stages.map((stage, index) => {
            const widthPercentage = (stage.value / maxValue) * 100;
            const isLast = index === stages.length - 1;

            return (
              <div key={stage.name} className="relative">
                {/* Stage Label and Stats */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300">
                    {stage.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-semibold">
                      {stage.value.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({stage.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                {/* Funnel Bar */}
                <div className="relative">
                  <div className="h-10 bg-white/5 rounded-lg overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-lg transition-all duration-500 ease-out',
                        stage.color || 'bg-gradient-to-r from-violet-500 to-violet-700'
                      )}
                      style={{ width: `${widthPercentage}%` }}
                    >
                      {/* Shimmer effect */}
                      <div className="h-full w-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                      </div>
                    </div>
                  </div>

                  {/* Connector Arrow */}
                  {!isLast && (
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        className="text-violet-500/50"
                      >
                        <path
                          d="M10 0 L20 10 L10 20 L0 10 Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Conversion Rate from Previous Stage */}
                {index > 0 && stages[index - 1].value > 0 && (
                  <div className="mt-1 text-xs text-gray-500 text-right">
                    {((stage.value / stages[index - 1].value) * 100).toFixed(1)}% from previous
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        {stages.length > 0 && (
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Overall Conversion</span>
              <span className="text-lg font-bold text-violet-400">
                {stages.length > 0 && stages[0].value > 0
                  ? ((stages[stages.length - 1].value / stages[0].value) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Add shimmer animation to tailwind (you'll need to add this to your tailwind.config.js)
// animation: {
//   shimmer: 'shimmer 2s linear infinite'
// },
// keyframes: {
//   shimmer: {
//     '100%': {
//       transform: 'translateX(100%)',
//     },
//   }
// }

export default ConversionFunnel;
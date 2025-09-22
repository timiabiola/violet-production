import React, { useState } from 'react';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

export type TimeRange = '24h' | '7d' | '30d' | '90d' | '1y' | 'custom';

interface TimeRangeSelectorProps {
  value: TimeRange;
  customDateRange?: DateRange;
  onChange: (range: TimeRange, customDates?: DateRange) => void;
}

const timeRangeOptions = [
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: '1y', label: 'Last Year' },
  { value: 'custom', label: 'Custom Range' },
];

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  value,
  customDateRange,
  onChange,
}) => {
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(customDateRange);

  const getDateRangeForOption = (option: TimeRange): DateRange => {
    const now = new Date();
    const today = endOfDay(now);

    switch (option) {
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
        return customDateRange || { from: startOfDay(subDays(today, 30)), to: today };
      default:
        return { from: startOfDay(subDays(today, 7)), to: today };
    }
  };

  const handleRangeSelect = (range: TimeRange) => {
    if (range === 'custom') {
      setIsCustomOpen(true);
    } else {
      onChange(range, undefined);
    }
  };

  const handleCustomDateSelect = () => {
    if (tempDateRange?.from && tempDateRange?.to) {
      onChange('custom', tempDateRange);
      setIsCustomOpen(false);
    }
  };

  const currentLabel = value === 'custom' && customDateRange?.from && customDateRange?.to
    ? `${format(customDateRange.from, 'MMM d, yyyy')} - ${format(customDateRange.to, 'MMM d, yyyy')}`
    : timeRangeOptions.find(opt => opt.value === value)?.label || 'Last 7 Days';

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="min-w-[200px] justify-between bg-black border-white/10 text-white hover:bg-white/5"
          >
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{currentLabel}</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-black border-white/10">
          {timeRangeOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleRangeSelect(option.value as TimeRange)}
              className={cn(
                'text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer',
                value === option.value && 'bg-violet-600/20 text-violet-300'
              )}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              'hidden',
              value === 'custom' && 'flex'
            )}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-black border-white/10" align="end">
          <div className="p-4">
            <Calendar
              mode="range"
              selected={tempDateRange}
              onSelect={setTempDateRange}
              numberOfMonths={2}
              className="bg-black text-white"
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCustomOpen(false)}
                className="bg-black border-white/10 text-gray-300 hover:text-white hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCustomDateSelect}
                disabled={!tempDateRange?.from || !tempDateRange?.to}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TimeRangeSelector;
'use client';

import { DatePickerWithRange } from './DatePickerWithRange';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/Chart';
import { Spinner, Typography } from '@material-tailwind/react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

type DailyActiveUsersChartProps = {
  backendData: any;
  loading: boolean;
  onDateRangeChange: (_startDate: Date, _endDate: Date) => void;
};

type ChartData = {
  date: string;
  orgUsers: number;
  opportunitySeekers: number;
};

const chartConfig = {
  orgUsers: {
    label: 'Organizations',
    color: 'hsl(var(--chart-1))',
  },
  opportunitySeekers: {
    label: 'Opportunity Seekers',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export const DailyActiveUsersChart: React.FC<DailyActiveUsersChartProps> = ({
  backendData,
  loading,
  onDateRangeChange,
}) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (backendData && backendData?.org) {
      const transformedData = backendData.org.labels.map(
        (label: string, index: number) => ({
          date: label,
          orgUsers: backendData.org.data[index],
          opportunitySeekers: backendData.user.data[index],
        })
      );
      setChartData(transformedData);
    } else {
      setChartData([]);
    }
  }, [backendData]);

  const renderChart = (
    dataKey: string,
    label: string,
    fillColor: string,
    strokeColor: string
  ) => (
    <ChartContainer
      config={chartConfig}
      className='aspect-auto h-[250px] w-full'
    >
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id={`fill${dataKey}`} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor={fillColor} stopOpacity={0.8} />
            <stop offset='95%' stopColor={fillColor} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey='date'
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });
          }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={20}
          tickFormatter={(value) => value.toLocaleString()}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
              indicator='dot'
            />
          }
        />
        <Area
          dataKey={dataKey}
          type='natural'
          fill={`url(#fill${dataKey})`}
          stroke={strokeColor}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );

  return (
    <Card className='relative'>
      <CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
        <div className='grid flex-1 gap-1 text-center sm:text-left'>
          <CardTitle>Daily Active Users</CardTitle>
          <CardDescription>Showing total visitors per day</CardDescription>
        </div>

        <DatePickerWithRange onDateRangeChange={onDateRangeChange} />
      </CardHeader>

      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        {loading ? (
          <div className='absolute inset-4 h-full w-full flex items-center justify-center z-10'>
            <Spinner
              className='mx-auto my-auto w-8 h-8 opacity-90'
              color='amber'
            />
          </div>
        ) : chartData.length > 0 ? (
          <>
            <div className=' mb-8'>
              <Typography className='text-center mb-4 font-bold'>
                Opportunity Seekers
              </Typography>
              {renderChart(
                'opportunitySeekers',
                'Opportunity Seekers',
                'var(--color-opportunitySeekers)',
                'var(--color-opportunitySeekers)'
              )}
            </div>
            <div className=''>
              <Typography className='text-center mb-4 font-bold'>
                Organizations
              </Typography>
              {renderChart(
                'orgUsers',
                'Organization Users',
                'var(--color-orgUsers)',
                'var(--color-orgUsers)'
              )}
            </div>
          </>
        ) : (
          <Typography className='mx-auto my-auto text-center p-9 text-gray-400'>
            No data available
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

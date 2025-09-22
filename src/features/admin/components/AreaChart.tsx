'use client';

import { DatePickerWithRange } from './DatePickerWithRange';
import { GraphData } from '@/app/api/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useTransformBackendData } from '@/hook';
import { Spinner, Typography } from '@material-tailwind/react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface AreaGraphProps {
  chartTitle: string;
  chartSubTitle: string;
  chartColor: string;
  backendData?: GraphData;
  loading: boolean;
  onDateRangeChange: (_startDate: Date, _endDate: Date) => void;
}

export const AreaGraph: React.FC<AreaGraphProps> = ({
  chartTitle,
  chartSubTitle,
  backendData,
  loading,
  onDateRangeChange,
  chartColor,
}) => {
  const chartConfig = {
    data: {
      label: `${chartTitle} : `,
      color: chartColor,
    },
  } satisfies ChartConfig;
  const chartData = useTransformBackendData(backendData);
  return (
    <Card className='relative'>
      <CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
        <div className='grid flex-1 gap-1 text-center sm:text-left'>
          <CardTitle>{chartTitle}</CardTitle>
          <CardDescription>{chartSubTitle}</CardDescription>
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
        ) : chartData?.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className='aspect-auto h-[250px] w-full'
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id='fillData' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--color-data)'
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--color-data)'
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray='3 3' />
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
                tickFormatter={(value: { toLocaleString: () => any }) =>
                  value.toLocaleString()
                } // You can adjust the formatter as needed
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
                dataKey='data'
                type='natural'
                fill='url(#fillData)'
                stroke='var(--color-data)'
                stackId='a'
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        ) : (
          <Typography className='mx-auto my-auto text-center p-9 text-gray-400'>
            No data available
          </Typography>
        )}
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 font-medium leading-none'>
              {/* <TrendingUp className='h-4 w-4' /> */}
            </div>
            <div className='flex items-center gap-2 leading-none text-muted-foreground'></div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

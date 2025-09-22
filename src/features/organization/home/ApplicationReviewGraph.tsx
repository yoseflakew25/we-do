'use client';

import { DatePickerWithRange } from '@/features/admin/components/DatePickerWithRange';
import { GraphData } from '@/app/api/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/Chart';
import { Spinner, Typography } from '@material-tailwind/react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useTransformBackendData } from '@/hook';
import { OpportunitySelector } from '../components/OpportunitySelector';


interface ApplicantionReviewGraphProp {
  chartTitle: string;
  chartSubTitle: string;
  chartColor: string;
  backendData?: GraphData;
  loading: boolean;
  opportunities?: { id: string; name: string }[];
  onDateRangeChange: (_startDate: Date, _endDate: Date) => void;
  onOpportunityChange: (_opportunityId: string) => void;
}

export const ApplicantionReviewGraph: React.FC<ApplicantionReviewGraphProp> = ({
  chartTitle,
  chartSubTitle,
  chartColor,
  backendData,
  loading,
  opportunities,
  onDateRangeChange,
  onOpportunityChange,
}) => {

  const chartConfig = {
    data: {
      label: `${chartTitle} : `,
      color: chartColor,
    },
  } satisfies ChartConfig;

  const chartData = useTransformBackendData(backendData);



  return (
    <Card className='relative border border-boundery rounded-lg h-full mb-4'>
      <CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
        <div className='flex flex-col lg:flex-row gap-1 text-center sm:text-left'>
          <div className='flex flex-col'>
          <CardTitle className='text-sm md:text-md lg:text-lg font-normal'>{chartTitle}</CardTitle>
          <CardDescription className='hidden xl:flex xl:text-base text-neutrals60'>{chartSubTitle}</CardDescription>
          </div>
        <DatePickerWithRange onDateRangeChange={onDateRangeChange} />
        <OpportunitySelector opportunities={opportunities} onOpportunityChange={onOpportunityChange}/>
        </div>
      </CardHeader>

      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        {
        loading ? (
          <div className='absolute inset-4 mt-8 h-full w-full flex items-center justify-center z-10'>
            <Spinner className='mt-8'/>
          </div>
        ) : 
        chartData?.length > 0 ? (
          <ChartContainer className='aspect-auto h-[250px] w-full' config={chartConfig}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id='fillData' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor={chartColor} stopOpacity={0.8} />
                  <stop offset='95%' stopColor={chartColor} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='date'
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                }
              />
              <YAxis tickFormatter={(value) => value.toLocaleString()} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    }
                  />
                }
              />
              <Area
                dataKey='data'
                type='natural'
                fill={`url(#fillData)`}
                stroke={chartColor}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <Typography className='text-center text-gray-400'>No data available</Typography>
        )}
      </CardContent>
      <CardFooter />
    </Card>
  );
};
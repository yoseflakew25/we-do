'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/Chart';
import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';
import { useTranslations } from 'next-intl';

interface StatusData {
  labels: string[];
  data: number[];
}

interface ApplicantStatusGraphProps {
  statusData: StatusData;
  colors: string[]; // Add a colors prop
}

const chartConfig = {
  visitors: {
    label: 'Status Count',
  },
} satisfies ChartConfig;

export function ApplicantStatusGraph({
  statusData,
  colors,
}: ApplicantStatusGraphProps) {
  const chartData = statusData.labels.map((label, index) => ({
    browser: label,
    visitors: statusData.data[index],
    fill: colors[index % colors.length], // Use the provided colors
  }));
  const t = useTranslations('organizationDashboard')

  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, [chartData]);

  return (
    <Card className='flex flex-col border-none shadow-none'>
      <CardHeader className='items-center pb-0 '>
        <CardTitle className='font-normal text-neutrals80 text-sm md:text-md lg:text-lg'>{t('Applicants Review Graph')}</CardTitle>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[250px]'
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey='visitors'
              nameKey='browser'
              innerRadius={
                window.innerWidth >= 1200
                  ? 80
                  : window.innerWidth >= 992
                  ? 60
                  : window.innerWidth >= 768
                  ? 70
                  : 90
              }
              strokeWidth={15}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl'
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
'use client';

import ChartCard, { ChartCardProps } from './ChartCard';
import CommonChart from './CommonChart';
import { GraphData } from '@/app/api/types';
import { Select, Option, Typography } from '@material-tailwind/react';
import React, { useState } from 'react';

export const ChartColors = {
  ORGANIZATION: ['#C4897B', '#817FBB', '#CCCCF5'],
  OPPORTUNITY: ['#B35ED4', '#F0DFF7'],
  VOLUNTEER: ['#3474DF', '#D9E6F9'],
};

interface CategoryChartProps extends Omit<ChartCardProps, 'children'> {
  chartData: GraphData;
  dataName: string;
  chartType: 'bar' | 'donut' | 'pie';
  colors?: string[];
}

export const CategoryChart: React.FC<CategoryChartProps> = ({
  chartData,
  chartType,
  dataName,
  colors,
  ...chartCardProps
}) => {
  return (
    <ChartCard {...chartCardProps}>
      <CommonChart
        type={chartType}
        labels={chartData.labels}
        seriesData={[{ name: dataName, data: chartData.data }]}
        options={{ colors: colors }}
      />
    </ChartCard>
  );
};

interface TimeSeriesChartProps extends Omit<ChartCardProps, 'children'> {
  chartData?: GraphData;
  dataName: string;
  defaultChartType?: 'area' | 'bar';
  showTypeSelector?: boolean;
  colors?: string[];
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  chartData,
  dataName,
  defaultChartType = 'area',
  filters = [],
  colors,
  showTypeSelector = true,
  ...chartCardProps
}) => {
  const [chartType, setChartType] = useState<'area' | 'bar'>(defaultChartType);
  // const newData = chartData?.data.slice(1).map((x, i) => x - chartData.data[i]);
  const displayedData = chartType == 'area' ? chartData?.data : chartData?.data; // TODO: use newData here when backend sends the total by default
  const displayedLabels =
    chartType == 'area'
      ? chartData?.labels.slice(1)
      : chartData?.labels.slice(1); // TODO: use .slice(1) here when backend sends the total by default

  const lastTwoValues = chartData?.data.slice(-2);
  const [prevValue, latestValue] = lastTwoValues ?? [undefined, undefined];

  const defaultSelector = showTypeSelector
    ? [
        <Select
          key='type-selector'
          value={chartType}
          color='amber'
          label='Graph Type'
          onChange={(value) => setChartType(value as 'area' | 'bar')}
        >
          <Option value='area'>Total</Option>
          <Option value='bar'>New</Option>
        </Select>,
      ]
    : [];

  return (
    <ChartCard
      {...chartCardProps}
      totalCount={
        chartCardProps.totalCount ||
        (latestValue == null
          ? undefined
          : {
              value: latestValue,
              previous: prevValue,
            })
      }
      filters={[...filters, ...defaultSelector]}
    >
      {displayedData != null && displayedLabels != null ? (
        <CommonChart
          type={chartType}
          labels={displayedLabels}
          seriesData={[{ name: dataName, data: displayedData }]}
          xAxisType='datetime'
          options={{ colors: colors }}
        />
      ) : (
        !chartCardProps.loading && (
          <Typography className='mx-auto my-auto text-center p-9 text-gray-400'>
            Could not load data
          </Typography>
        )
      )}
    </ChartCard>
  );
};

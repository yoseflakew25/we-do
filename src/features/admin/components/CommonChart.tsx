import { merge } from 'lodash';
import dynamic from 'next/dynamic';
import { ComponentProps } from 'react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface CommonChartProps extends ComponentProps<typeof Chart> {
  labels: string[];
  seriesData: Array<{ name: string; data: number[] }>;
  xAxisType?: 'category' | 'datetime' | 'numeric';
}

const CommonChart: React.FC<CommonChartProps> = ({
  labels,
  seriesData,
  xAxisType,
  type,
  ...chartProps
}) => {
  const defaultOptions = {
    ...chartProps.options,
    chart: {
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: chartProps.options?.colors || [
      '#3f51b5',
      '#020617',
      '#009688',
      '#ff8f00',
      '#03a9f4',
      '#e91e63',
      '#9e9e9e',
      '#ffeb3b',
    ],

    xaxis: {
      ...chartProps.options?.xaxis,
      type: xAxisType,
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        style: {
          colors: '#616161',
          fontSize: '12px',
          fontFamily: 'inherit',
          fontWeight: 400,
        },
      },
      categories: labels,
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      ...chartProps.options?.yaxis,
      labels: {
        style: {
          colors: '#616161',
          fontSize: '12px',
          fontFamily: 'inherit',
          fontWeight: 400,
        },
      },
    },
    grid: {
      ...chartProps.options?.grid,
      show: true,
      borderColor: '#dddddd',
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 5,
        right: 20,
      },
    },
    fill: {
      opacity: 0.8,
    },
    tooltip: {
      theme: 'light',
    },
  };
  const commonConfig: ComponentProps<typeof Chart> = {
    width: chartProps.width || '100%',
    height: chartProps.height || '100%',
    ...chartProps,
    type: type,
    series: seriesData,
    options: merge(defaultOptions, chartProps.options),
  };

  const renderChart = (type?: ComponentProps<typeof Chart>['type']) => {
    switch (type) {
      case 'bar':
        return <BarChart commonConfig={commonConfig} />;
      case 'line':
      case 'area':
        return <LineChart commonConfig={commonConfig} />;

      case 'pie':
      case 'donut':
        return (
          <DonutChart
            commonConfig={{
              ...commonConfig,
              options: {
                ...commonConfig.options,
                labels,
              },
              series: seriesData.map(({ data }) => data).pop(),
            }}
          />
        );

      default:
        return <Chart {...commonConfig} />;
    }
  };
  return renderChart(type);
};

export default CommonChart;

interface BarChartProps {
  commonConfig: ComponentProps<typeof Chart>;
}

const BarChart: React.FC<BarChartProps> = ({ commonConfig }) => {
  const chartConfig: ComponentProps<typeof Chart> = {
    ...commonConfig,
    options: {
      ...commonConfig.options,
      plotOptions: {
        bar: {
          columnWidth: '40%',
          borderRadius: 2,
        },
      },
    },
  };

  return <Chart {...chartConfig} />;
};

interface LineChartProps {
  commonConfig: ComponentProps<typeof Chart>;
}

const LineChart: React.FC<LineChartProps> = ({ commonConfig }) => {
  const chartConfig: ComponentProps<typeof Chart> = {
    ...commonConfig,
    options: {
      ...commonConfig.options,
      stroke: {
        lineCap: 'round',
        curve: 'smooth',
      },
      markers: {
        size: 0,
      },
    },
  };

  return <Chart {...chartConfig} />;
};

const DonutChart: React.FC<LineChartProps> = ({ commonConfig }) => {
  const chartConfig: ComponentProps<typeof Chart> = {
    ...commonConfig,
    options: merge(
      {
        ...commonConfig.options,
        tooltip: {
          theme: 'dark',
        },
        plotOptions: {
          pie: {
            donut: {
              size: '50%',
            },
          },
        },
      },
      commonConfig.options
    ),
  };

  return <Chart {...chartConfig} />;
};

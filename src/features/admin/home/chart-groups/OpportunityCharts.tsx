import { AreaGraph } from '../../components/AreaChart';
import { CategoryChart, ChartColors } from '../../components/DashboardCards';
import NumberCard from '../../components/NumberCard';
import {
  useGetOpportunityCountsByStatusQuery,
  useGetOpportunityTotalCountsInTimeQuery,
} from '@/app/api/slices/chart-api-slice';
import { useState } from 'react';
import { RiHandCoinFill } from 'react-icons/ri';

const totalOpportunityFilter = {
  startDate: new Date(Date.parse('2023-10-01')),
  endDate: new Date(Date.now()),
};

export const OpportunityCharts: React.FC = () => {
  const [opportunityCountByStatusFilters, setOpportunityCountByStatusFilters] =
    useState({
      startDate: new Date(Date.parse('2023-10-01')),
      endDate: new Date(Date.now()),
    });

  const {
    data: opportunityCountByStatusData,
    isFetching: isFetchingOpportunityCountByStatusData,
  } = useGetOpportunityCountsByStatusQuery(totalOpportunityFilter);

  const {
    data: opportunityCountByCreationData,
    isFetching: isFetchingOpportunityCountByCreationData,
  } = useGetOpportunityTotalCountsInTimeQuery(opportunityCountByStatusFilters);

  const handleOpportunityCountChartDateRangeChange = (
    startDate: Date,
    endDate: Date
  ) => {
    setOpportunityCountByStatusFilters((prevFilters) => ({
      ...prevFilters,
      startDate,
      endDate,
    }));
  };

  return (
    <section className='flex flex-col gap-5'>
      <div className='grid grid-cols-3 gap-4'>
        <NumberCard
          title={'Total Opportunities Created'}
          value={
            opportunityCountByStatusData?.data.data.reduce(
              (total: number, count: number) => total + count,
              0
            ) || 0
          }
          iconRenderer={(props) => <RiHandCoinFill {...props} />}
          theme='opportunity'
          action={{
            link: '/admin/opportunities',
            name: 'View All Opportunities',
          }}
          vertical
          loading={isFetchingOpportunityCountByStatusData}
        />

        <CategoryChart
          className='cols col-span-2'
          dataName='Opportunities'
          chartData={{
            labels: [...(opportunityCountByStatusData?.data.labels || [])],
            data: [...(opportunityCountByStatusData?.data.data || [])],
          }}
          chartType={'donut'}
          title={'Opportunities by Status'}
          colors={ChartColors.OPPORTUNITY}
          loading={isFetchingOpportunityCountByStatusData}
        />
      </div>

      {/* <TimeSeriesChart
        dataName='Opportunities'
        chartData={{
          labels: [...(opportunityCountByCreationData?.data.labels || [])],
          data: [...(opportunityCountByCreationData?.data.data || [])],
        }}
        title={'Opportunity Creation'}
        colors={ChartColors.OPPORTUNITY}
        totalCount={{
          value: 321,
          previous: 242,
        }}
        loading={isFetchingOpportunityCountByCreationData}
      /> */}

      <AreaGraph
        chartTitle='Opportunity Creation'
        chartSubTitle='Showing opportunity creation over the selected period of time'
        backendData={opportunityCountByCreationData?.data}
        loading={isFetchingOpportunityCountByCreationData}
        onDateRangeChange={handleOpportunityCountChartDateRangeChange}
        chartColor='hsl(283, 58%, 60%)'
      />
    </section>
  );
};

export default OpportunityCharts;

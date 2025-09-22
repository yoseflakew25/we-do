import { AreaGraph } from '../../components/AreaChart';
import { CategoryChart, ChartColors } from '../../components/DashboardCards';
import NumberCard from '../../components/NumberCard';
import {
  useGetGroupedOrganizationCountsQuery,
  useGetOrganizationViewsInTimeQuery,
} from '@/app/api/slices/chart-api-slice';
import { useState } from 'react';
import { BsBuildingsFill } from 'react-icons/bs';

export const OrganizationCharts: React.FC = () => {
  const currentDate = new Date();
  const [groupedOrganizationsFilters, setGroupedOrganizationsFilters] =
    useState<{
      startDate: Date;
      endDate: Date;
      groupBy: 'orgType' | 'userProfileStatus';
    }>({
      // startDate: new Date(Date.parse('2023-10-01')),
      startDate: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 6,
        currentDate.getDate()
      ),
      endDate: new Date(Date.now()),
      groupBy: 'userProfileStatus',
    });

  const {
    data: groupedOrgCountData,
    isFetching: isFetchingGroupedOrgCountData,
  } = useGetGroupedOrganizationCountsQuery(groupedOrganizationsFilters);

  const { data: orgViewByTimeData, isFetching: isFetchingOrgViewByTimeData } =
    useGetOrganizationViewsInTimeQuery(groupedOrganizationsFilters);

  const handleOrganizationViewsChartDateRangeChange = (
    startDate: Date,
    endDate: Date
  ) => {
    setGroupedOrganizationsFilters((prevFilters) => ({
      ...prevFilters,
      startDate,
      endDate,
    }));
  };

  return (
    <section className='flex flex-col gap-5'>
      <div className='grid grid-cols-3 gap-4'>
        <NumberCard
          title={'Total Organizations Registered'}
          value={
            // here just adding the verified and unverified orgs count
            groupedOrgCountData?.data?.data?.[2] || 0
            // (groupedOrgCountData?.data?.data?.[1] || 0)
          }
          iconRenderer={(props) => <BsBuildingsFill {...props} />}
          theme='organization'
          vertical
          loading={isFetchingGroupedOrgCountData}
        />

        <CategoryChart
          className='cols col-span-2'
          dataName='Organizations'
          chartData={{
            labels: [...(groupedOrgCountData?.data.labels || [])],
            data: [...(groupedOrgCountData?.data.data || [])],
          }}
          chartType={'donut'}
          title={'Organizations by Status'}
          colors={ChartColors.ORGANIZATION}
          loading={isFetchingGroupedOrgCountData}
        />
      </div>

      {/* <TimeSeriesChart
        dataName='Website Visits'
        chartData={{
          labels: [...(orgViewByTimeData?.data.labels || [])],
          data: [...(orgViewByTimeData?.data.data || [])],
        }}
        title={'Daily NGO Website Visits'}
        colors={ChartColors.ORGANIZATION}
        totalCount={{
          value: 321,
          previous: 325,
        }}
        loading={isFetchingOrgViewByTimeData}
      /> */}

      <AreaGraph
        chartTitle='Daily Organization Website Visits'
        chartSubTitle='Showing daily organization website visits over the selected date range'
        backendData={orgViewByTimeData?.data}
        loading={isFetchingOrgViewByTimeData}
        onDateRangeChange={handleOrganizationViewsChartDateRangeChange}
        chartColor='hsl(242, 31%, 62%)'
      />
    </section>
  );
};

export default OrganizationCharts;

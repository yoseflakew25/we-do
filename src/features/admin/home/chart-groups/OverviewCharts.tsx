import { AreaGraph } from '../../components/AreaChart';
import { DailyActiveUsersChart } from '../../components/DailyActiveUsersChart';
// import { TimeSeriesChart, ChartColors } from '../../components/DashboardCards';
import NumberCard from '../../components/NumberCard';
import { StatusCard } from '../../components/StatusCard';
import RecentActivities from '../RecentActivities';
import RecentAggregates from '../RecentAggregates';
import {
  useGetApplicationCountByStatusQuery,
  useGetDailyActiveUsersCountQuery,
  useGetRecentAggregatesQuery,
  useGetUserSignupsInTimeQuery,
} from '@/app/api/slices/chart-api-slice';
import { ComponentProps, useState } from 'react';
import { BsBuildingsFill } from 'react-icons/bs';
import { RiHandCoinFill } from 'react-icons/ri';

type Filters = {
  startDate: Date;
  endDate: Date;
  role: 'user';
};

export const OverviewCharts: React.FC = () => {
  const [dailyActiveUsersFilters, setDailyActiveUsersFilters] =
    useState<Filters>({
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 2)),
      endDate: new Date(Date.now()),
      role: 'user' as 'user',
    });

  const { data: dailyActiveUsersData, isFetching: isFetchingDailyActiveUsers } =
    useGetDailyActiveUsersCountQuery(dailyActiveUsersFilters);

  const handleActiveUsersChartDateRangeChange = (
    startDate: Date,
    endDate: Date
  ) => {
    setDailyActiveUsersFilters((prevFilters) => ({
      ...prevFilters,
      startDate,
      endDate,
    }));
  };

  // Fetching Opportunity Views
  // const [opportunityViewsFilters] = useState({
  //   startDate: new Date(Date.parse('2023-10-01')),
  //   endDate: new Date(Date.now()),
  // });
  // const { data: opportunityViewsData, isFetching: isFetchingOpportunityViews } =
  //   useGetOpportunityViewsInTimeQuery(opportunityViewsFilters);

  // Fetching User Signups
  const [userSignupsFilters, setUserSignupsFilters] = useState<Filters>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 2)),
    endDate: new Date(Date.now()),
    role: 'user' as 'user',
  });

  const { data: userSignupsData, isFetching: isFetchingUserSignups } =
    useGetUserSignupsInTimeQuery(userSignupsFilters);

  const handleUserSignupsChartDateRangeChange = (
    startDate: Date,
    endDate: Date
  ) => {
    setUserSignupsFilters((prevFilters) => ({
      ...prevFilters,
      startDate,
      endDate,
    }));
  };

  // Fetching Applicant Status
  const [statusCardFilters, setStatusCardFilters] = useState<{
    startDate: Date;
    endDate: Date;
  }>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date(Date.now()),
  });

  const { data: applicationData, isFetching: isFetchingApplicationData } =
    useGetApplicationCountByStatusQuery(statusCardFilters);

  const handleStatusCardDateRangeChange = (startDate: Date, endDate: Date) => {
    setStatusCardFilters((prevFilters) => ({
      ...prevFilters,
      startDate,
      endDate,
    }));
  };

  // Fetching aggregates for number cards
  const [aggregatesFilters] = useState({
    startDate: new Date(Date.parse('2010-10-01')),
    endDate: new Date(Date.now()),
    role: 'user',
  });
  const { data: aggregatesData, isFetching: isFetchingAggregates } =
    useGetRecentAggregatesQuery(aggregatesFilters);

  const aggregates: ComponentProps<typeof NumberCard>[] = [
    {
      title: 'Verified Organizations ',
      iconRenderer: (props) => <BsBuildingsFill {...props} />,
      action: {
        link: '/admin/organizations',
        name: 'View All Organizations',
      },
      theme: 'organization',
      value: aggregatesData?.data['newNgoRegistered'] || 0,
    },
    {
      title: 'Opportunities Created',
      iconRenderer: (props) => <RiHandCoinFill {...props} />,
      action: {
        link: '/admin/opportunities',
        name: 'View All Opportunities',
      },
      theme: 'opportunity',
      value: aggregatesData?.data['newOpportunities'] || 0,
    },
    {
      title: 'Opportunity seekers Registered',
      iconRenderer: (props) => <RiHandCoinFill {...props} />,
      action: {
        link: '/admin/users?role=user',
        name: 'View All Opportunity Seekers',
      },
      theme: 'volunteer',
      value: aggregatesData?.data['newVolunteers'] || 0,
    },
  ];

  return (
    <section className='grid grid-cols-3 gap-4 py-3'>
      <div className='flex flex-col gap-5 col-span-2'>
        <div className='grid grid-cols-3 gap-4'>
          {aggregates.map((props) => (
            <NumberCard
              key={props.title}
              {...props}
              loading={isFetchingAggregates}
            />
          ))}
        </div>
        <DailyActiveUsersChart
          backendData={
            dailyActiveUsersData?.data ? dailyActiveUsersData.data : undefined
          }
          loading={isFetchingDailyActiveUsers}
          onDateRangeChange={handleActiveUsersChartDateRangeChange}
        />

        {/* <div className='grid grid-cols-12 gap-4'>
          <TimeSeriesChart
            className='col-span-5'
            dataName='Active Users'
            chartData={dailyActiveUsersData?.data.user}
            title={'Daily Active Users'}
            colors={ChartColors.ORGANIZATION}
            showTypeSelector={false}
            loading={isFetchingDailyActiveUsers}
          />

          <TimeSeriesChart
            className='col-span-7'
            dataName='Views'
            chartData={opportunityViewsData?.data}
            title={'Views on Opportunities'}
            colors={ChartColors.OPPORTUNITY}
            showTypeSelector={false}
            defaultChartType='bar'
            loading={isFetchingOpportunityViews}
          />
        </div> */}

        {/* <TimeSeriesChart
          dataName='Volunteers'
          chartData={userSignupsData?.data}
          title={'Volunteer Signups'}
          colors={ChartColors.VOLUNTEER}
          showTypeSelector={true}
          loading={isFetchingUserSignups}
        /> */}

        <AreaGraph
          chartTitle='Opportunity Seeker Sign ups'
          chartSubTitle='Showing daily opportunity seeker sign ups'
          backendData={userSignupsData?.data}
          loading={isFetchingUserSignups}
          onDateRangeChange={handleUserSignupsChartDateRangeChange}
          chartColor='hsl(216 92% 60%)'
        />
      </div>

      <div>
        <RecentAggregates className='flex-2 mb-5' />
        <StatusCard
          loading={isFetchingApplicationData}
          applicationData={applicationData?.data}
          onDateRangeChange={handleStatusCardDateRangeChange}
        />
        <RecentActivities className='flex-2' />
      </div>
    </section>
  );
};

export default OverviewCharts;

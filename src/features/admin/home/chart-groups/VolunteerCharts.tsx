import { AreaGraph } from '../../components/AreaChart';
import {
  CategoryChart,
  ChartColors,
  TimeSeriesChart,
} from '../../components/DashboardCards';
import NumberCard from '../../components/NumberCard';
import {
  useGetApplicationSubmissionCountQuery,
  useGetAppliedVolunteerCountQuery,
  useGetRecentAggregatesQuery,
  useGetVolunteerCountByGenderQuery,
} from '@/app/api/slices/chart-api-slice';
import { useState } from 'react';
import { ImUsers } from 'react-icons/im';

export const VolunteerCharts: React.FC = () => {
  const [applicationsCountFilter, setApplicationsCountFilter] = useState({
    startDate: new Date(Date.parse('2023-10-01')),
    endDate: new Date(Date.now()),
  });

  const {
    data: volunteerCountByGenderData,
    isFetching: isFetchingCountByGender,
  } = useGetVolunteerCountByGenderQuery();

  const {
    data: submittedApplicationsData,
    isFetching: isFetchingsubmittedApplicationsData,
  } = useGetApplicationSubmissionCountQuery(applicationsCountFilter);

  const handleApplicationSubmissionChartDateRangeChange = (
    startDate: Date,
    endDate: Date
  ) => {
    setApplicationsCountFilter((prevFilters) => ({
      ...prevFilters,
      startDate,
      endDate,
    }));
  };

  const {
    data: appliedVolunteersData,
    isFetching: isFetchingAppliedVolunteersData,
  } = useGetAppliedVolunteerCountQuery(applicationsCountFilter);

  // to fetch total volunteer count
  const [aggregatesFilters] = useState({
    startDate: new Date(Date.parse('2010-10-01')),
    endDate: new Date(Date.now()),
    role: 'user',
  });

  const { data: aggregatesData, isFetching: isFetchingAggregates } =
    useGetRecentAggregatesQuery(aggregatesFilters);

  return (
    <section className='flex flex-col gap-5'>
      <div className='grid grid-cols-3 gap-4'>
        <NumberCard
          title={'Total Opportunity Seekers Registered'}
          value={aggregatesData?.data['newVolunteers'] || 0}
          iconRenderer={(props) => <ImUsers {...props} />}
          theme='volunteer'
          action={{
            link: '/admin/users',
            name: 'View All Opportunity Seekers',
          }}
          vertical
          loading={isFetchingAggregates}
        />

        <TimeSeriesChart
          dataName='Opportunity Seekers'
          chartData={appliedVolunteersData?.data}
          title={'Daily Applications Count'}
          colors={ChartColors.VOLUNTEER}
          showTypeSelector={false}
          defaultChartType='bar'
          loading={isFetchingAppliedVolunteersData}
        />

        <CategoryChart
          dataName='Opportunity Seekers'
          chartData={{
            labels: ['Male', 'Female'],
            data: [
              volunteerCountByGenderData?.data.male || 0,
              volunteerCountByGenderData?.data.female || 0,
            ],
          }}
          chartType={'pie'}
          title={'Opportunity Seekers by Gender'}
          colors={ChartColors.VOLUNTEER}
          loading={isFetchingCountByGender}
        />
      </div>

      {/* <TimeSeriesChart
        dataName='Applications count'
        chartData={submittedApplicationsData?.data}
        title={'Daily Applications Count'}
        colors={ChartColors.VOLUNTEER}
        totalCount={{
          value: 321,
        }}
        loading={isFetchingsubmittedApplicationsData}
      /> */}

      <AreaGraph
        chartTitle='Daily Applications Count'
        chartSubTitle='Showing daily applications count over the selected date range'
        backendData={submittedApplicationsData?.data}
        loading={isFetchingsubmittedApplicationsData}
        onDateRangeChange={handleApplicationSubmissionChartDateRangeChange}
        chartColor='hsl(218, 73%, 54%)'
      />
    </section>
  );
};

export default VolunteerCharts;

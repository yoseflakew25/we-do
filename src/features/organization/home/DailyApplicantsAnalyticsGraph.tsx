'use client';

import { useGetDailyApplicationStatusGraphQuery } from '@/app/api/slices/chart-api-slice';
import { useGetOrgOpportunitiesQuery } from '@/app/api/slices/opportunity-api-slice';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ApplicantionReviewGraph } from '../components/ApplicantionReviewGraph';

type Filters = {
  startDate: Date;
  endDate: Date;
  eventID: string;
};

const ApplicantAnalyticsGraph: React.FC = () => {
  const currentDate = new Date();
  const t = useTranslations('organizationDashboard')
  const [dailyApplicants, setDailyApplicants] = useState<Filters>({
    startDate: new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, currentDate.getDate()),
    endDate: new Date(Date.now()),
    eventID: '',
  });

  const {
    data: dailyApplicationData,
    isFetching: isFetchingDailyApplicationData,
  } = useGetDailyApplicationStatusGraphQuery( dailyApplicants);


  const {
    data: opportunities,
  } = useGetOrgOpportunitiesQuery(undefined);


  const transformedOpportunities =
    opportunities?.data.map((opportunity) => ({
      id: opportunity.id,
      name: opportunity.title,
    })) || [];


  const handleActiveApllicantsChartDateRangeChange = (
    startDate: Date,
    endDate: Date,
  ) => {
    setDailyApplicants((prevFilters) => ({
      ...prevFilters,
      startDate: startDate || null,
      endDate: endDate || null,
    }));
  };

  const handleOpportunityChange = ( eventID: string) => {
    setDailyApplicants((prevFilters) => ({
      ...prevFilters,
      eventID,
    }))
  }


  return (
    <>
      <ApplicantionReviewGraph
        chartTitle={t('chartTitle')}
        chartSubTitle={t('chartSubTitle')}
        backendData={dailyApplicationData?.data}
        loading={isFetchingDailyApplicationData}
        onDateRangeChange={handleActiveApllicantsChartDateRangeChange}
        opportunities={transformedOpportunities}
        onOpportunityChange={handleOpportunityChange}
        chartColor='#0FB957'
      />
    </>
  );
};

export default ApplicantAnalyticsGraph;
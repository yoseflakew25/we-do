'use client';

import { useGetOrgOpportunityByIdQuery } from '@/app/api/slices/opportunity-api-slice';
import ErrorPage from '@/components/ErrorPage';
import LoadingPage from '@/components/LoadingPage';
import DeatilPage from '@/features/volunteer-mini/opportunities/OpportunityDetails';

function VolunteerOpportunityPage({ params }: { params: { id: string } }) {
  const {
    data: opportunityResponse,
    isFetching: isFetchingOpportunity,
    isError: isOpportunityError,
  } = useGetOrgOpportunityByIdQuery(params.id);

  if (isFetchingOpportunity) {
    return <LoadingPage />;
  }

  if (isOpportunityError || !opportunityResponse?.data) {
    return <ErrorPage imageName='404.svg' title='Opportunity not found' />;
  }

  return <DeatilPage opportunityData={opportunityResponse?.data} />;
}

export default VolunteerOpportunityPage;

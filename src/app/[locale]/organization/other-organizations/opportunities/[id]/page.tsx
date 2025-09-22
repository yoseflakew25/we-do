'use client';

import { useGetOrgOpportunityByIdQuery } from '@/app/api/slices/opportunity-api-slice';
import { useGetOrgProfileQuery } from '@/app/api/slices/org-api-slice';
import ErrorPage from '@/components/ErrorPage';
import LoadingPage from '@/components/LoadingPage';
import Header from '@/features/organization/components/Header';
import OpportunityDetails from '@/features/volunteer/opportunties/OpportunityDetails';
import { useOrgLogo } from '@/hook';

function OtherOrgDetailPage({ params }: { params: { id: string } }) {
  const getOrgLogo = useOrgLogo();
  const {
    data: opportunityResponse,
    isFetching: isFetchingOpportunity,
    isError,
  } = useGetOrgOpportunityByIdQuery(params.id);

  const { data: orgDetail, isFetching: isFetchingOrgProfile } =
    useGetOrgProfileQuery();

  if (isFetchingOpportunity || isFetchingOrgProfile) {
    return <LoadingPage />;
  }

  if (isError || !opportunityResponse) {
    return <ErrorPage imageName='404.svg' title='Opportunity not found' />;
  }

  return (
    <>
      <Header
        logoUrl={getOrgLogo(orgDetail?.data.LogoUrl)}
        title={orgDetail?.data.orgName}
      />
      <OpportunityDetails formData={opportunityResponse.data} />
    </>
  );
}

export default OtherOrgDetailPage;

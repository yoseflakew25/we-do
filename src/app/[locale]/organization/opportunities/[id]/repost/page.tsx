'use client';

import { useGetOrgOpportunityByIdQuery } from '@/app/api/slices/opportunity-api-slice';
import { useGetOrgProfileQuery } from '@/app/api/slices/org-api-slice';
import ErrorPage from '@/components/ErrorPage';
import LoadingPage from '@/components/LoadingPage';
import Header from '@/features/organization/components/Header';
import RepostOpportunity from '@/features/organization/opportunities/post/RepostOpportunity';
import { useOrgLogo } from '@/hook';
import { Typography } from '@material-tailwind/react';
import React from 'react';

function RepostOpportunityPage({ params }: { params: { id: string } }) {
  const {
    data: opportunityResponse,
    isFetching: isFetchingOpportunity,
    isError: isOpportunityError,
    refetch,
  } = useGetOrgOpportunityByIdQuery(params.id);

  const refetchOpportunity = async () => {
    await refetch();
  };

  if (isFetchingOpportunity) {
    return <LoadingPage />;
  }

  if (isOpportunityError || !opportunityResponse?.data) {
    return <ErrorPage imageName='404.svg' title='Opportunity not found' />;
  }

  return (
    <>
      <OrgProfileHeader />
      <div>
        <RepostOpportunity
          id={params.id}
          opportunityData={opportunityResponse.data}
          refetchOpportunity={refetchOpportunity}
        />
      </div>
    </>
  );
}

export default RepostOpportunityPage;

function OrgProfileHeader() {
  const getOrgLogo = useOrgLogo();
  const {
    data: orgProfileResponse,
    isFetching: isFetchingOrgProfile,
    isError: isOrgError,
  } = useGetOrgProfileQuery();

  if (isFetchingOrgProfile) {
    return <Typography>Loading...</Typography>;
  }

  if (isOrgError || !orgProfileResponse?.data) {
    return <Typography>Something went wrong</Typography>;
  }

  return (
    <Header
      logoUrl={getOrgLogo(orgProfileResponse.data.LogoUrl)}
      title={orgProfileResponse.data.orgName}
    />
  );
}

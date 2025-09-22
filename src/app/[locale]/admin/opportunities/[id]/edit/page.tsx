'use client';

import { useGetOrgOpportunityByIdQuery } from '@/app/api/slices/opportunity-api-slice';
import { useGetOrgDetailByIDQuery } from '@/app/api/slices/org-api-slice';
import ErrorPage from '@/components/ErrorPage';
import LoadingPage from '@/components/LoadingPage';
import Header from '@/features/organization/components/Header';
import EditOpportunity from '@/features/organization/opportunities/post/EditOpportunity';
import { useOrgLogo } from '@/hook';
import { Typography } from '@material-tailwind/react';
import React from 'react';

function EditOpportunityPage({ params }: { params: { id: string } }) {
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
      <OrgProfileHeader orgID={opportunityResponse.data.orgID} />
      <div>
        <EditOpportunity
          id={params.id}
          opportunityData={opportunityResponse.data}
          refetchOpportunity={refetchOpportunity}
        />
      </div>
    </>
  );
}

export default EditOpportunityPage;

function OrgProfileHeader({ orgID }: { orgID: string }) {
  const getOrgLogo = useOrgLogo();
  const {
    data: orgProfileResponse,
    isFetching: isFetchingOrgProfile,
    isError: isOrgError,
  } = useGetOrgDetailByIDQuery(orgID);

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

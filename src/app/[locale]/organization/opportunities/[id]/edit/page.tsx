'use client';

import { useGetOrgOpportunityByIdQuery } from '@/app/api/slices/opportunity-api-slice';
import { useGetOrgProfileQuery } from '@/app/api/slices/org-api-slice';
import ErrorPage from '@/components/ErrorPage';
import LoadingPage from '@/components/LoadingPage';
import Header from '@/features/organization/components/Header';
import EditOpportunity from '@/features/organization/opportunities/post/EditOpportunity';
import { setQuestions } from '@/features/organization/org-side-custom-questions-slice';
import { useAppDispatch, useOrgLogo } from '@/hook';
import { Typography } from '@material-tailwind/react';
import React, { useEffect } from 'react';

function EditOpportunityPage({ params }: { params: { id: string } }) {
  const dispatch = useAppDispatch();
  const {
    data: opportunityResponse,
    isFetching: isFetchingOpportunity,
    isError: isOpportunityError,
    refetch,
  } = useGetOrgOpportunityByIdQuery(params.id);

  const refetchOpportunity = async () => {
    await refetch();
  };

  useEffect(() => {
    if (opportunityResponse) {
      dispatch(setQuestions(opportunityResponse.data.questions || []));
    }
  }, [opportunityResponse]);

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

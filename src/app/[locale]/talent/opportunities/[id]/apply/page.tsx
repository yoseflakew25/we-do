'use client';

import { useGetOrgOpportunityByIdQuery } from '@/app/api/slices/opportunity-api-slice';
import { useGetProfileQuery } from '@/app/api/slices/volunteer-api-slice';
import ErrorPage from '@/components/ErrorPage';
import LoadingPage from '@/components/LoadingPage';
import CustomQuestionForm from '@/features/volunteer/components/ApplicationsWithCustomQuestions';
import React from 'react';

function ApplyPage({ params }: { params: { id: string } }) {
  const {
    data: opportunityDetail,
    isFetching: isFetchingOpportunity,
    isError,
  } = useGetOrgOpportunityByIdQuery(params.id);

  const { data: userProfileData } = useGetProfileQuery();

  if (isFetchingOpportunity) {
    return <LoadingPage />;
  }

  if (isError || !opportunityDetail) {
    return <ErrorPage imageName='404.svg' title='Opportunity not found' />;
  }

  const opportunityResponse = opportunityDetail.data;

  return (
    <>
      <title>HOOPOE - Opportunity Details</title>
      {opportunityResponse &&
        opportunityResponse.questions &&
        opportunityResponse.questions.length !== 0 && (
          <CustomQuestionForm
            questions={opportunityResponse.questions}
            opportunityId={opportunityResponse.id}
            orgLogo={opportunityResponse.logoUrl}
            opportunityTitle={opportunityResponse.title}
            orgName={opportunityResponse.orgName}
            orgId={opportunityResponse.orgID}
            opType={opportunityResponse.opType}
            datePosted={opportunityResponse.datePosted}
            userProfileData={userProfileData?.data}
          />
        )}
    </>
  );
}

export default ApplyPage;

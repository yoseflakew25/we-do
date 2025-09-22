'use client';

import { useGetOrgOpportunityByIdQuery } from '@/app/api/slices/opportunity-api-slice';
import { useGetOrgProfileQuery } from '@/app/api/slices/org-api-slice';
import ErrorPage from '@/components/ErrorPage';
import LoadingPage from '@/components/LoadingPage';
import Header from '@/features/organization/components/Header';
import ApplicantDetail from '@/features/organization/opportunities/applicant/ApplicantDetail';
import { useOrgLogo } from '@/hook';
import React from 'react';

function ApplicantDetailPage({
  params,
}: {
  params: { id: string; applicant_id: string };
}) {
  const getOrgLogo = useOrgLogo();
  const { data, isFetching, isError } = useGetOrgProfileQuery();
  const { data: opportunityData } = useGetOrgOpportunityByIdQuery(params.id);

  if (isFetching) {
    return <LoadingPage />;
  }

  if (isError || !data) {
    return <ErrorPage />;
  }

  const orgDetail = data.data;

  return (
    <section>
      <Header
        logoUrl={getOrgLogo(orgDetail.LogoUrl)}
        title={orgDetail.orgName}
      />
      <div>
        <ApplicantDetail
          opportunityData={opportunityData?.data}
          id={params.id}
          applicantion_id={params.applicant_id}
        />
      </div>
    </section>
  );
}

export default ApplicantDetailPage;
